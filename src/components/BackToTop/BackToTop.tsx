import { useState, useEffect } from 'react';
import * as Icon from '@phosphor-icons/react';

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    setScrollContainer(container);

    const handleScroll = () => {
      const scrollY = container ? container.scrollTop : window.scrollY;
      setShowButton(scrollY > 100);
    };

    const target = container || window;
    target.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`
        fixed bottom-6 right-6 z-30 p-3 w-12 h-12 rounded-full bg-primary text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 hover:bg-secondary border  
        ${showButton ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}
        md:bottom-8 md:right-8 
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Icon.ArrowUp size={24} weight="bold" />
      <span className="sr-only">Voltar ao topo</span>
    </button>
  );
};

export default BackToTop;
