import { useState, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import {
  HiMenu,
  HiX,
  HiShoppingCart,
  HiHome,
  HiViewGrid,
  HiShoppingBag,
  HiLogin,
  HiUserAdd,
  HiShieldCheck,
  HiLogout,
  HiDocumentText,
} from "react-icons/hi";

const Header = memo(() => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const getLinkClass = (path) =>
    `flex items-center px-4 py-2 text-sm rounded-xl transition-all duration-300 font-bold ${
      isActive(path)
        ? "bg-primary/10 text-primary shadow-sm"
        : "text-[#64748b] hover:text-primary hover:bg-primary/5"
    }`;

  const getMobileLinkClass = (path) =>
    `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold ${
      isActive(path)
        ? "bg-primary/10 text-primary shadow-sm"
        : "text-[#1e293b] hover:bg-primary/5 hover:text-primary"
    }`;

  return (
    <>
      <style>{`
        @keyframes badge-pop {
          0% { transform: scale(1); }
          30% { transform: scale(1.4); }
          50% { transform: scale(0.9); }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-badge-pop {
          animation: badge-pop 0.5s ease-out;
        }
      `}</style>
      <header
        className="sticky top-0 z-[1100] bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm text-[#1e293b] h-16 md:h-20 flex items-center"
        dir="rtl"
      >
        <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link
              to={isAdmin ? "/admin" : "/"}
              aria-label="الرئيسية - متجرنا"
              className="flex items-center gap-2.5 text-primary no-underline transition-transform duration-300 hover:scale-105 shrink-0"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white shadow-md shadow-primary/20">
                <HiShoppingBag size={22} className="md:hidden" />
                <HiShoppingBag size={28} className="hidden md:block" />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight">
                متجرنا
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav
              className="hidden md:flex items-center justify-center gap-1"
              aria-label="القائمة الرئيسية"
            >
              {isAdmin ? (
                <Link to="/admin" className={getLinkClass("/admin")}>
                  <HiShieldCheck className="ml-1.5" size={18} />
                  لوحة التحكم
                </Link>
              ) : (
                <>
                  <Link to="/" className={getLinkClass("/")}>
                    <HiHome className="ml-1.5" size={18} />
                    الرئيسية
                  </Link>
                  <Link to="/products" className={getLinkClass("/products")}>
                    <HiViewGrid className="ml-1.5" size={18} />
                    المنتجات
                  </Link>
                  {user && (
                    <Link to="/my-orders" className={getLinkClass("/my-orders")}>
                      <HiDocumentText className="ml-1.5" size={18} />
                      طلباتي
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 shrink-0">
              {!isAdmin && (
                <>
                  <button
                    onClick={() => navigate("/cart")}
                    aria-label="عرض سلة التسوق"
                    className="relative p-2.5 rounded-xl bg-primary/5 hover:bg-primary text-[#64748b] hover:text-white transition-all duration-300"
                  >
                    <HiShoppingCart size={22} />
                    {totalItems > 0 && (
                      <span
                        key={totalItems}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-badge-pop"
                      >
                        {totalItems}
                      </span>
                    )}
                  </button>

                  <Link
                    to="/products"
                    className="hidden sm:flex items-center px-5 py-2.5 bg-gradient-to-l from-primary to-primary/90 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  >
                    تسوق الآن
                  </Link>
                </>
              )}

              {user && (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-2.5 px-3.5 py-1.5 text-sm font-bold text-primary bg-primary/5 rounded-xl border border-primary/10">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center text-sm font-black shadow-sm">
                      {user.name.charAt(0)}
                    </span>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3.5 py-2 text-sm text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 font-bold"
                  >
                    <HiLogout className="ml-1.5" size={18} />
                    <span className="hidden lg:inline">تسجيل خروج</span>
                  </button>
                </div>
              )}

              {!user && !isAdmin && (
                <div className="hidden md:flex items-center gap-1">
                  <Link to="/login" className={getLinkClass("/login")}>
                    <HiLogin className="ml-1.5" size={18} />
                    تسجيل الدخول
                  </Link>
                  <Link to="/register" className={getLinkClass("/register")}>
                    <HiUserAdd className="ml-1.5" size={18} />
                    إنشاء حساب
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileOpen(true)}
                aria-label="فتح القائمة الجانبية"
                className="md:hidden p-2.5 rounded-xl bg-primary/5 hover:bg-primary hover:text-white transition-all duration-300"
              >
                <HiMenu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1200]"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed top-0 right-0 h-full w-[300px] bg-white z-[1300] p-6 flex flex-col gap-3 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black text-primary flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white shadow-sm">
                    <HiShoppingBag size={20} />
                  </div>
                  متجرنا
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="أغلق القائمة"
                  className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300"
                >
                  <HiX size={20} />
                </button>
              </div>
              <hr className="border-gray-100" />
              <nav className="flex flex-col gap-2 mt-2">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className={getMobileLinkClass("/admin")}
                  >
                    <HiShieldCheck size={20} />
                    لوحة التحكم
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/"
                      onClick={() => setMobileOpen(false)}
                      className={getMobileLinkClass("/")}
                    >
                      <HiHome size={20} />
                      الرئيسية
                    </Link>
                    <Link
                      to="/products"
                      onClick={() => setMobileOpen(false)}
                      className={getMobileLinkClass("/products")}
                    >
                      <HiViewGrid size={20} />
                      المنتجات
                    </Link>
                  </>
                )}
                {user ? (
                  <>
                    {!isAdmin && (
                      <Link
                        to="/my-orders"
                        onClick={() => setMobileOpen(false)}
                        className={getMobileLinkClass("/my-orders")}
                      >
                        <HiDocumentText size={20} />
                        طلباتي
                      </Link>
                    )}
                    <hr className="border-gray-100 my-2" />
                    <div className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-primary bg-primary/5 rounded-2xl border border-primary/10">
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center text-sm font-black shadow-sm">
                        {user.name.charAt(0)}
                      </span>
                      <span className="truncate">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-red-50 text-red-500 font-black hover:bg-red-100 transition-all duration-300"
                    >
                      <HiLogout size={20} />
                      تسجيل خروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className={getMobileLinkClass("/login")}
                    >
                      <HiLogin size={20} />
                      تسجيل الدخول
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className={getMobileLinkClass("/register")}
                    >
                      <HiUserAdd size={20} />
                      إنشاء حساب
                    </Link>
                  </>
                )}
                {!isAdmin && (
                  <>
                    <hr className="border-gray-100 my-2" />
                    <button
                      onClick={() => {
                        navigate("/cart");
                        setMobileOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-l from-primary to-primary/90 text-white font-black hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
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
    </>
  );
});

export default Header;
