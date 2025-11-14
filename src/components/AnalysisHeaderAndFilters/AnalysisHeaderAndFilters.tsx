import React, { useMemo } from 'react';
import { Badge, Box, Flex, Strong } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import * as Icon from '@phosphor-icons/react';
import { InputField } from '../InputField/InputField';
import { SelectField } from '../SelectField/SelectField';
import { Button } from '../Button/Button';
import Modal from '../Modal/Modal';
import EmptyState from '../EmptyState/EmptyState';
import InstrumentResponsesTable from '../InstrumentResponsesTable/InstrumentResponsesTable';
import WordCloudGenerator from '../WordCloud/WordCloudGenerator';
import * as Switch from '@radix-ui/react-switch';

interface AnalysisHeaderAndFiltersProps {
  sample: any;
  isDesktop: boolean;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showFilters: boolean;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  register: any;
  clearFilters: () => void;
  selectItensKA: any[];
  selectItensPM: any[];
  openModalCompare: boolean;
  setOpenModalCompare: (open: boolean) => void;
  handleCompareSelected: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  handleShowPunctuation: () => void;
  openModalCloud: boolean;
  setOpenModalCloud: (open: boolean) => void;
  CloudWord: any[];
  isCheckedWC: boolean[];
  handleChangeWC: (index: number) => void;
  cloudWords: () => void;
  showNewComponent: boolean;
  selectedParticipants: any[];
  handleShowCloud: () => void;
  getRangeForPercentage: (percentage: number) => any;
}

