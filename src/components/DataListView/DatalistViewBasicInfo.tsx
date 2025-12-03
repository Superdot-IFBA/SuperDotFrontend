import { DataList, Flex, Badge, Tooltip, Text } from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';
import MobileCard from './MobileCard/MobileCard';
import ExpandableSection from './MobileCard/ExpandableSection';
import InfoGrid from './MobileCard/InfoGrid';
import SectionCard from './MobileCard/SectionCard';

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
      {selectedParticipants.map((participant, index) => {
        const isExpanded = participant._id ? expandedParticipants[participant._id] : false;

        const handleToggleExpand = () => {
          setExpandedParticipants((prev) => ({
            ...prev,
            [String(participant._id)]: !prev[String(participant._id)],
          }));
        };

        return (
          <MobileCard
            key={index}
            isExpanded={isExpanded}
            onToggleExpand={handleToggleExpand}
            expandedLabel="Ver menos"
            collapsedLabel="Ver mais"
          >
            <InfoGrid
              items={[
                {
                  label: 'Nome',
                  value: getFirstAndLastName(participant.personalData.fullName)
                },
                {
                  label: 'Pontuação',
                  value: participant.adultForm?.totalPunctuation,
                  className: 'text-violet-700'
                },
                {
                  label: 'Identificação',
                  value: (
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
                  )
                },
                {
                  label: 'Gênero',
                  value: (
                    <Text weight="medium" className="text-gray-700">
                      {participant.personalData.gender}
                    </Text>
                  ),
                  className: 'text-violet-700'
                }
              ]}
              columns={2}
            />

            <ExpandableSection isExpanded={isExpanded}>
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <SectionCard
                  title="Indicadores de AH/SD"
                  icon={<Icon.Certificate size={18} weight="bold" className="inline-block mr-2" />}
                  gradient="bg-gradient-to-r from-violet-500/5 to-purple-500/5"
                  titleColor="text-violet-900"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                      <p className="text-xs text-gray-600 mb-2">Questionário</p>
                      <Badge
                        variant='surface'
                        size="2"
                        color={`${participant.adultForm?.giftednessIndicators ? 'green' : 'red'}`}

                      >
                        {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                      </Badge>
                    </div>

                    <div className="text-center p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                      <p className="text-xs text-gray-600 mb-2">Pesquisador</p>
                      <Badge
                        size="2"
                        variant='surface'
                        color={`${participant.giftdnessIndicatorsByResearcher ? 'green' : 'red'}`}

                      >
                        {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                      </Badge>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </ExpandableSection>
          </MobileCard>
        );
      })}
    </DataList.Root>
  );
};