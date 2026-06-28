import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { HiShoppingCart, HiPlus, HiMinus, HiEye } from "react-icons/hi";

const ProductCard = ({ product }) => {
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const itemInCartQuantity = getItemQuantity(product?.id) || 0;
  const availableStock = (product?.stockQuantity || 0) - itemInCartQuantity;
  const isProductInCart = isInCart(product?.id);

  const handleProductClick = (e) => {
    if (e) e.stopPropagation();
    if (product?.id !== undefined) {
      navigate(`/product/${product.id}`);
    } else {
      error("المنتج غير صالح");
    }
  };

  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();
    if (availableStock <= 0) {
      error("عذراً، لقد نفدت الكمية المتاحة");
      return;
    }
    addToCart(product, 1);
    success(`تم إضافة "${product.name}" إلى السلة`);
  };

  const handleIncreaseQuantity = (e) => {
    if (e) e.stopPropagation();
    if (availableStock <= 0) {
      error("لا يمكن إضافة المزيد");
      return;
    }
    updateQuantity(product.id, itemInCartQuantity + 1);
    success(`تم زيادة كمية "${product.name}" في السلة`);
  };

  const handleDecreaseQuantity = (e) => {
    if (e) e.stopPropagation();
    if (itemInCartQuantity <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, itemInCartQuantity - 1);
      success(`تم تقليل كمية "${product.name}" في السلة`);
    }
  };

  return (
    <div
      className="w-[280px] sm:w-[260px] md:w-[280px] h-[480px] flex flex-col rounded-3xl transition-all duration-400 overflow-hidden relative cursor-pointer hover:-translate-y-1 duration-400"
      dir="rtl"
      onClick={handleProductClick}
    >
      {/* IMAGE CONTAINER */}
      <div className="h-[240px] bg-[#fcfcfc] flex items-center justify-center border-b border-black/[0.03] relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}

        <img
          src={product.image || require("../assets/store.webp")}
          alt={product?.name || "صورة المنتج"}
          width={280}
          height={204}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
              e.currentTarget.src = require("../assets/store.webp");
            }
          }}
          loading="lazy"
          className={`object-contain h-[85%] w-[85%] transition-all duration-400 ${
            imageLoaded || imageError ? "opacity-100" : "opacity-0"
          } group-hover:opacity-20`}
        />

        {/* VIEW OVERLAY */}
        <div className="absolute inset-0 bg-primary/[0.08] flex items-center justify-center opacity-0 transition-all duration-400 hover:opacity-100 duration-400">
          <div className="bg-white p-3.5 rounded-full flex translate-y-5 transition-all duration-400 group-hover:translate-y-0 duration-400">
            <HiEye className="text-primary" size={24} />
          </div>
        </div>

        {isProductInCart && (
          <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-2.5 py-1.5 rounded-full z-[3]">
            في السلة: {itemInCartQuantity}
          </span>
        )}
      </div>

      {/* CARD CONTENT */}
      <div className="flex-1 p-2.5 flex flex-col gap-1">
        <h3 className="font-bold text-base text-[#1e293b] h-[2.4em] overflow-hidden line-clamp-2 leading-tight">
          {product?.name || "اسم المنتج"}
        </h3>

        <div className="flex justify-between items-center mt-1">
          <span className="text-sm font-semibold text-primary bg-[rgba(59,130,246,0.05)] px-2.5 py-1 rounded-lg">
            {product?.categoryName || "تصنيف"}
          </span>
          <span className="text-lg font-extrabold text-primary">
            {product?.price} $
          </span>
        </div>

        <div className="mt-auto">
          <span
            className={`text-xs font-semibold flex items-center gap-1 ${
              availableStock > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            <span
              className={`w-[6px] h-[6px] rounded-full ${
                availableStock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {availableStock > 0 ? `المخزون: ${availableStock}` : "نفذ المخزون"}
          </span>
        </div>
      </div>

      {/* CARD ACTIONS */}
      <div className="p-2 pt-0">
        {isProductInCart ? (
          <div className="flex items-center w-full justify-between bg-[#f8f9fa] rounded-[14px] p-0.5 border border-gray-200">
            <button
              onClick={handleDecreaseQuantity}
              className="p-1.5 bg-white rounded-lg hover:bg-red-50 transition-all duration-300"
              aria-label="تقليل الكمية"
            >
              <HiMinus size={16} className="text-red-500" />
            </button>
            <span className="font-bold text-sm">{itemInCartQuantity}</span>
            <button
              onClick={handleIncreaseQuantity}
              className="p-1.5 bg-white rounded-lg hover:bg-green-50 transition-all duration-300"
              aria-label="زيادة الكمية"
            >
              <HiPlus size={16} className="text-green-500" />
            </button>
          </div>
        ) : (
          <button
            disabled={availableStock <= 0}
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-[14px] font-semibold text-sm transition-all duration-300 ${
              availableStock > 0
                ? "bg-primary text-white  hover:-translate-y-0.5"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <HiShoppingCart size={18} />
            {availableStock > 0 ? "إضافة للسلة" : "غير متوفر"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
