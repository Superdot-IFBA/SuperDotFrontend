import { AlertDialog, Box, Flex, IconButton, Text, Strong, Tooltip } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { useState } from "react";

const ActionButtonExplain = () => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <Tooltip content={"Visualizar Ações"}>
        <button
          onClick={() => setOpen(true)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Informações sobre indicadores de superdotação"
        >
          <Icon.Info size={25} />
        </button>
      </Tooltip>

      <AlertDialog.Content className="relative bg-white rounded-md !p-0 z-50 !font-roboto shadow-lg w-full max-w-3xl">
        {/* Botão de Fechar */}
        <AlertDialog.Cancel className="absolute top-2 right-2">
          <Button
            className="hover:cursor-pointer"
            aria-label="Fechar modal"
            title={""}
            color={"red"}
            size={"Small"}
            onClick={() => setOpen(false)}
          >
            <Icon.X size={20} weight="bold" />
          </Button>
        </AlertDialog.Cancel>

        {/* Título */}
        <AlertDialog.Title className="text-xl font-bold max-sm:!text-[18px] text-white !font-roboto bg-gradient-to-br from-violet-600 via-purple-500 to-primary py-6 w-full flex justify-center items-center">
          Tipos de Ação
        </AlertDialog.Title>

        {/* Conteúdo */}
        <div className="px-6 pt-4 pb-6 space-y-4">
          <AlertDialog.Description className="flex gap-3 items-start">
            <IconButton size="2" color="lime" radius="full" variant="outline">
              <Icon.IdentificationCard size={20} />
            </IconButton>
            <Text>
              <Strong className="!font-roboto">
                Visualizar Informações completas do Participante
              </Strong>
              <br />
              Esta seção permite visualizar todas as informações detalhadas do participante,
              incluindo os dados pessoais. É uma ferramenta útil para ter acesso completo ao
              perfil, facilitando a consulta e acompanhamento.
            </Text>
          </AlertDialog.Description>

          <AlertDialog.Description className="flex gap-3 items-start">
            <IconButton color="cyan" radius="full" variant="outline">
              <Icon.ClipboardText size={20} />
            </IconButton>
            <Text>
              <Strong className="!font-roboto">
                Comparar respostas do avaliado com as 2ª fontes
              </Strong>
              <br />
              Esta funcionalidade permite comparar as respostas do avaliado com as das segundas
              fontes, facilitando a análise de divergências e semelhanças, garantindo uma
              avaliação mais completa e precisa.
            </Text>
          </AlertDialog.Description>

          <AlertDialog.Description className="flex gap-3 items-start">
            <IconButton color="bronze" radius="full" variant="outline">
              <Icon.IdentificationBadge size={20} />
            </IconButton>
            <Text>
              <Strong className="!font-roboto">Visualizar Autobiografia</Strong>
              <br />
              Esta opção permite acessar a autobiografia do participante, onde ele compartilha
              sua trajetória pessoal e experiências, oferecendo um panorama completo de sua
              vida e motivações.
            </Text>
          </AlertDialog.Description>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ActionButtonExplain;
