import { Link, useLocation } from "react-router-dom";
import { HiExclamationCircle, HiHome, HiShieldCheck } from "react-icons/hi";
import { useAuth } from "../contexts/AuthContext";
import usePageTitle from "../utils/usePageTitle";

const Forbidden = () => {
  usePageTitle("غير مصرح");
  const { user } = useAuth();
  const location = useLocation();
  const isAuthRedirect = location.state?.authRedirect;

  return (
    <div
      className="bg-[#f8f9fa] min-h-screen flex items-center justify-center py-10"
      dir="rtl"
    >
      <div className="max-w-[768px] mx-auto px-4 text-center">
        <HiExclamationCircle
          size={120}
          className="text-amber-400 mx-auto mb-4"
        />
        <h1 className="text-5xl md:text-7xl font-black text-[#1e293b] mb-3">
          403
        </h1>
        <h2 className="text-xl md:text-3xl font-black text-[#1e293b] mb-3">
          {isAuthRedirect ? "أنت مسجل دخول بالفعل!" : "لا تملك الصلاحية!"}
        </h2>
        <p className="text-base md:text-lg text-[#64748b] max-w-[500px] mx-auto leading-relaxed mb-8">
          {isAuthRedirect
            ? "لا يمكنك الوصول إلى صفحة تسجيل الدخول أو إنشاء حساب لأنك مسجل دخول بالفعل."
            : "عذراً، ليس لديك الصلاحية للوصول إلى هذه الصفحة."}
        </p>
        <Link
          to={user?.role === "ADMIN" ? "/dashboard" : "/"}
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          {user?.role === "ADMIN" ? (
            <HiShieldCheck size={20} />
          ) : (
            <HiHome size={20} />
          )}
          {user?.role === "ADMIN" ? "لوحة التحكم" : "الصفحة الرئيسية"}
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
