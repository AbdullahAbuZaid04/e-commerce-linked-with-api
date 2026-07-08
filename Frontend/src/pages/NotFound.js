import { Link } from "react-router-dom";
import { HiHome, HiShoppingBag } from "react-icons/hi";
import usePageTitle from "../utils/usePageTitle";

const NotFound = () => {
  usePageTitle("الصفحة غير موجودة");
  return (
    <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center py-10" dir="rtl">
      <div className="max-w-[768px] mx-auto px-4 text-center">
        {/* Big 404 */}
        <h1 className="text-7xl md:text-[12rem] font-black leading-none mb-2 bg-gradient-to-l from-primary to-primary-light bg-clip-text text-transparent select-none">
          404
        </h1>

        <h2 className="text-xl md:text-3xl font-black text-[#1e293b] mb-3">
          عذراً، الصفحة غير موجودة!
        </h2>

        <p className="text-base md:text-lg text-[#64748b] font-normal max-w-[500px] mx-auto leading-relaxed mb-6">
          يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو أن الرابط غير صحيح.
        </p>

        <div className="flex gap-3 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 bg-primary text-white px-3 md:px-6 py-2 md:py-3 rounded-[16px] font-bold text-sm md:text-base transition-all duration-300"
          >
            <HiHome className="ml-1" size={18} />
            الصفحة الرئيسية
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 border-2 border-gray-200 text-[#1e293b] px-3 md:px-6 py-2 md:py-3 rounded-[16px] font-bold text-sm md:text-base hover:border-primary hover:bg-primary/[0.03] transition-all duration-300"
          >
            <HiShoppingBag className="ml-1" size={18} />
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
