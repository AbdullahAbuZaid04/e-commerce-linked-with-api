import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { HiCheckCircle, HiShoppingBag } from "react-icons/hi";

const OrderSuccess = () => {
  const { clearCart } = useCart();
  const location = useLocation();

  const orderData = location.state || { total: 0, items: [] };

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "0.00";
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-6 md:py-12" dir="rtl">
      <div className="max-w-[640px] mx-auto px-4">
        <div className="bg-white p-4 md:p-6 text-center rounded-[32px] border border-gray-200">
          {/* SUCCESS ICON */}
          <div className="mb-4">
            <div className="w-[100px] h-[100px] rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <HiCheckCircle size={60} className="text-emerald-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e293b] mb-1">
              شكراً لثقتكم بنا 🎉
            </h2>
          </div>

          <hr className="mb-4 opacity-50" />

          {/* ITEMS LIST */}
          {orderData.items?.length > 0 && (
            <div className="text-center md:text-right mb-4">
              <h3 className="font-black text-base md:text-xl text-[#1e293b] mb-3">
                ملخص المشتريات:
              </h3>
              <div className="flex flex-col gap-2">
                {orderData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-black/[0.02] rounded-[16px] border border-gray-200"
                  >
                    <div className="flex items-center gap-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[50px] h-[50px] rounded-[10px] object-cover"
                      />
                      <div className="text-right">
                        <p className="text-sm md:text-base font-extrabold text-[#1e293b]">{item.name}</p>
                        <span className="inline-block mt-0.5 text-xs font-bold border border-gray-200 rounded-lg px-2 py-0.5">
                          الكمية: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-primary text-sm md:text-base">
                      {formatPrice(item.price * item.quantity)} $
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOTAL */}
          <div className="flex justify-between items-center p-3 mb-5 bg-[#1e293b] text-white rounded-[20px] ">
            <span className="text-base md:text-lg font-bold">المبلغ الإجمالي:</span>
            <span className="text-base md:text-lg font-black">
              {formatPrice(orderData.total)} $
            </span>
          </div>

          {/* CTA */}
          <Link
            to="/products"
            className="flex items-center justify-center gap-1 w-full bg-primary text-white py-3 rounded-[16px] font-bold text-lg transition-all duration-300"
          >
            <HiShoppingBag className="ml-1" size={22} />
            التسوق من جديد
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
