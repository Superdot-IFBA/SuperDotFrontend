import * as Icon from "@phosphor-icons/react";
import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";

const WelcomeModal = () => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dontShow = localStorage.getItem("dontShowWelcome");

      if (dontShow !== "true") {
        setOpen(true);
      }
    }
  }, []);

  const handleClose = () => {
    if (checked) {
      localStorage.setItem("dontShowWelcome", "true");
    }
    setOpen(false);
  };

  const handleDocumentationClick = () => {
    if (checked) {
      localStorage.setItem("dontShowWelcome", "true");
    }
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title=""
      accessibleDescription=""
      className="relative flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl overflow-hidden border-none  max-w-lg"
      onclickCancel={handleClose}
      classNameChildren="!p-0"
    >
      <div className="bg-gradient-to-br from-violet-600 via-purple-500 to-primary py-8 w-full flex justify-center items-center">
        <Icon.CheckCircle size={80} weight="duotone" className="text-white" />
      </div>

      <div className="px-8 py-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Acesso liberado ao SuperDot
        </h2>

        <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
          Agora você tem acesso ao{" "}
          <strong className="font-semibold text-gray-900">SuperDot</strong> — uma
          plataforma inovadora voltada à identificação de pessoas com{" "}
          <strong>Altas Habilidades/Superdotação (AH/SD)</strong>. Este software
          foi desenvolvido para apoiar pesquisadores no processo de cadastro,
          análise e comparação de dados entre participantes.
        </p>

        <div className="mt-6">
          <a
            href="https://www.notion.so/Documenta-o-do-Sistema-SUPERDOT-209b16a3ceed80368dd4c0040a7a0a9c?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDocumentationClick}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-violet-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-all"
          >
            <Icon.Rocket size={22} weight="fill" />
            Começar pela Documentação
          </a>
        </div>

        <div className="mt-5 flex justify-center items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-4 h-4 accent-violet-600 rounded focus:ring-violet-500"
          />
          <label className="cursor-pointer">
            Não mostrar esta mensagem novamente
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;