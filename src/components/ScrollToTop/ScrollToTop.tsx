import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      const scrollContainer = document.querySelector<HTMLElement>(
        "[data-radix-scroll-area-viewport]"
      );

      if (scrollContainer) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        });
      } else {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    };

    const timer = setTimeout(scrollToTop, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
