import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { HiArrowUp, HiShoppingBag } from "react-icons/hi";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { getCategoriesApi } from "../api/categoryService";

const Footer = memo(() => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [footerCategories, setFooterCategories] = useState([]);

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getCategoriesApi()
      .then((res) => {
        if (res?.data) setFooterCategories(res.data.map((c) => c.name));
      })
      .catch(() => {});
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook size={16} />,
      path: "https://facebook.com",
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={16} />,
      path: "https://instagram.com",
    },
    {
      name: "Twitter",
      icon: <FaXTwitter size={16} />,
      path: "https://twitter.com",
    },
    { name: "WhatsApp", icon: <FaWhatsapp size={16} />, path: "https://wa.me" },
  ];

  const quickLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "المنتجات", path: "/products" },
    { name: "سلة التسوق", path: "/cart" },
    { name: "طلباتي", path: "/my-orders" },
    { name: "حسابي", path: "/login" },
  ];

  return (
    <footer
      className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-[#94a3b8] pt-10 pb-4 border-t border-white/[0.05]"
      dir="rtl"
      role="contentinfo"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-[1]">
        <div className="flex justify-between gap-6 md:gap-4 flex-wrap md:flex-nowrap mr-0 md:mr-4">
          {/* BRAND */}
          <div className="md:flex-[0_0_520px] w-full sm:w-[calc(50%-24px)] md:w-auto">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[52px] h-[52px] rounded-[16px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white ">
                  <HiShoppingBag size={30} />
                </div>
                <span className="text-xl font-black text-white tracking-tight">
                  متجرنا
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#94a3b8] mb-4 max-w-[520px]">
                نحن وجهتك الموثوقة للتسوق الإلكتروني في فلسطين. نقدم لك أفضل
                العلامات التجارية العالمية بضمان وجودة لا تضاهى، مع خدمة توصيل
                سريعة تغطي كافة المناطق.
              </p>
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.path}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="w-11 h-11 rounded-[14px] bg-white/[0.04] text-[#cbd5e1] flex items-center justify-center transition-all duration-400 hover:bg-primary hover:text-white hover:-translate-y-1.5 "
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="min-w-[50%] md:min-w-[220px]">
            <h3 className="relative font-black text-white mb-3.5 w-fit after:content-[''] after:absolute after:-bottom-2.5 after:right-0 after:w-10 after:h-[3px] after:bg-primary after:rounded-[4px]">
              روابط سريعة
            </h3>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[#94a3b8] hover:text-primary-light transition-all duration-300 w-fit no-underline hover:-translate-x-2.5"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="min-w-[50%] md:min-w-[220px]">
            <h3 className="relative font-black text-white mb-3.5 w-fit after:content-[''] after:absolute after:-bottom-2.5 after:right-0 after:w-10 after:h-[3px] after:bg-primary after:rounded-[4px]">
              أهم الأقسام
            </h3>
            <div className="flex flex-col gap-2.5">
              {(footerCategories.length > 0 ? footerCategories : []).map(
                (cat) => (
                  <span
                    key={cat}
                    className="text-[#94a3b8] hover:text-primary-light transition-all duration-300 w-fit cursor-pointer hover:-translate-x-2.5"
                  >
                    {cat}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <hr className="mt-5 md:mt-7 mb-3 border-white/[0.08]" />

        <div className="flex items-center justify-center text-center flex-wrap">
          <span className="text-sm text-[#94a3b8]">
            متجرنا - جميع الحقوق محفوظة &copy; {new Date().getFullYear()}.
          </span>
        </div>
      </div>

      {/* SCROLL TO TOP */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          aria-label="العودة للأعلى"
          className="fixed bottom-10 left-5 z-[1200] bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center  hover:bg-primary-dark hover:-translate-y-1.5 transition-all duration-300"
        >
          <HiArrowUp size={24} />
        </button>
      )}
    </footer>
  );
});

export default Footer;
