import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrdersApi } from "../api/orderService";
import { useAuth } from "../contexts/AuthContext";
import { HiDocumentText, HiShoppingBag, HiChevronDown, HiChevronRight, HiChevronLeft } from "react-icons/hi";
import usePageTitle from "../utils/usePageTitle";

const statusColors = {
  PENDING: "bg-amber-50 text-amber-600",
  CONFIRMED: "bg-blue-50 text-blue-600",
  SHIPPED: "bg-purple-50 text-purple-600",
  DELIVERED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-600",
};

const statusLabels = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "مؤكد",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
};

const statusSteps = [
  { key: "PENDING", label: "قيد الانتظار" },
  { key: "CONFIRMED", label: "مؤكد" },
  { key: "SHIPPED", label: "تم الشحن" },
  { key: "DELIVERED", label: "تم التوصيل" },
];

const MyOrders = () => {
  usePageTitle("طلباتي");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/my-orders" }, replace: true });
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getOrdersApi({ page: String(page), limit: String(limit) });
        if (res?.data) setOrders(res.data);
        if (res?.pagination) setTotalPages(res.pagination.totalPages || 1);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate, page]);

  const formatPrice = (value) =>
    (value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-15 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-3 text-lg font-bold text-[#64748b]">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen" dir="rtl">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-black text-[#1e293b] mb-2">طلباتي</h1>
          <p className="text-[#64748b]">جميع طلباتك السابقة في مكان واحد</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-15">
            <HiDocumentText size={80} className="text-gray-200 mx-auto mb-3" />
            <h3 className="text-xl font-black text-[#64748b] mb-2">لا يوجد طلبات بعد</h3>
            <p className="text-[#64748b] mb-4">لم تقم بشراء أي منتجات حتى الآن.</p>
            <Link to="/products" className="inline-flex items-center gap-1 bg-primary text-white px-6 py-3 rounded-[16px] font-bold transition-all duration-300">
              <HiShoppingBag className="ml-1" size={22} />
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                  <div className="p-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <HiDocumentText size={22} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-[#1e293b]">طلب #{o.id?.slice(0, 8)}</p>
                        <p className="text-xs text-[#94a3b8]">{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-GB") : "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusColors[o.status] || "bg-gray-50 text-gray-600"}`}>
                        {statusLabels[o.status] || o.status}
                      </span>
                      <span className="font-black text-primary text-base">${formatPrice(o.total)}</span>
                      <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-300">
                        <HiChevronDown size={20} className={`transition-transform duration-300 ${expandedOrder === o.id ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>
                  {expandedOrder === o.id && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                      <div className="mb-4">
                        <h4 className="font-bold text-sm mb-3">تتبع الطلب</h4>
                        <div className="flex items-center justify-between w-full px-2">
                          {statusSteps.map((s, idx) => {
                            const statusIndex = statusSteps.findIndex((st) => st.key === o.status);
                            const isPast = idx < statusIndex;
                            const isCurrent = idx === statusIndex;
                            const isCancelled = o.status === "CANCELLED";
                            return (
                              <div key={s.key} className="flex flex-col items-center flex-1 min-w-0">
                                <div className="flex items-center w-full">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 flex-shrink-0 ${
                                    isCancelled ? "border-red-500 bg-red-50 text-red-500" : isPast ? "border-green-500 bg-green-500 text-white" : isCurrent ? "border-green-500 bg-white text-green-500" : "border-gray-300 bg-white text-gray-400"
                                  }`}>
                                    {isPast ? "✓" : isCancelled ? "✕" : idx + 1}
                                  </div>
                                  {idx < statusSteps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 ${isCancelled ? "bg-red-200" : isPast || isCurrent ? "bg-green-500" : "bg-gray-200"}`} />
                                  )}
                                </div>
                                <span className={`text-xs mt-1.5 font-bold whitespace-nowrap ${isCancelled ? "text-red-500" : isPast || isCurrent ? "text-green-600" : "text-gray-400"}`}>{s.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-bold text-sm mb-1">معلومات الشحن</h4>
                          <p className="text-sm text-[#64748b]">{o.shippingName}</p>
                          <p className="text-sm text-[#64748b]">{o.shippingPhone}</p>
                          <p className="text-sm text-[#64748b]">{o.shippingAddress}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm mb-1">المنتجات</h4>
                          {o.items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                              <span className="text-[#64748b]">{item.product?.name || "منتج"}</span>
                              <span className="font-bold">{item.quantity} x ${Number(item.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 rounded-xl border border-gray-200 bg-white font-bold text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1">
                  <HiChevronRight size={16} /> السابق
                </button>
                <span className="text-sm font-bold text-[#64748b]">صفحة {page} من {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-4 py-2 rounded-xl border border-gray-200 bg-white font-bold text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1">
                  التالي <HiChevronLeft size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;