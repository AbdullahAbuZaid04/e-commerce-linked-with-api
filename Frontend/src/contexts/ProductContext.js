import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getProductsApi, getProductBySlugApi, createProductApi, updateProductApi, deleteProductApi } from "../api/productService";
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from "../api/categoryService";
const ProductContext = createContext();

const resolveImage = (img) => {
  if (!img) return null;
  return img.startsWith("/") ? `${process.env.REACT_APP_API_URL}${img}` : img;
};

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: Number(p.price) || 0,
  image: resolveImage(p.images?.[0] || p.image || null),
  stockQuantity: Number(p.stock ?? p.stockQuantity) || 0,
  categoryId: p.category?.id ?? p.categoryId,
  categoryName: p.category?.name ?? p.categoryName,
  categorySlug: p.category?.slug ?? p.categorySlug,
  createdAt: p.createdAt,
});

export { mapProduct, resolveImage };

const mapCategory = (c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description || "",
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      const res = await getProductsApi(params);
      if (res && res.data) {
        setProducts(res.data.map(mapProduct));
        setTotalProducts(res.pagination?.total || res.data.length);
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
      setError(null);
      return res;
    } catch (err) {
      setProducts([]);
      setTotalProducts(0);
      setError(err.message || "فشل تحميل المنتجات");
      return null;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategoriesApi();
      if (res && res.data) {
        setCategories(res.data.map(mapCategory));
      } else {
        setCategories([]);
      }
      setError(null);
    } catch (err) {
      setCategories([]);
      setError(err.message || "فشل تحميل التصنيفات");
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    Promise.all([fetchProducts({ limit: "100" }), fetchCategories()]).finally(() => setLoading(false));
  }, [fetchProducts, fetchCategories]);

  const getProductBySlug = useCallback(async (slug) => {
    try {
      const res = await getProductBySlugApi(slug);
      if (res?.data) return mapProduct(res.data);
      return null;
    } catch {
      return null;
    }
  }, []);

  const addProduct = useCallback(async (product) => {
    try {
      await createProductApi({
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.image ? [product.image] : [],
        stock: product.stockQuantity,
        categoryId: product.categoryId,
      });
      await fetchProducts();
    } catch (err) {
      throw new Error(err.message || "فشل إضافة المنتج");
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const body = {};
      if (updates.name !== undefined) body.name = updates.name;
      if (updates.description !== undefined) body.description = updates.description;
      if (updates.price !== undefined) body.price = updates.price;
      if (updates.stockQuantity !== undefined) body.stock = updates.stockQuantity;
      if (updates.categoryId !== undefined) body.categoryId = updates.categoryId;
      if (updates.image !== undefined) body.images = updates.image ? [updates.image] : [];
      await updateProductApi(id, body);
      await fetchProducts();
    } catch (err) {
      throw new Error(err.message || "فشل تحديث المنتج");
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id) => {
    try {
      await deleteProductApi(id);
      await fetchProducts();
    } catch (err) {
      throw new Error(err.message || "فشل حذف المنتج");
    }
  }, [fetchProducts]);

  const addCategory = useCallback(async (category) => {
    try {
      await createCategoryApi({ name: category.name });
      await fetchCategories();
    } catch (err) {
      throw new Error(err.message || "فشل إضافة التصنيف");
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id, updates) => {
    try {
      await updateCategoryApi(id, { name: updates.name });
      await fetchCategories();
    } catch (err) {
      throw new Error(err.message || "فشل تحديث التصنيف");
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    try {
      await deleteCategoryApi(id);
      await fetchCategories();
      await fetchProducts();
    } catch (err) {
      throw new Error(err.message || "فشل حذف التصنيف");
    }
  }, [fetchCategories, fetchProducts]);

  const value = useMemo(() => ({
    products,
    totalProducts,
    categories,
    loading,
    error,
    getProductBySlug,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
  }), [products, totalProducts, categories, loading, error, getProductBySlug, fetchProducts, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
};