const AnalysisHeaderAndFilters: React.FC<AnalysisHeaderAndFiltersProps> = ({
  sample,
  isDesktop,
  showSearch,
  setShowSearch,
  showFilters,
  handleSubmit,
  onSubmit,
  register,
  clearFilters,
  selectItensKA,
  selectItensPM,
  openModalCompare,
  setOpenModalCompare,
  handleCompareSelected,
  openModal,
  setOpenModal,
  handleShowPunctuation,
  openModalCloud,
  setOpenModalCloud,
  CloudWord,
  isCheckedWC,
  handleChangeWC,
  cloudWords,
  showNewComponent,
  selectedParticipants,
  handleShowCloud,
  getRangeForPercentage
}) => {

  const knowledgeAreaOptions = useMemo(() =>
    selectItensKA.map(option => (
      <option key={option.label} value={option.label}>
        {option.label}
      </option>
    )), [selectItensKA]);

  const punctuationOptions = useMemo(() =>
    selectItensPM.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )), [selectItensPM]);

  const toggleSearch = () => setShowSearch(!showSearch);

  return (
    <>
      <header className="pb-3 pt-4">
        <h2 className="heading-2 font-semibold text-gray-900 text-left max-sm:text-center">
          <Badge size={'3'} color="violet" radius='large'>
            <Icon.ChartBar size={25} weight="duotone" className="text-primary inline-block mr-2" />
            Amostra: {sample.sampleTitle}
          </Badge>
        </h2>
      </header>

      <Box className="hidden lg:grid grid-cols-4 gap-4">
        <Form.Root
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center xl:flex-row xl:justify-between xl:p-0 pt-0 pb-1 gap-2"
        >
          {!isDesktop && (
            <Button
              type="button"
              onClick={toggleSearch}
              className="block xl:hidden"
              title={showSearch ? "Fechar Filtros" : "Mostrar Filtros"}
              color="primary"
              size="Medium"
              classNameTitle="sm:block"
            >
              {showSearch ? <Icon.X size={20} /> : <Icon.Funnel size={20} />}
            </Button>
          )}

          <div
            className={`
              flex flex-col xl:flex-row xl:items-end gap-3 w-full 
              transition-all duration-300 ease-in-out overflow-hidden
              ${showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <Form.Submit asChild className="desktop xl:block">
              <Button
                size="Large"
                className="items-center w-full xl:w-[300px]"
                title="Filtrar"
                color="primary"
              >
                <Icon.Funnel size={20} color="white" />
              </Button>
            </Form.Submit>

            <InputField
              icon={<Icon.MagnifyingGlass />}
              placeholder="Pesquisar pelo nome do avaliado..."
              {...register("searchName")}
            />

            <Flex align="center" className="gap-2 flex-col xl:flex-row w-full xl:w-auto">
              <SelectField
                label="Área do Saber"
                {...register("knowledgeArea")}
                defaultValue="default"
                className="p-2 w-full xl:w-auto truncate"
              >
                <option value='default'>Todas as Áreas</option>
                {knowledgeAreaOptions}
              </SelectField>

              <SelectField
                label="Pontuação Mínima"
                {...register("minPunctuation", { valueAsNumber: true })}
                className="w-full xl:w-auto truncate"
                defaultValue={99}
              >
                <option value={99} className="text-gray-99">Qualquer pontuação</option>
                {punctuationOptions}
              </SelectField>
            </Flex>

            <Form.Submit asChild className="mobo">
              <Button
                size="Large"
                className="items-center w-full xl:w-[300px]"
                title="Filtrar"
                color="primary"
              >
                <Icon.Funnel size={20} color="white" />
              </Button>
            </Form.Submit>

            <Button
              size="Large"
              onClick={clearFilters}
              type="button"
              className="items-center w-full xl:w-[300px]"
              color="primary"
              title="Limpar Filtros"
            />
          </div>
        </Form.Root>
      </Box>

      <Flex
        direction={isDesktop ? "row" : "column"}
        justify="center"
        align="center"
        gap="3"
        className="p-6  mx-auto w-full max-w-6xl"
      >
        <Modal
          open={openModalCompare}
          setOpen={setOpenModalCompare}
          title="Comparação de Participantes"
          accessibleDescription=""
        >
          <EmptyState
            icon={<Icon.UsersThree size={48} weight="bold" className="text-violet-600" />}
            title="Seleção necessária"
            description="Para comparar as respostas entre os avaliados, você deve selecionar pelo menos um participante."
          />
        </Modal>

        <Button
          size="Medium"
          title="Comparar Selecionados"
          color="violet"
          onClick={handleCompareSelected}
          className="shadow-sm hover:shadow transition-all xl:min-w-[200px] w-full"
        >
          <Icon.ChartBar size={20} weight="bold" />
        </Button>

        <Modal
          open={openModal}
          setOpen={setOpenModal}
          title="Pontuação do Questionário"
          accessibleDescription="Visualize as pontuações detalhadas do questionário"
        >
          <InstrumentResponsesTable />
        </Modal>

        <Button
          size="Medium"
          onClick={handleShowPunctuation}
          title="Pontuação do Questionário"
          color="blue"
          className="shadow-sm hover:shadow transition-all xl:min-w-[200px] w-full "
        >
          <Icon.Trophy size={20} weight="bold" />
        </Button>

        <Modal
          open={openModalCloud}
          setOpen={setOpenModalCloud}
          title="Gerar Nuvem de Palavras"
          accessibleDescription="Selecione as fontes de texto para gerar a nuvem de palavras"
        >
          <Flex direction="column" gap="4" className="py-2">

            <Flex direction="column" gap="3">
              {CloudWord.map((itens, index) => (
                <label key={index} className="group cursor-pointer">
                  <Flex
                    gap="3"
                    align="center"
                    className={`
                p-4 rounded-xl border-2 transition-all duration-200
                ${isCheckedWC[index]
                        ? 'bg-violet-50 border-violet-300 shadow-sm'
                        : 'bg-white border-gray-200 group-hover:border-violet-200 group-hover:bg-violet-50/30'
                      }
              `}
                  >
                    <Switch.Root
                      className="w-12 h-6 rounded-full relative data-[state=checked]:bg-violet-600 bg-gray-300 transition-colors duration-200 shadow-inner"
                      checked={isCheckedWC[index]}
                      onCheckedChange={() => handleChangeWC(index)}
                      value={itens.value}
                    >
                      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[26px] data-[state=checked]:bg-white" />
                    </Switch.Root>
                    <p className="text-gray-700 font-medium">
                      {itens.title}
                    </p>
                  </Flex>
                </label>
              ))}
            </Flex>

            <Flex justify="end" className="mt-6 pt-4 border-t border-gray-200/50">
              <Button
                onClick={cloudWords}
                className={`${showNewComponent ? 'hidden' : ''} shadow-sm hover:shadow transition-all`}
                color="violet"
                title="Gerar Nuvem"
                size="Medium"
              >
                <Icon.Cloud size={18} />
              </Button>
            </Flex>

            {showNewComponent && (
              <div className="space-y-6 mt-6">
                {CloudWord.map((item, index) => {
                  if (isCheckedWC[index]) {
                    switch (item.value) {
                      case "RES-SUB":
                        return (
                          <Box key={index} className="xl:w-full m-auto">
                            <p className="text-lg font-bold text-center mb-4">
                              Respostas Subjetivas / Quantidade de Avaliados: {selectedParticipants.length}
                            </p>
                            <WordCloudGenerator
                              textBio={selectedParticipants.map((participant) => {
                                const combinedSubjective = [
                                  ...Array.from({ length: 8 }, (_, i) =>
                                    participant.adultForm?.answersByGroup?.[0]?.questions[i]?.answer || []
                                  ).flat(),
                                  ...Array.from({ length: 5 }, (_, i) =>
                                    participant.adultForm?.answersByGroup?.[5]?.questions[i]?.answer || []
                                  ).flat(),
                                ];
                                return combinedSubjective.join(', ') || '';
                              })}
                            />
                          </Box>
                        );
                      case "AUT-BIO":
                        return (
                          <Box key={index} className="xl:w-full m-auto">
                            <p className="text-lg font-bold text-center mb-4">
                              Autobiografia / Quantidade de Avaliados: {selectedParticipants.length}
                            </p>
                            <WordCloudGenerator
                              textBio={selectedParticipants.map((participant) => participant.autobiography?.text || '')}
                            />
                          </Box>
                        );
                      case "ARE-SAB":
                        return (
                          <Box key={index} className="xl:w-full m-auto">
                            <p className="text-lg font-bold text-center mb-4">
                              Áreas do Saber / Quantidade de Avaliados: {selectedParticipants.length}
                            </p>
                            <WordCloudGenerator
                              textBio={selectedParticipants.map((participant) => {
                                const combinedAreas = [
                                  ...(participant.knowledgeAreasIndicatedByResearcher?.general || []),
                                  ...(participant.knowledgeAreasIndicatedByResearcher?.specific || []),
                                  ...(participant.adultForm?.knowledgeAreas || []),
                                ];
                                return combinedAreas.join(', ') || '';
                              })}
                            />
                          </Box>
                        );
                      default:
                        return (
                          <Box key={index}>
                            <p className="text-lg font-bold text-center mb-4">
                              Valor não reconhecido: {item.title}
                            </p>
                          </Box>
                        );
                    }
                  }
                  return null;
                })}
              </div>
            )}
          </Flex>
        </Modal>

        <Button
          size="Medium"
          onClick={handleShowCloud}
          title="Gerar Nuvem de Palavras"
          color="emerald"
          className="shadow-sm hover:shadow transition-all xl:min-w-[200px] w-full"
        >
          <Icon.Cloud size={20} weight="bold" />
        </Button>
      </Flex>
    </>
  );
};

export default React.memo(AnalysisHeaderAndFilters);