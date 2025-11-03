import React, { useState, MouseEvent } from "react";

interface FloatingPopupAutoProps {
  message?: string;
  buttonText?: string;
  redirectUrl?: string;
  imageUrl?: string;
}

const FloatingPopupAuto: React.FC<FloatingPopupAutoProps> = ({
  message,
  buttonText,
  redirectUrl,
  imageUrl,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);


  // Fecha o popup com transição suave
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 200);
  };

  // Redireciona ao clicar no botão
  const handleButtonClick = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  // Impede que o clique no popup feche ele acidentalmente
  const handlePopupClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none ">
      <div
        onClick={handlePopupClick}
        className={`
          fixed left-4 bottom-4 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl
          border border-gray-100 transform transition-all duration-300 pointer-events-auto
          hover:shadow-3xl hover:-translate-y-1
          ${isClosing ? "translate-y-4 opacity-0 scale-95" : "translate-y-0 opacity-100 scale-100"}
        `}
      >
        <button
          onClick={handleClose}
          aria-label="Fechar popup"
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200
                     rounded-full flex items-center justify-center text-gray-500
                     hover:text-gray-700 transition-all duration-200 shadow-md z-10
                     font-bold text-sm"
        >
          &times;
        </button>

        {/* Conteúdo */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            {/* Imagem */}
            <img
              src={imageUrl}
              alt="Grupac - SuperDot"
              className="w-28 h-28 rounded-xl object-cover flex-shrink-0"
            />

            {/* Texto e botão */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                {message}
              </h3>

              <button
                onClick={handleButtonClick}
                className="mt-3 w-full bg-gradient-to-tr from-violet-600 via-purple-500 to-primary text-white font-medium
                           py-2 px-4 rounded-xl transition-all duration-200 transform
                           hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg
                           text-sm"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FloatingPopupAuto;
