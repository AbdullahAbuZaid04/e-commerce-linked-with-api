import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { HiCheckCircle, HiShoppingBag, HiPhotograph } from "react-icons/hi";
import { getOrderByIdApi } from "../api/orderService";
import usePageTitle from "../utils/usePageTitle";

const OrderSuccess = () => {
  usePageTitle("تم الطلب بنجاح");
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [orderData, setOrderData] = useState(location.state);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (orderData) return;

    const orderId = searchParams.get("orderId") || localStorage.getItem("lastOrderId");
    if (!orderId) {
      navigate("/my-orders", { replace: true });
      return;
    }

    getOrderByIdApi(orderId)
      .then((res) => {
        if (res?.data) {
          setOrderData({
            orderId: res.data.id,
            total: Number(res.data.total),
            items: res.data.items?.map((i) => ({
              name: i.product?.name || "منتج",
              quantity: i.quantity,
              price: Number(i.price),
              image: (() => { const img = i.product?.images?.[0] || ""; return img?.startsWith("/") ? `${process.env.REACT_APP_API_URL}${img}` : img; })(),
            })),
          });
          localStorage.removeItem("lastOrderId");
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderData, searchParams, navigate]);

  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 font-bold text-[#64748b]">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <HiCheckCircle size={80} className="text-emerald-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-[#1e293b] mb-2">تم إنشاء الطلب بنجاح!</h2>
          <p className="text-[#64748b] mb-4">يمكنك متابعة حالة الطلب من صفحة طلباتي</p>
          <Link to="/my-orders" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold transition-all duration-300">
            طلباتي
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="mb-4">
            <div className="w-[100px] h-[100px] rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <HiCheckCircle size={60} className="text-emerald-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e293b] mb-1">
              شكراً لثقتكم بنا!
            </h2>
            {orderData.orderId && (
              <p className="text-sm text-[#64748b]">
                رقم الطلب: <span className="font-black text-primary">{orderData.orderId}</span>
              </p>
            )}
          </div>

          <hr className="mb-4 opacity-50" />

          {orderData.items?.length > 0 && (
            <div className="text-center md:text-right mb-4">
              <h3 className="font-black text-base md:text-xl text-[#1e293b] mb-3">
                ملخص المشتريات:
              </h3>
              <div className="flex flex-col gap-2">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-black/[0.02] rounded-[16px] border border-gray-200">
                    <div className="flex items-center gap-1">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-[50px] h-[50px] rounded-[10px] object-cover" />
                      ) : (
                        <div className="w-[50px] h-[50px] rounded-[10px] bg-gray-100 flex items-center justify-center">
                          <HiPhotograph size={20} className="text-gray-400" />
                        </div>
                      )}
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

          <div className="flex justify-between items-center p-3 mb-5 bg-[#1e293b] text-white rounded-[20px]">
            <span className="text-base md:text-lg font-bold">المبلغ الإجمالي:</span>
            <span className="text-base md:text-lg font-black">
              {formatPrice(orderData.total)} $
            </span>
          </div>

          <Link to="/products" className="flex items-center justify-center gap-1 w-full bg-primary text-white py-3 rounded-[16px] font-bold text-lg transition-all duration-300">
            <HiShoppingBag className="ml-1" size={22} />
            التسوق من جديد
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;