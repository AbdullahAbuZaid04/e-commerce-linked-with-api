import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useProducts } from "../contexts/ProductContext";
import {
  HiShoppingCart, HiCheck, HiArrowRight, HiPlus, HiMinus,
  HiHome, HiViewGrid, HiTag, HiCube, HiPhotograph
} from "react-icons/hi";
import usePageTitle from "../utils/usePageTitle";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  const { success, error } = useToast();
  const { getProductBySlug, products } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const foundInContext = products.find(p => p.id === slug || p.slug === slug);
      if (foundInContext) {
        setProduct(foundInContext);
        setLoading(false);
        return;
      }
      const result = await getProductBySlug(slug);
      if (result) {
        setProduct(result);
      }
      setLoading(false);
    };
    loadProduct();
  }, [slug, products, getProductBySlug]);

  const [quantity, setQuantity] = useState(1);

  usePageTitle(product?.name || "المنتج");

  if (loading) {
    return (
      <div className="max-w-[768px] mx-auto px-4 py-15 text-center" dir="rtl">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-3 text-lg font-bold text-[#64748b]">جاري تحميل المنتج...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[768px] mx-auto px-4 py-15 text-center" dir="rtl">
        <HiCube size={100} className="text-gray-200 mx-auto mb-4" />
        <div className="bg-red-500 text-white p-4 mb-4 rounded-[16px] font-bold">
          عذراً، لم يتم العثور على هذا المنتج.
        </div>
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-1 bg-primary text-white px-6 py-3 rounded-[14px] font-bold transition-all duration-300"
        >
          <HiArrowRight className="ml-1" size={18} />
          العودة للمنتجات
        </button>
      </div>
    );
  }

  const cartQuantity = getItemQuantity(product.id);
  const availableStock = product.stock - cartQuantity;
  const isOutOfStock = availableStock <= 0;
  const itemInCart = isInCart(product.id);

  const handleCartAction = () => {
    const newQuantityNeeded = itemInCart ? cartQuantity + quantity : quantity;
    if (newQuantityNeeded > product.stock) {
      error(`لا يمكن تجاوز الكمية المتوفرة (${product.stock} قطعة)`);
      return;
    }
    if (itemInCart) {
      updateQuantity(product.id, newQuantityNeeded);
      success(`تم تحديث كمية "${product.name}" في السلة`);
    } else {
      addToCart(product, quantity);
      success(`تم إضافة "${product.name}" إلى سلة التسوق`);
    }
    setQuantity(1);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen" dir="rtl">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* BREADCRUMB */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
          <Link to="/" className="flex items-center gap-0.5 hover:text-primary no-underline transition-colors duration-300">
            <HiHome size={16} />
            <span>الرئيسية</span>
          </Link>
          <span className="mx-1 text-gray-300">›</span>
          <Link to="/products" className="flex items-center gap-0.5 hover:text-primary no-underline transition-colors duration-300">
            <HiViewGrid size={16} />
            <span>المنتجات</span>
          </Link>
          <span className="mx-1 text-gray-300">›</span>
          <span className="font-bold text-[#1e293b]">{product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
          {/* IMAGE */}
          <div className="w-full md:w-[42%]">
            <div className="rounded-[32px] border border-gray-200 overflow-hidden h-[320px] md:h-[500px] bg-[#fcfcfc] flex items-center justify-center p-4">
              {product.image ? (
                <img
                  src={product.image}
                  alt={`صورة المنتج: ${product.name}`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.querySelector(".placeholder")?.classList.remove("hidden");
                  }}
                  className="max-h-full max-w-full object-contain block rounded-[16px]"
                />
              ) : null}
              <div className={`placeholder ${product.image ? "hidden" : ""} flex items-center justify-center w-full h-full`}>
                <HiPhotograph size={96} className="text-gray-300" />
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="w-full md:w-[58%]">
            {/* Category Tag */}
            <span className="inline-flex items-center gap-1 text-primary border-2 border-primary rounded-xl px-3 py-1.5 mb-3 font-extrabold text-sm">
              <HiTag size={16} />
              {product.categoryName}
            </span>

            <h1 className="font-black text-[#1e293b] leading-tight text-2xl md:text-4xl mb-3">
              {product.name}
            </h1>

            {/* Price & Stock */}
            <div className="bg-[#F8FAFC] border border-gray-200 rounded-[20px] p-4 mb-4 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-[#64748b] block mb-0.5">السعر الحالي</span>
                <span className="text-3xl md:text-4xl font-black text-primary leading-tight">
                  {product.price} $
                </span>
              </div>
              <div className="text-right">
                <div className="flex gap-1 items-center justify-end mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${availableStock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-sm font-black ${availableStock > 0 ? "text-green-500" : "text-red-500"}`}>
                    {availableStock > 0 ? "متوفر في المخزن" : "نفذ المخزون"}
                  </span>
                </div>
                {availableStock > 0 && (
                  <span className="text-lg font-extrabold text-[#1e293b]">
                    {availableStock}{" "}
                    <span className="text-sm text-[#64748b] font-normal">قطعة متبقية</span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h3 className="font-black text-lg text-[#1e293b] mb-2">وصف المنتج</h3>
              <hr className="mb-2 border-gray-200" />
              <p className="text-[#64748b] leading-relaxed text-base">
                {product.description}
              </p>
            </div>

            {/* Quantity Picker + CTA */}
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between border border-gray-200 rounded-[16px] p-1.5 bg-white w-full sm:w-auto gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="تقليل الكمية"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      quantity <= 1 || isOutOfStock
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-black/[0.04] hover:bg-red-400 hover:text-white"
                    }`}
                  >
                    <HiMinus size={16} />
                  </button>
                  <span className="text-lg font-black min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= availableStock || isOutOfStock}
                    aria-label="زيادة الكمية"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      quantity >= availableStock || isOutOfStock
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-black/[0.04] hover:bg-green-400 hover:text-white"
                    }`}
                  >
                    <HiPlus size={16} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleCartAction}
                  disabled={isOutOfStock}
                  className={`w-full sm:flex-1 flex items-center justify-center gap-1 py-2.5 px-8 rounded-[16px] font-bold text-lg transition-all duration-300 ${
                    isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white  hover:-translate-y-0.5"
                  }`}
                >
                  {isOutOfStock ? (
                    "نفذ المخزون"
                  ) : itemInCart ? (
                    <><HiCheck className="ml-1" size={20} /> تحديث الكمية في السلة</>
                  ) : (
                    <><HiShoppingCart className="ml-1" size={20} /> إضافة إلى السلة</>
                  )}
                </button>
              </div>
            </div>

            {/* In Cart Notice */}
            {itemInCart && (
              <div className="border-2 border-blue-400 text-blue-600 bg-blue-50 rounded-[14px] p-3 text-sm font-bold">
                لديك <strong>{cartQuantity}</strong> من هذا المنتج في سلتك حالياً.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
