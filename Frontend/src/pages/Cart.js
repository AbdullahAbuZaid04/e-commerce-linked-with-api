import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import { createOrderApi } from "../api/orderService";
import {
  HiTrash,
  HiShoppingBag,
  HiCreditCard,
  HiPlus,
  HiMinus,
  HiArrowRight,
  HiShoppingCart,
  HiPhotograph,
  HiRefresh,
} from "react-icons/hi";
import usePageTitle from "../utils/usePageTitle";

const Cart = () => {
  usePageTitle("سلة التسوق");
  const { user } = useAuth();
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shipping, setShipping] = useState({
    shippingName: user?.name || "",
    shippingPhone: "",
    shippingAddress: "",
  });

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    showSuccess(`تم حذف "${productName}" من السلة`);
  };

  const handleIncreaseQuantity = (productId, currentQuantity, stockLimit) => {
    if (currentQuantity >= stockLimit) {
      showError(`لا يمكن تجاوز الكمية المتوفرة (${stockLimit} قطعة)`);
      return;
    }
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleClearCart = () => {
    clearCart();
    showSuccess("تم تفريغ السلة بنجاح");
    setOpenClearDialog(false);
  };

  const handleCheckout = async () => {
    if (
      !shipping.shippingName.trim() ||
      !shipping.shippingPhone.trim() ||
      !shipping.shippingAddress.trim()
    ) {
      showError("يرجى ملء جميع حقول الشحن");
      return;
    }
    setCheckoutLoading(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingName: shipping.shippingName,
        shippingPhone: shipping.shippingPhone,
        shippingAddress: shipping.shippingAddress,
      };
      const res = await createOrderApi(orderPayload);
      clearCart();
      setOpenCheckoutDialog(false);
      const orderId = res?.data?.id || "";
      if (orderId) localStorage.setItem("lastOrderId", orderId);
      navigate(`/order-success?orderId=${orderId}`, {
        state: {
          orderId,
          total: res?.data?.total || totalPrice,
          items: res?.data?.items || items,
        },
      });
    } catch (err) {
      setCheckoutLoading(false);
      showError(err.message || "فشل إنشاء الطلب. حاول مرة أخرى");
    }
  };

  const formatPrice = (value) =>
    (value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // EMPTY STATE
  if (items.length === 0) {
    return (
      <div className="max-w-[768px] mx-auto px-4 py-12" dir="rtl">
        <div className="min-h-[60vh] flex flex-col justify-center items-center text-center gap-3">
          <HiShoppingCart size={120} className="text-gray-200" />
          <h2 className="text-2xl font-black text-[#1e293b]">
            سلة التسوق فارغة
          </h2>
          <p className="text-[#64748b] max-w-[500px] leading-relaxed">
            يبدو أنك لم تضف أي منتجات بعد. ابدأ رحلة تسوقك الآن واكتشف تشكيلتنا
            الرائعة.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 bg-primary text-white px-6 py-3 rounded-[16px] text-lg font-bold transition-all duration-300"
          >
            <HiShoppingBag className="ml-1" size={22} />
            ابدأ التسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen" dir="rtl">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4">
        {/* PAGE TITLE */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-1 text-sm font-bold text-[#64748b] mb-3 hover:text-primary transition-colors duration-300"
          >
            <HiArrowRight className="ml-1" size={16} />
            متابعة التسوق
          </button>
          <h1 className="text-2xl md:text-4xl font-black text-[#1e293b] mb-2">
            سلة التسوق
          </h1>
          <p className="text-[#64748b]">
            لديك {items.length} منتج في سلتك ({totalItems} قطعة بالإجمالي)
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-5">
          {/* CART ITEMS */}
          <div className="w-full lg:w-[66%]">
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 bg-[#f8f9fa] border-b border-gray-200">
                <h3 className="text-lg font-black">منتجاتك ({items.length})</h3>
                <button
                  onClick={() => setOpenClearDialog(true)}
                  className="flex items-center gap-1 text-red-500 border-2 border-red-500 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <HiTrash className="ml-1" size={14} />
                  تفريغ السلة
                </button>
              </div>

              {/* Items List */}
              <div>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center flex-wrap sm:flex-nowrap p-3 md:p-4 gap-3 ${
                      index < items.length - 1 ? "border-b border-gray-200" : ""
                    } hover:bg-primary/[0.02] transition-colors duration-300`}
                  >
                    {/* Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] rounded-[16px] object-cover flex-shrink-0 cursor-pointer"
                        onClick={() =>
                          navigate(`/product/${item.slug || item.id}`)
                        }
                      />
                    ) : (
                      <div
                        className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] rounded-[16px] bg-gray-100 flex items-center justify-center flex-shrink-0 cursor-pointer"
                        onClick={() =>
                          navigate(`/product/${item.slug || item.id}`)
                        }
                      >
                        <HiPhotograph size={32} className="text-gray-400" />
                      </div>
                    )}

                    {/* Name & Category */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-extrabold cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:text-primary transition-colors duration-300"
                        onClick={() =>
                          navigate(`/product/${item.slug || item.id}`)
                        }
                      >
                        {item.name}
                      </h4>
                      <span className="inline-block mt-1 text-xs font-bold border-2 border-primary/20 bg-primary/5 text-primary rounded-lg px-2 py-0.5">
                        {item.categoryName}
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-row flex-wrap items-center gap-0 md:gap-2 justify-start">
                      {/* Price per unit */}
                      <div className="text-center min-w-[80px]">
                        <span className="text-xs text-[#64748b] block">
                          سعر القطعة
                        </span>
                        <span className="text-sm md:text-base font-black text-primary">
                          {formatPrice(item.price)} $
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="text-center">
                        <span className="text-xs text-[#64748b] block mb-0.5">
                          الكمية
                        </span>
                        <div className="flex items-center gap-0 md:gap-1 border border-gray-200 rounded-xl p-0.5">
                          <button
                            onClick={() =>
                              handleDecreaseQuantity(item.id, item.quantity)
                            }
                            aria-label="تقليل كمية المنتج"
                            className="p-1 rounded-lg hover:bg-red-400 hover:text-white transition-all duration-300"
                          >
                            <HiMinus size={14} />
                          </button>
                          <span className="min-w-[28px] text-center font-black text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleIncreaseQuantity(
                                item.id,
                                item.quantity,
                                item.stock,
                              )
                            }
                            aria-label="زيادة كمية المنتج"
                            className="p-1 rounded-lg hover:bg-green-400 hover:text-white transition-all duration-300"
                          >
                            <HiPlus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-center min-w-[90px]">
                        <span className="text-xs text-[#64748b] block">
                          إجمالي
                        </span>
                        <span className="text-sm md:text-base font-black text-green-500">
                          {formatPrice(item.price * item.quantity)} $
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        aria-label={`حذف ${item.name} من السلة`}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <HiTrash size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="w-full lg:w-[33%]">
            <div className="bg-white rounded-3xl border border-gray-200 lg:sticky lg:top-[100px]">
              <div className="px-4 pt-4 pb-2">
                <h3 className="text-lg font-black mb-3">ملخص الطلب</h3>
                <hr className="mb-3 border-gray-200" />
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">عدد المنتجات:</span>
                    <span className="font-bold">{items.length} منتج</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">إجمالي القطع:</span>
                    <span className="font-bold">{totalItems} قطعة</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-base md:text-lg font-extrabold">
                      المجموع الكلي:
                    </span>
                    <span className="text-base md:text-lg font-black text-primary">
                      {formatPrice(totalPrice)} $
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 pt-3">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/login", { state: { from: "/cart" } });
                      showError("يجب تسجيل الدخول لإتمام عملية الشراء");
                      return;
                    }
                    setShipping((prev) => ({
                      ...prev,
                      shippingName: user.name,
                    }));
                    setOpenCheckoutDialog(true);
                  }}
                  className="w-full flex items-center justify-center gap-1 bg-primary text-white py-3 rounded-[16px] text-base md:text-lg font-bold transition-all duration-300"
                >
                  <HiCreditCard className="ml-1" size={20} />
                  إتمام الشراء الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKOUT DIALOG */}
      {openCheckoutDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[1300]"
            onClick={() => setOpenCheckoutDialog(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-4 z-[1400] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto">
            <h2 className="font-black text-xl mb-3">معلومات الشحن</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={shipping.shippingName}
                  onChange={(e) =>
                    setShipping((p) => ({ ...p, shippingName: e.target.value }))
                  }
                  placeholder="الاسم الكامل"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors duration-300 disabled:bg-gray-100 disabled:text-gray-500"
                  disabled={!!user?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={shipping.shippingPhone}
                  onChange={(e) =>
                    setShipping((p) => ({
                      ...p,
                      shippingPhone: e.target.value,
                    }))
                  }
                  placeholder="0599123456"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-1">
                  عنوان الشحن
                </label>
                <textarea
                  value={shipping.shippingAddress}
                  onChange={(e) =>
                    setShipping((p) => ({
                      ...p,
                      shippingAddress: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="العنوان بالكامل"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#64748b]">عدد المنتجات:</span>
                <span className="font-bold">{items.length} منتج</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">الإجمالي الكلي:</span>
                <span className="font-bold text-primary">
                  {formatPrice(totalPrice)} $
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={() => setOpenCheckoutDialog(false)}
                disabled={checkoutLoading}
                className="px-6 py-2.5 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              >
                إلغاء
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="flex items-center gap-1 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all duration-300 disabled:opacity-50"
              >
                {checkoutLoading ? (
                  <>
                    <HiRefresh className="animate-spin ml-1" size={20} />{" "}
                    جاري...
                  </>
                ) : (
                  <>
                    <HiCreditCard className="ml-1" size={16} /> تأكيد الطلب
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* CLEAR CART DIALOG */}
      {openClearDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[1300]"
            onClick={() => setOpenClearDialog(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-4 z-[1400] max-w-[500px] w-[90%] ">
            <h2
              className="font-black text-xl mb-3"
              id="clear-cart-dialog-title"
            >
              تأكيد تفريغ السلة
            </h2>
            <p
              className="text-[#64748b] mb-4"
              id="clear-cart-dialog-description"
            >
              هل أنت متأكد من حذف جميع المنتجات من سلة التسوق؟ هذا الإجراء لا
              يمكن التراجع عنه.
            </p>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setOpenClearDialog(false)}
                className="px-6 py-2.5 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              >
                إلغاء
              </button>
              <button
                onClick={handleClearCart}
                className="flex items-center gap-1 px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all duration-300"
              >
                <HiTrash className="ml-1" size={16} />
                أفرغ السلة
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
