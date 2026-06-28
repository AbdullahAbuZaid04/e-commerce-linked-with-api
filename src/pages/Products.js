import { useState, useEffect, useMemo, useRef } from "react";
import {
  HiSearch,
  HiChevronRight,
  HiChevronLeft,
  HiRefresh,
} from "react-icons/hi";
import { useProducts } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const { products, loading, error } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [page, setPage] = useState(1);
  const productsPerPage = 8;

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.categoryName).filter(Boolean)),
    ];
    return ["الكل", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (selectedCategory !== "الكل") {
      filtered = filtered.filter((p) => p.categoryName === selectedCategory);
    }
    return filtered;
  }, [searchTerm, selectedCategory, products]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const productsRef = useRef(null);

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-15 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-3 text-lg font-bold text-[#64748b]">
          جاري تحميل المنتجات...
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-[#f8f9fa] min-h-screen relative overflow-hidden pb-10"
      dir="rtl"
    >
      {/* HEADER */}
      <div className="pt-10 pb-4 text-center relative z-[1]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="font-black text-[#1e293b] text-2xl md:text-4xl mb-3">
            استعرض <span className="text-primary">تشكيلتنا</span>
          </h2>
          <p className="text-[#64748b] text-base md:text-xl max-w-[700px] mx-auto mb-6 font-normal opacity-80">
            مجموعة مختارة بعناية من أفضل المنتجات العالمية بجودة استثنائية تصلك
            أينما كنت.
          </p>

          {/* SEARCH & FILTERS */}
          <div className="p-2.5 md:p-3.5 rounded-2xl border border-gray-200 bg-white mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              {/* SEARCH */}
              <div className="flex-1.5 w-full">
                {/* <div className="relative">
                  <HiSearch
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="ابحث عن اسم المنتج، التصنيف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[60px] pr-12 pl-4  bg-white border border-gray-200 transition-all duration-300 text-sm"
                  />
                </div> */}
                <div className="relative w-full">
                  <HiSearch
                    className="absolute start-4 top-1/2 -translate-y-1/2 text-primary"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="ابحث عن اسم المنتج، التصنيف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[60px] ps-12 pe-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300 text-sm text-right"
                  />
                </div>
              </div>

              {/* CATEGORIES */}
              <div className="flex-2 w-full overflow-hidden">
                <div className="flex gap-1 md:gap-1.5 items-center justify-center md:justify-start overflow-x-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                        selectedCategory === cat
                          ? "bg-primary text-white"
                          : "text-[#64748b] hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-[1]">
        {error && (
          <div className="bg-red-500 text-white p-4 mb-6 rounded-[20px] max-w-[600px] mx-auto text-center font-bold">
            {error}
          </div>
        )}

        {!error && currentProducts.length > 0 ? (
          <div ref={productsRef}>
            <div className="mb-6 flex justify-between items-center px-2 md:px-10">
              <h3 className="flex items-center gap-1.5 text-base md:text-xl font-extrabold text-[#1e293b]">
                قائمة المنتجات
                <span className="bg-primary text-white px-2.5 py-0.5 rounded-[20px] text-xs font-bold">
                  {filteredProducts.length} منتج
                </span>
              </h3>
              <span className="text-xs md:text-sm font-bold text-[#64748b]">
                الصفحة {page} / {totalPages}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              {currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-[fadeIn_0.5s_ease_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-10">
                <button
                  onClick={goToPrevPage}
                  disabled={page === 1}
                  className={`flex items-center gap-1 px-4 py-2.5 rounded-[14px] font-bold text-sm border-2 transition-all duration-300 ${
                    page === 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-[#1e293b] hover:border-primary hover:bg-primary/[0.03]"
                  }`}
                >
                  <HiChevronRight size={18} />
                  السابقة
                </button>

                <div className="flex items-center px-3 md:px-4 py-2.5 rounded-[14px] bg-primary text-white font-black ">
                  <span className="text-lg font-black">{page}</span>
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                  className={`flex items-center gap-1 px-4 py-2.5 rounded-[14px] font-bold text-sm border-2 transition-all duration-300 ${
                    page === totalPages
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-[#1e293b] hover:border-primary hover:bg-primary/[0.03]"
                  }`}
                >
                  التالية
                  <HiChevronLeft size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          !error && (
            <div className="text-center py-15 bg-white rounded-[32px] border border-dashed border-gray-200">
              <HiSearch size={80} className="text-gray-200 mx-auto mb-3" />
              <h3 className="text-xl font-black text-[#64748b] mb-2">
                لا يوجد نتائج تطابق بحثك
              </h3>
              <p className="text-[#64748b] mb-4">
                يرجى المحاولة باستخدام كلمات بحث أخرى أو تغيير التصنيف.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("الكل");
                }}
                className="inline-flex items-center gap-1 bg-primary text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
              >
                <HiRefresh className="ml-1" size={18} />
                إعادة تهيئة البحث
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Products;
