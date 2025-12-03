import { DataList, Badge, Flex, Text } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react"


const quantificacaoRespostas = [
  {
    pergunta: 1,
    adulto: { respostaComum: "-", pontosC: "-", respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Sim", pontosC: 2, respostaNC: "Não", pontosNC: 1 },
  },
  {
    pergunta: 2,
    adulto: { respostaComum: "-", pontosC: "-", respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Não", pontosC: 2, respostaNC: "Sim", pontosNC: 1 },
  },
  {
    pergunta: 3,
    adulto: { respostaComum: "-", pontosC: "-", respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Sim", pontosC: 2, respostaNC: "Não", pontosNC: 1 },
  },
  {
    pergunta: 4,
    adulto: { respostaComum: "-", pontosC: "-", respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Sim ou Não", pontosC: 1, respostaNC: "-", pontosNC: "-" },
  },
  {
    pergunta: 5,
    adulto: { respostaComum: "Antes dos 6 anos", pontosC: 2, respostaNC: "Qualquer outra idade", pontosNC: 1 },
    adulto2: { respostaComum: "Sim ou Não", pontosC: 1, respostaNC: "-", pontosNC: "-" },
  },
  {
    pergunta: 6,
    adulto: { respostaComum: "10-20", pontosC: 2, respostaNC: "Menos de 10-20", pontosNC: 1 },
    adulto2: { respostaComum: "10-20", pontosC: 2, respostaNC: "Menos de 10-20", pontosNC: 1 },
  },
  {
    pergunta: 7,
    adulto: { respostaComum: "Pouco comuns para a faixa etária ou meio social", pontosC: 2, respostaNC: "Assuntos comuns e populares", pontosNC: 1 },
    adulto2: { respostaComum: "Pouco comuns para a faixa etária ou meio social", pontosC: 2, respostaNC: "Assuntos comuns e populares", pontosNC: 1 },
  },
  {
    pergunta: 8,
    adulto: { respostaComum: "Muito mais velhos ou muito mais novos do que eles", pontosC: 1, respostaNC: "Assuntos comuns e populares", pontosNC: "-" },
    adulto2: { respostaComum: "Muito mais velhos ou muito mais novos do que eles", pontosC: 1, respostaNC: "Assuntos comuns e populares", pontosNC: "-" },
  },
  {
    pergunta: 9,
    adulto: { respostaComum: "Qualquer uma", pontosC: 1, respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Qualquer uma", pontosC: 1, respostaNC: "-", pontosNC: "-" },
  },
  {
    pergunta: "10-22",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: "23-30",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: 31,
    adulto: { respostaComum: "Frequentemente ou sempre (acadêmico), Nunca, raramente (produtivo-criativo)", pontosC: 2, respostaNC: "Às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre (acadêmico), Nunca, raramente (produtivo-criativo)", pontosC: 2, respostaNC: "Às vezes", pontosNC: 1 },
  },
  {
    pergunta: "32-41",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: "42-46",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: "47-49",
    adulto: { respostaComum: "Nunca, raramente", pontosC: 2, respostaNC: "Às vezes, frequentemente ou sempre", pontosNC: 1 },
    adulto2: { respostaComum: "Nunca, raramente", pontosC: 2, respostaNC: "Às vezes, frequentemente ou sempre", pontosNC: 1 },
  },
  {
    pergunta: "50-54",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: 55,
    adulto: { respostaComum: "Nunca, raramente", pontosC: 2, respostaNC: "Às vezes, frequentemente ou sempre", pontosNC: 1 },
    adulto2: { respostaComum: "Nunca, raramente", pontosC: 2, respostaNC: "Às vezes, frequentemente ou sempre", pontosNC: 1 },
  },
  {
    pergunta: "56-62",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, Às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, Às vezes", pontosNC: 1 },
  },
  {
    pergunta: "63-67",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, Às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, Às vezes", pontosNC: 1 },
  },
  {
    pergunta: 68,
    adulto: { respostaComum: "Independente de quantas opções foram marcadas", pontosC: 1, respostaNC: "Não", pontosNC: 1 },
    adulto2: { respostaComum: "Independente de quantas opções foram marcadas", pontosC: 1, respostaNC: "Não", pontosNC: 1 },
  },
  {
    pergunta: 69,
    adulto: { respostaComum: "Sim", pontosC: 2, respostaNC: "Não ou outra", pontosNC: 1 },
    adulto2: { respostaComum: "Sim", pontosC: 2, respostaNC: "Não ou outra", pontosNC: 1 },
  },
  {
    pergunta: 70,
    adulto: { respostaComum: "De 10 a 20 ou mais de 20", pontosC: 2, respostaNC: "Menos de 5, 5 a 10 ou outra", pontosNC: 1 },
    adulto2: { respostaComum: "De 10 a 20 ou mais de 20", pontosC: 2, respostaNC: "Menos de 5, 5 a 10 ou outra", pontosNC: 1 },
  },
];



export default function InstrumentResponsesList() {
  return (
    <DataList.Root orientation="vertical" className="!font-roboto p-2">
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-xl px-4 py-3 border-b border-blue-100/50 mb-4">
        <p className="text-[17px] font-semibold text-center text-blue-900 tracking-tight flex items-center justify-center gap-2">
          <Icon.ListNumbers size={20} weight="bold" />
          Quantificação das Respostas - QIIAHSD
        </p>
      </div>

      {quantificacaoRespostas.map((item, index) => (
        <DataList.Item
          key={index}
          className="w-full rounded-2xl mb-4 transition-all duration-300 ease-out transform
            bg-gradient-to-br from-white to-blue-50 shadow-sm hover:shadow-md 
            border border-blue-200/80 backdrop-blur-sm overflow-hidden
            hover:border-blue-300/60"
        >
          <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-t-xl px-4 py-3 border-b border-blue-100/50">
            <Flex align="center" justify="center" gap="2">
              <Badge
                size="2"
                color="blue"
                className="font-semibold"
              >
                <Flex align="center" gap="2">
                  <Icon.Question size={16} weight="bold" />
                  Pergunta {item.pergunta}
                </Flex>
              </Badge>
            </Flex>
          </div>

          <div className="p-4">
            <Text weight="medium" className="text-gray-700 mb-3 block text-center">
              Respostas e Pontuações
            </Text>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                <DataList.Label className="text-sm font-semibold text-blue-700 flex items-center justify-center gap-2 border-b border-blue-100 pb-2">
                  <Icon.User size={16} weight="bold" />
                  Adulto
                </DataList.Label>

                <div className="space-y-1">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">Comum:</span>
                      <Badge size="1" color="blue" className="font-semibold">
                        {item.adulto.pontosC}
                      </Badge>
                    </div>
                    <DataList.Value className="text-xs text-gray-900">
                      {item.adulto.respostaComum}
                    </DataList.Value>
                  </div>

                  <div className="space-y-1 mt-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">Não comum:</span>
                      <Badge size="1" color="red" className="font-semibold">
                        {item.adulto.pontosNC}
                      </Badge>
                    </div>
                    <DataList.Value className="text-xs text-gray-900">
                      {item.adulto.respostaNC}
                    </DataList.Value>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-white rounded-lg border border-cyan-100 shadow-sm">
                <DataList.Label className="text-sm font-semibold text-cyan-700 flex items-center justify-center gap-2 border-b border-cyan-100 pb-2">
                  <Icon.Users size={16} weight="bold" />
                  2ª Fonte
                </DataList.Label>

                <div className="space-y-1">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">Comum:</span>
                      <Badge size="1" color="cyan" className="font-semibold">
                        {item.adulto2.pontosC}
                      </Badge>
                    </div>
                    <DataList.Value className="text-xs text-gray-900">
                      {item.adulto2.respostaComum}
                    </DataList.Value>
                  </div>

                  <div className="space-y-1 mt-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">Não comum:</span>
                      <Badge size="1" color="red" className="font-semibold">
                        {item.adulto2.pontosNC}
                      </Badge>
                    </div>
                    <DataList.Value className="text-xs text-gray-900">
                      {item.adulto2.respostaNC}
                    </DataList.Value>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DataList.Item>
      ))}

      <DataList.Item className="w-full rounded-2xl mb-4
        bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm
        border border-green-200/80 backdrop-blur-sm overflow-hidden">

        <div className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-t-xl px-4 py-3 border-b border-green-100/50">
          <Flex align="center" justify="center" gap="2">
            <Badge
              size="2"
              color="green"
              className="font-semibold"
            >
              <Flex align="center" gap="2">
                <Icon.Calculator size={16} weight="bold" />
                Totais Finais
              </Flex>
            </Badge>
          </Flex>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-green-100 shadow-sm">
              <DataList.Label className="text-sm font-semibold text-green-700 mb-2">
                QIIAHSD-Adulto
              </DataList.Label>
              <DataList.Value>
                <Badge size="2" color="green" className="font-bold text-lg">
                  132
                </Badge>
              </DataList.Value>
            </div>

            <div className="text-center p-3 bg-white rounded-lg border border-cyan-100 shadow-sm">
              <DataList.Label className="text-sm font-semibold text-cyan-700 mb-2">
                QIIAHSD-Adulto-2ª Fonte
              </DataList.Label>
              <DataList.Value>
                <Badge size="2" color="cyan" className="font-bold text-lg">
                  138
                </Badge>
              </DataList.Value>
            </div>
          </div>
        </div>
      </DataList.Item>
    </DataList.Root>
  );
}

