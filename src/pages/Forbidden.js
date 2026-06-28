import { Link } from "react-router-dom";
import { HiExclamationCircle, HiHome } from "react-icons/hi";
import { useAuth } from "../contexts/AuthContext";

const Forbidden = () => {
  const { user } = useAuth();
  return (
    <div
      className="bg-[#f8f9fa] min-h-screen flex items-center justify-center py-10"
      dir="rtl"
    >
      <div className="max-w-[768px] mx-auto px-4 text-center">
        <HiExclamationCircle size={120} className="text-red-400 mx-auto mb-4" />
        <h1 className="text-5xl md:text-7xl font-black text-[#1e293b] mb-3">
          403
        </h1>
        <h2 className="text-xl md:text-3xl font-black text-[#1e293b] mb-3">
          لا تملك الصلاحية!
        </h2>
        <p className="text-base md:text-lg text-[#64748b] max-w-[500px] mx-auto leading-relaxed mb-6">
          عذراً، ليس لديك الصلاحية للوصول إلى هذه الصفحة.
        </p>
        <Link
          to={user.role === "admin" ? "/dashboard" : "/"}
          className="inline-flex items-center gap-1 bg-primary text-white px-6 py-3 rounded-[16px] font-bold text-base hover:-translate-y-0.5 transition-all duration-300"
        >
          <HiHome className="ml-1" size={18} />
          الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
