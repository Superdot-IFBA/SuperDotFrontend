import React, { memo, useCallback } from 'react';
import {
  DataList,
  Separator,
  Tooltip,
  Box,
  Badge,
} from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';
import { ISecondSource } from '../../interfaces/secondSource.interface';
import MobileCard from './MobileCard/MobileCard';
import ExpandableSection from './MobileCard/ExpandableSection';
import InfoGrid from './MobileCard/InfoGrid';
import SectionCard from './MobileCard/SectionCard';

interface SecondSourcesListProps {
  secondSources: ISecondSource[];
  expandedSS: Record<string, boolean>;
  setExpandedSS: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleAge: (birthDate: Date) => number;
  getFirstAndLastName: (fullName: string) => string;
}

const SecondSourcesList: React.FC<SecondSourcesListProps> = ({
  secondSources,
  expandedSS,
  setExpandedSS,
  handleAge,
  getFirstAndLastName,
}) => {
  console.log('SecondSourcesList renderizou'); // Para debug

  // ✅ useMemo para filteredSecondSources
  const filteredSecondSources = React.useMemo(() =>
    secondSources?.filter((secondSource) => secondSource.adultForm?.totalPunctuation !== undefined) || []
    , [secondSources]);

  // ✅ Componente interno memoizado para cada SecondSource
  const SecondSourceItem = useCallback(({ secondSource, index }: { secondSource: ISecondSource; index: number }) => {
    const isExpanded = secondSource._id ? expandedSS[secondSource._id] : false;

    const handleToggleExpand = useCallback(() => {
      setExpandedSS((prev) => ({
        ...prev,
        [String(secondSource._id)]: !prev[String(secondSource._id)],
      }));
    }, [secondSource._id, setExpandedSS]);

    return (
      <MobileCard
        key={secondSource._id || index}
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
        expandedLabel="Ver menos"
        collapsedLabel="Ver mais"
        className="bg-gradient-to-br from-white to-blue-50 border-blue-200/80 hover:border-blue-300/60"
      >
        <InfoGrid
          items={[
            {
              label: 'Identificação',
              value: (
                <Tooltip content={`Avaliado Segundas Fontes - ${index + 1}`}>
                  <Box className="flex items-center gap-1 text-blue-700 font-semibold">
                    <Icon.UserCircle size={16} />
                    ASF - {index + 1}
                  </Box>
                </Tooltip>
              )
            },
            {
              label: 'Nome',
              value: getFirstAndLastName(secondSource.personalData.fullName)
            },
            {
              label: 'Pontuação',
              value: (
                <Badge
                  size="1"
                  variant='surface'
                  color='blue'
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {secondSource.adultForm?.totalPunctuation || 0}
                </Badge>
              )
            },
            {
              label: 'Idade',
              value: secondSource.personalData?.birthDate
                ? `${handleAge(secondSource.personalData.birthDate)} anos`
                : 'Não informada'
            }
          ]}
          columns={2}
        />

        <ExpandableSection isExpanded={isExpanded}>
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <SectionCard
              title="Informações Adicionais"
              icon={<Icon.Info size={18} weight="bold" className="inline-block mr-2" />}
              gradient="bg-gradient-to-r from-cyan-500/5 to-sky-500/5"
              titleColor="text-cyan-900"
            >
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <DataList.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Icon.GraduationCap size={16} />
                    Grau de Escolaridade
                  </DataList.Label>
                  <DataList.Value className="text-sm text-gray-900">
                    {secondSource.personalData?.educationLevel || 'Não informado'}
                  </DataList.Value>
                </div>

                <Separator size="4" className="bg-gray-200/50" />

                <div className="space-y-1">
                  <DataList.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Icon.Heart size={16} />
                    Relação com o Avaliado
                  </DataList.Label>
                  <DataList.Value className="text-sm text-gray-900">
                    {secondSource.personalData?.relationship || 'Não informado'}
                  </DataList.Value>
                </div>

                <Separator size="4" className="bg-gray-200/50" />

                <div className="space-y-1">
                  <DataList.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Icon.Clock size={16} />
                    Tempo de Relação
                  </DataList.Label>
                  <DataList.Value className="text-sm text-gray-900">
                    {secondSource.personalData?.relationshipTime || 'Não informado'}
                  </DataList.Value>
                </div>
              </div>
            </SectionCard>
          </div>
        </ExpandableSection>
      </MobileCard>
    );
  }, [expandedSS, setExpandedSS, handleAge, getFirstAndLastName]);

  if (filteredSecondSources.length === 0) {
    return (
      <DataList.Root orientation="vertical" className="!font-roboto px-2">
        <div className="text-center py-8 text-gray-500">
          <Icon.Users size={32} className="mx-auto mb-2 opacity-50" />
          <p>Nenhuma segunda fonte encontrada</p>
        </div>
      </DataList.Root>
    );
  }

  return (
    <DataList.Root orientation="vertical" className="!font-roboto px-2">
      {filteredSecondSources.map((secondSource, index) => (
        <SecondSourceItem
          key={secondSource._id || index}
          secondSource={secondSource}
          index={index}
        />
      ))}
    </DataList.Root>
  );
};

const areEqual = (prevProps: SecondSourcesListProps, nextProps: SecondSourcesListProps) => {
  return (
    prevProps.secondSources === nextProps.secondSources &&
    prevProps.expandedSS === nextProps.expandedSS &&
    prevProps.handleAge === nextProps.handleAge &&
    prevProps.getFirstAndLastName === nextProps.getFirstAndLastName
  );
};

export default memo(SecondSourcesList, areEqual);