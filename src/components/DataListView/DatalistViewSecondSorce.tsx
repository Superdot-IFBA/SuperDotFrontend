import React from 'react';
import {
  DataList,
  Separator,
  Flex,
  Tooltip,
  Box,
  Badge,
} from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';
import { Button } from '../Button/Button';
import { ISecondSource } from '../../interfaces/secondSource.interface';

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
  return (
    <DataList.Root orientation="vertical" className="!font-roboto px-2">
      {secondSources?.filter((secondSource) => secondSource.adultForm?.totalPunctuation !== undefined)
        .map((secondSource, index) => (
          <DataList.Item
            key={secondSource._id || index}
            className={`w-full rounded-2xl mb-4 transition-all duration-500 ease-out transform
            bg-gradient-to-br from-white to-blue-50 shadow-sm hover:shadow-md 
            border border-blue-200/80 backdrop-blur-sm overflow-hidden
            ${secondSource._id && expandedSS[secondSource._id] ? 'max-h-[600px]' : 'max-h-[300px]'}
            hover:border-blue-300/60`}
          >
            <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-t-xl px-4 py-3 border-b border-blue-100/50">
              <p className="text-[17px] font-semibold text-center text-blue-900 tracking-tight flex items-center justify-center gap-2">
                <Icon.Users size={20} weight="bold" />
                Informações da Segunda Fonte
              </p>
            </div>

            {/* Conteúdo principal */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Identificação</DataList.Label>
                  <DataList.Value className="text-sm font-semibold text-blue-700">
                    <Tooltip content={`Avaliado Segundas Fontes - ${index + 1}`}>
                      <Box className="flex items-center gap-1">
                        <Icon.UserCircle size={16} className='inline-block mr-2' />
                        ASF - {index + 1}
                      </Box>
                    </Tooltip>
                  </DataList.Value>
                </div>

                <div className="space-y-1">
                  <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Nome</DataList.Label>
                  <DataList.Value className="text-sm font-semibold text-gray-900">
                    {getFirstAndLastName(secondSource.personalData.fullName)}
                  </DataList.Value>
                </div>

                <div className="space-y-1">
                  <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pontuação</DataList.Label>
                  <DataList.Value className="text-sm font-semibold text-blue-700">
                    <Badge
                      size="1"
                      variant="soft"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {secondSource.adultForm?.totalPunctuation || 0}
                    </Badge>
                  </DataList.Value>
                </div>

                <div className="space-y-1">
                  <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Idade</DataList.Label>
                  <DataList.Value className="text-sm font-semibold text-gray-900">
                    {secondSource.personalData?.birthDate
                      ? handleAge(secondSource.personalData.birthDate)
                      : 'Não informada'
                    }
                  </DataList.Value>
                </div>
              </div>

              {/* Conteúdo expandido */}
              {secondSource?._id && expandedSS[secondSource._id] && (
                <div className="mt-4 pt-4 border-t border-gray-200/50 animate-in fade-in-50 duration-300">
                  <div className="bg-gradient-to-r from-cyan-500/5 to-sky-500/5 rounded-xl p-4 -mx-2">
                    <p className="text-[15px] font-semibold text-center text-cyan-900 mb-3 flex items-center justify-center gap-2">
                      <Icon.Info size={18} weight="bold" />
                      Informações Adicionais
                    </p>

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
                  </div>
                </div>
              )}
            </div>

            {/* Footer com botão expandir/recolher */}
            <div className="p-4 pt-3 border-t border-gray-200/60 rounded-b-xl">
              <Flex justify="center">
                <Button
                  size="Small"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-700 font-medium transition-all hover:bg-blue-500/20 hover:scale-105"
                  onClick={() =>
                    setExpandedSS((prev) => ({
                      ...prev,
                      [String(secondSource._id)]: !prev[String(secondSource._id)],
                    }))
                  }
                  title={
                    secondSource._id && expandedSS[secondSource._id]
                      ? "Ver menos"
                      : "Ver mais"
                  }
                  color="violet"
                >

                  <Icon.CaretDown
                    size={14}
                    className={`transition-all duration-500 ${secondSource._id && expandedSS[secondSource._id] ? "rotate-180" : ""
                      }`}
                  />
                </Button>
              </Flex>
            </div>
          </DataList.Item>
        ))}
    </DataList.Root>
  );
};

export default SecondSourcesList;