import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // الانتقال للأعلى عند تغيير المسار
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // هذا المكون لا يحتاج لعرض أي شيء
};

export default ScrollToTop;
