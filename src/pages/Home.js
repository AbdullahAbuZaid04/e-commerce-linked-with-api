import { Link } from "react-router-dom";
import { HiTag, HiViewGridAdd, HiShoppingBag } from "react-icons/hi";

const Home = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen" dir="rtl">
      {/* HERO */}
      <section className="w-full min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] relative overflow-hidden border-b border-gray-200 flex items-center">
        {/* Decorative circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 w-full py-8 md:py-0">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 lg:gap-16">
            {/* IMAGE */}
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

            {/* TEXT */}
            <div className="flex-[1.2] text-center md:text-right w-full">
              <div className="inline-flex items-center bg-primary/[0.08] px-3 py-2 rounded-[12px] mb-4 gap-1.5">
                <HiTag className="text-primary" size={18} />
                <span className="text-primary font-black tracking-wide text-xs uppercase">
                  منتجات حصرية لعام {new Date().getFullYear()}
                </span>
              </div>

              <h1 className="font-black text-[#1e293b] mb-4 leading-[1.2] text-[2.5rem] md:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
                ارتقِ بأسلوب <span className="text-primary">حياتك</span> <br />
                مع أفضل المنتجات
              </h1>

              <p className="text-[#64748b] mb-8 font-normal max-w-[600px] mx-auto md:mx-0 leading-[1.8] text-base md:text-lg lg:text-xl">
                نحن هنا لنقدم لك تشكيلة عالمية مختارة بعناية لتتناسب مع تطلعاتك.
                جودة، أناقة، وتوصيل سريع في مكان واحد وبضغطة زر.
              </p>

              <div className="flex gap-3 justify-center md:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-5 md:px-7 py-3.5 md:py-4 bg-primary text-white rounded-[16px] font-extrabold text-sm md:text-lg hover:-translate-y-1 transition-all duration-300"
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


    </div>
  );
};

export default Home;
