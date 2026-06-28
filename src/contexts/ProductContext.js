import React, { createContext, useContext, useState } from "react";
import { initialProducts, initialCategories } from "../data/mockData";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  const addProduct = (product) => {
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    const cat = categories.find(c => c.id === parseInt(product.categoryId));
    setProducts(prev => [...prev, {
      ...product,
      id: maxId + 1,
      categoryName: cat ? cat.name : "",
      averageRating: 0,
    }]);
  };

  const updateProduct = (id, updates) => {
    const cat = categories.find(c => c.id === parseInt(updates.categoryId));
    setProducts(prev => prev.map(p =>
      p.id === parseInt(id) ? { ...p, ...updates, categoryName: cat ? cat.name : p.categoryName } : p
    ));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== parseInt(id)));
  };

  const addCategory = (category) => {
    const maxId = categories.reduce((max, c) => Math.max(max, c.id), 0);
    setCategories(prev => [...prev, { ...category, id: maxId + 1 }]);
  };

  const updateCategory = (id, updates) => {
    setCategories(prev => prev.map(c =>
      c.id === parseInt(id) ? { ...c, ...updates } : c
    ));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== parseInt(id)));
    setProducts(prev => prev.filter(p => p.categoryId !== parseInt(id)));
  };

  const value = {
    products,
    categories,
    loading: false,
    error: null,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
  };

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
