import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { HiMenu, HiX, HiShoppingCart, HiHome, HiViewGrid, HiShoppingBag, HiLogin, HiUserAdd, HiShieldCheck, HiLogout, HiUser } from "react-icons/hi";

const Header = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-[1100] bg-white/98 backdrop-blur-xl border-b border-gray-200 text-[#1e293b] h-16 md:h-20 flex items-center"
      dir="rtl"
    >
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={isAdmin ? "/admin" : "/"}
            aria-label="الرئيسية - متجرنا"
            className="flex items-center text-primary no-underline transition-transform duration-300 hover:scale-105"
          >
            <div className="w-9 h-9 md:w-11 md:h-11 bg-primary rounded-[14px] flex items-center justify-center text-white mx-1.5">
              <HiShoppingBag size={22} className="md:hidden" />
              <HiShoppingBag size={28} className="hidden md:block" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-l from-primary to-primary-light bg-clip-text text-transparent">
              متجرنا
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1" aria-label="القائمة الرئيسية">
            {isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center px-5 py-2 text-sm text-[#64748b] rounded-[10px] hover:text-primary hover:bg-[rgba(25,118,210,0.05)] transition-colors duration-300 font-bold"
              >
                <HiShieldCheck className="ml-1.5" size={18} />
                لوحة التحكم
              </Link>
            ) : (
              <>
                <Link
                  to="/"
                  className="flex items-center px-5 py-2 text-sm text-[#64748b] rounded-[10px] hover:text-primary hover:bg-[rgba(25,118,210,0.05)] transition-colors duration-300 font-bold"
                >
                  <HiHome className="ml-1.5" size={18} />
                  الرئيسية
                </Link>
                <Link
                  to="/products"
                  className="flex items-center px-5 py-2 text-sm text-[#64748b] rounded-[10px] hover:text-primary hover:bg-[rgba(25,118,210,0.05)] transition-colors duration-300 font-bold"
                >
                  <HiViewGrid className="ml-1.5" size={18} />
                  المنتجات
                </Link>
              </>
            )}
            {user ? (
              <>
                <span className="flex items-center gap-1.5 px-4 py-2 text-sm text-[#64748b] font-bold">
                  <HiUser size={16} />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-red-500 rounded-[10px] hover:bg-red-50 transition-all duration-300 font-bold"
                >
                  <HiLogout className="ml-1.5" size={18} />
                  تسجيل خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-5 py-2 text-sm text-[#64748b] rounded-[10px] hover:text-primary hover:bg-[rgba(25,118,210,0.05)] transition-colors duration-300 font-bold"
                >
                  <HiLogin className="ml-1.5" size={18} />
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-5 py-2 text-sm text-[#64748b] rounded-[10px] hover:text-primary hover:bg-[rgba(25,118,210,0.05)] transition-colors duration-300 font-bold"
                >
                  <HiUserAdd className="ml-1.5" size={18} />
                  إنشاء حساب
                </Link>
              </>
            )}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!isAdmin && (
              <>
                <button
                  onClick={() => navigate("/cart")}
                  aria-label="عرض سلة التسوق"
                  className="relative p-2.5 rounded-xl bg-black/[0.03] hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <HiShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {totalItems}
                    </span>
                  )}
                </button>

                <Link
                  to="/products"
                  className="hidden sm:flex items-center px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  تسوق الآن
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="فتح القائمة الجانبية"
              className="md:hidden p-2.5 rounded-xl bg-black/[0.03] transition-all duration-300"
            >
              <HiMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[1200]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-[300px] bg-white z-[1300] p-5 flex flex-col gap-4 ">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-black text-primary flex items-center gap-2">
                <HiShoppingBag size={24} /> متجرنا
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="أغلق القائمة"
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <HiX size={20} />
              </button>
            </div>
            <hr className="opacity-50 mb-1" />
            <nav className="flex flex-col gap-2">
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-2xl text-[#1e293b] bg-black/[0.02] hover:bg-[rgba(25,118,210,0.08)] hover:text-primary transition-all duration-300 font-bold"
                >
                  <HiShieldCheck size={18} />
                  لوحة التحكم
                </Link>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-2xl text-[#1e293b] bg-black/[0.02] hover:bg-[rgba(25,118,210,0.08)] hover:text-primary transition-all duration-300 font-bold"
                  >
                    <HiHome size={18} />
                    الرئيسية
                  </Link>
                  <Link
                    to="/products"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-2xl text-[#1e293b] bg-black/[0.02] hover:bg-[rgba(25,118,210,0.08)] hover:text-primary transition-all duration-300 font-bold"
                  >
                    <HiViewGrid size={18} />
                    المنتجات
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-[#64748b] font-bold">
                    <HiUser size={16} />
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-red-50 text-red-500 font-black transition-all duration-300"
                  >
                    <HiLogout size={18} />
                    تسجيل خروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-2xl text-[#1e293b] bg-black/[0.02] hover:bg-[rgba(25,118,210,0.08)] hover:text-primary transition-all duration-300 font-bold"
                  >
                    <HiLogin size={18} />
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-2xl text-[#1e293b] bg-black/[0.02] hover:bg-[rgba(25,118,210,0.08)] hover:text-primary transition-all duration-300 font-bold"
                  >
                    <HiUserAdd size={18} />
                    إنشاء حساب
                  </Link>
                </>
              )}
              {!isAdmin && (
                <>
                  <hr className="opacity-50 my-2" />
                  <button
                    onClick={() => { navigate("/cart"); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-black"
                  >
                    <HiShoppingCart size={20} />
                    سلة التسوق ({totalItems})
                  </button>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
