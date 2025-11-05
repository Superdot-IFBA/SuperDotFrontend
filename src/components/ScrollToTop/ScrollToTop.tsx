// components/ScrollToTop/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Primeiro tenta achar o viewport do ScrollArea
      const scrollContainer = document.querySelector<HTMLElement>(
        "[data-radix-scroll-area-viewport]"
      );

      if (scrollContainer) {
        // Usa requestAnimationFrame para garantir que o elemento já foi renderizado
        requestAnimationFrame(() => {
          scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        });
      } else {
        // Caso a página não use ScrollArea
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    };

    // Reexecuta o scroll alguns milissegundos depois da troca de rota,
    // garantindo que o novo conteúdo foi montado
    const timer = setTimeout(scrollToTop, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
