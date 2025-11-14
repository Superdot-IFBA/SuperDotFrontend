import { DataList, Flex, Badge, Tooltip, Text } from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';

interface ParticipantBasicInfoProps {
  expandedParticipants: Record<string, boolean>;
  setExpandedParticipants: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedParticipants: any[]
  getFirstAndLastName: (fullName: string) => string
}

export const ParticipantBasicInfo: React.FC<ParticipantBasicInfoProps> = ({
  setExpandedParticipants,
  expandedParticipants,
  selectedParticipants,
  getFirstAndLastName
}) => {
  return (
    <DataList.Root orientation="vertical" className="!font-roboto p-2">
      {selectedParticipants.map((participant, index) => (
        <DataList.Item
          key={index}
          className={`w-full rounded-2xl mb-4 transition-all duration-500 ease-out transform
        bg-gradient-to-br from-white to-violet-50 shadow-sm hover:shadow-md 
        border border-violet-200/80 backdrop-blur-sm overflow-hidden
        ${participant._id && expandedParticipants[participant._id] ? 'max-h-[600px]' : 'max-h-[300px]'}
        hover:border-violet-300/60`}
        >
          <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-xl px-4 py-3 border-b border-violet-100/50">
            <p className="text-[17px] font-semibold text-center text-violet-900 tracking-tight flex items-center justify-center gap-2">
              <Icon.User size={20} weight="bold" />
              Informações do participante
            </p>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Nome</DataList.Label>
                <DataList.Value className="text-sm font-semibold text-gray-900">
                  {getFirstAndLastName(participant.personalData.fullName)}
                </DataList.Value>
              </div>

              <div className="space-y-1">
                <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pontuação</DataList.Label>
                <DataList.Value className="text-sm font-semibold text-violet-700">
                  {participant.adultForm?.totalPunctuation}
                </DataList.Value>
              </div>
              <div className="space-y-1">
                <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide"> Identificação</DataList.Label>
                <DataList.Value className="text-sm font-semibold text-violet-700">
                  <Tooltip content={`Avaliado - ${index + 1}`}>
                    <Badge
                      size="2"
                      variant="soft"
                      className="bg-violet-100 text-violet-700 border-violet-200 font-semibold cursor-help"
                    >
                      <Flex align="center" gap="2">
                        <Icon.UserCircle size={14} />
                        A-{index + 1}
                      </Flex>
                    </Badge>
                  </Tooltip>
                </DataList.Value>
              </div>
              <div className="space-y-1">
                <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Genero</DataList.Label>
                <DataList.Value className="text-sm font-semibold text-violet-700">
                  <Text weight="medium" className="text-gray-700">
                    {participant.personalData.gender}
                  </Text>
                </DataList.Value>
              </div>

            </div>

            {participant?._id && expandedParticipants[participant._id] && (
              <div className="mt-4 pt-4 border-t border-gray-200/50 animate-in fade-in-50 duration-300">
                <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-xl p-4 -mx-2">
                  <p className="text-[15px] font-semibold text-center text-violet-900 mb-3 flex items-center justify-center gap-2">
                    <Icon.Certificate size={18} weight="bold" />
                    Indicadores de AH/SD
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                      <p className="text-xs text-gray-600 mb-2">Questionário</p>
                      <Badge
                        size="2"
                        color={`${participant.adultForm?.giftednessIndicators ? 'green' : 'red'}`}
                        className={`w-full justify-center border ${participant.giftdnessIndicatorsByResearcher ? ' !border-green-500' : '!border-red-500'}`}
                      >
                        {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                      </Badge>
                    </div>

                    <div className="text-center p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                      <p className="text-xs text-gray-600 mb-2">Pesquisador</p>
                      <Badge
                        size="2"
                        color={`${participant.giftdnessIndicatorsByResearcher ? 'green' : 'red'}`}
                        className={`w-full justify-center border ${participant.giftdnessIndicatorsByResearcher ? ' !border-green-500' : '!border-red-500'}`}
                      >
                        {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 pt-3 border-t border-gray-200/60 rounded-b-xl bg-gradient-to-r from-violet-500/5 to-purple-500/5">
            <Flex justify="center">
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-700 text-[13px] font-medium transition-all hover:bg-violet-500/20 hover:scale-105 active:scale-95"
                onClick={() =>
                  setExpandedParticipants((prev) => ({
                    ...prev,
                    [String(participant._id)]: !prev[String(participant._id)],
                  }))
                }
                title={
                  participant._id && expandedParticipants[participant._id]
                    ? "Ver menos"
                    : "Ver mais"
                }
                color="violet"
              >
                {participant._id && expandedParticipants[participant._id] ? "Ver menos" : "Ver mais"}
                <Icon.CaretDown
                  size={14}
                  className={`transition-all duration-500 ${participant._id && expandedParticipants[participant._id] ? "rotate-180" : ""
                    }`}
                />
              </button>
            </Flex>
          </div>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
};

