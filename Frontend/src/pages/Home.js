import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HiTag,
  HiViewGridAdd,
  HiShoppingBag,
  HiArrowLeft,
  HiStar,
  HiHeart,
  HiCube,
} from "react-icons/hi";
import usePageTitle from "../utils/usePageTitle";
import { getProductsApi } from "../api/productService";
import { mapProduct } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeleton";

const Home = () => {
  usePageTitle("الرئيسية");
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsApi({ page: "1", limit: "4", sort: "newest" })
      .then((res) => {
        if (res?.data) setFeatured(res.data.map(mapProduct));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen" dir="rtl">
      {/* HERO */}
      <section className="w-full min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] relative overflow-hidden border-b border-gray-200 flex items-center">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 w-full py-8 md:py-0">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 lg:gap-16">
            <div className="flex-[1] flex justify-center w-full">
              <div className="relative w-fit">
                <div className="absolute top-[8%] left-[-6%] w-full h-full bg-primary-light/15 rounded-[40px] z-0" />
                <div className="absolute bottom-[8%] right-[-6%] w-3/4 h-3/4 bg-primary/5 rounded-full blur-2xl z-0" />
                <img
                  src={require("../assets/store.webp")}
                  alt="التسوق الإلكتروني بذكاء من متجرنا"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  width={540}
                  height={360}
                  className="w-full max-w-[340px] md:max-w-[500px] lg:max-w-[580px] h-auto rounded-[40px] border-[12px] border-white bg-white z-[1] relative"
                />
              </div>
            </div>
            <div className="flex-[1.2] text-center md:text-right w-full">
              <div className="inline-flex items-center bg-primary/[0.08] px-3 py-2 rounded-[12px] mb-4 gap-1.5">
                <HiTag className="text-primary" size={18} />
                <span className="text-primary font-black tracking-wide text-xs uppercase">
                  منتجات حصرية لعام {new Date().getFullYear()}
                </span>
              </div>
              <h1 className="font-black text-[#1e293b] mb-4 leading-[1.2] text-[2.5rem] md:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
                <div>
                  ارتقِ بأسلوب <span className="text-primary">حياتك</span>
                </div>
                <div className="mt-4 md:mt-8">مع أفضل المنتجات</div>
              </h1>
              <p className="text-[#64748b] mb-8 font-normal max-w-[600px] mx-auto md:mx-0 leading-[1.8] text-base md:text-lg lg:text-xl">
                نحن هنا لنقدم لك تشكيلة عالمية مختارة بعناية لتتناسب مع تطلعاتك.
                جودة، أناقة، وتوصيل سريع في مكان واحد وبضغطة زر.
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-5 md:px-7 py-3.5 md:py-4 bg-primary text-white rounded-[16px] font-extrabold text-sm md:text-lg hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/20"
                >
                  <HiViewGridAdd size={22} />
                  تصفح المنتجات
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 px-5 md:px-7 py-3.5 md:py-4 bg-white text-[#1e293b] rounded-[16px] font-extrabold text-sm md:text-lg border-2 border-gray-200 hover:border-primary hover:bg-primary/[0.03] hover:-translate-y-1 transition-all duration-300"
                >
                  <HiShoppingBag size={22} />
                  عرض السلة
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-1 bg-primary/[0.08] text-primary text-xs font-black px-3 py-1.5 rounded-[10px] mb-2">
                <HiStar size={14} />
                أحدث الإضافات
              </span>
              <h2 className="font-black text-[#1e293b] text-2xl md:text-3xl">
                منتجات <span className="text-primary">مميزة</span>
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-1 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300"
            >
              عرض الكل
              <HiArrowLeft size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-[fadeIn_0.3s_ease_forwards]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              {featured.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-[fadeIn_0.5s_ease_forwards]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[#64748b]">
              <HiCube size={60} className="mx-auto mb-3 text-gray-200" />
              <p className="font-bold">لا توجد منتجات بعد</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-1 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm transition-all duration-300"
            >
              عرض الكل
              <HiArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-light/5 rounded-full blur-3xl" />
            <div className="relative z-[1]">
              <h2 className="text-2xl md:text-4xl font-black text-white mb-3">
                استعد لتجربة تسوق{" "}
                <span className="text-primary-light">فريدة</span>
              </h2>
              <p className="text-[#94a3b8] max-w-[600px] mx-auto mb-6 text-sm md:text-base">
                {!user && <span>انضم إلى آلاف العملاء الذين يثقون بنا.</span>}
                تسوق بكل ثقة واستمتع بأفضل العروض.
              </p>
              <div className="flex gap-3 justify-center">
                {!user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-[16px] font-extrabold text-sm md:text-base hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-primary/20"
                  >
                    <HiHeart size={18} />
                    إنشاء حساب مجاني
                  </Link>
                )}
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-[16px] font-extrabold text-sm md:text-base border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <HiViewGridAdd size={18} />
                  تسوق الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
