import React from 'react';
import {
  DataList,
  Separator,
  Flex,
  Checkbox,
  Text,
  Dialog,
  TextField,
  Badge,
} from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from '../../interfaces/participant.interface';
import { ISample } from '../../interfaces/sample.interface';
import ActionButtonExplain from '../ActionButtonExplain/ActionButtonExplain';
import SkeletonDataList from '../Skeletons/SkeletonDataList';
import { Button } from '../Button/Button';
import Modal from '../Modal/Modal';
import Select from 'react-select';
import EmptyState from '../EmptyState/EmptyState';

// Importando os componentes genéricos
import MobileCard from './MobileCard/MobileCard';
import ExpandableSection from './MobileCard/ExpandableSection';
import InfoGrid from './MobileCard/InfoGrid';
import SectionCard from './MobileCard/SectionCard';

interface MobileDataListViewProps {
  sample: ISample;
  loading: boolean;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  isChecked: boolean[];
  openModalIAH: boolean;
  setOpenModalIAH: (open: boolean) => void;
  openModalKAG: boolean;
  setOpenModalKAG: (open: boolean) => void;
  openModalKAE: boolean;
  setOpenModalKAE: (open: boolean) => void;
  selectedOption: string | null;
  handleChange: (index: number) => void;
  filterParticipants: (participant: IParticipant) => boolean;
  expandedParticipants: Record<string, boolean>;
  setExpandedParticipants: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  getFirstAndLastName: (fullName: string) => string;
  getFormattedBirthDate: (birthDate: Date | string | undefined) => string;
  handleCompareSource: (participant: IParticipant) => void;
  handleShowIAH: (participantId: string) => void;
  handleShowKAG: (participantId: string) => void;
  handleShowKAE: (participantId: string) => void;
  handleSaveGift: () => void;
  handleChangeKA: (selectedOptions: any) => void;
  handleSubmitKA: (type: string) => Promise<void>;
  selectItensKA: { label: string; value: string }[];
  isSavingItem: boolean;
  isCheckedAll: boolean;
  handleCheckAll: () => void;
  handleCheckboxChange: (option: string | null) => void;
  selectedItems: { value: string }[];
  handleEvaluateAutobiography: (participant: IParticipant, sample: ISample) => void;
}

const MobileDataListView: React.FC<MobileDataListViewProps> = ({
  sample,
  loading,
  startIndex,
  endIndex,
  isChecked,
  handleChange,
  filterParticipants,
  expandedParticipants,
  setExpandedParticipants,
  getFirstAndLastName,
  handleCompareSource,
  handleEvaluateAutobiography,
  getFormattedBirthDate,
  handleShowIAH,
  handleShowKAG,
  handleShowKAE,
  handleSaveGift,
  handleChangeKA,
  handleSubmitKA,
  openModalIAH,
  setOpenModalIAH,
  openModalKAG,
  setOpenModalKAG,
  openModalKAE,
  setOpenModalKAE,
  selectedOption,
  selectItensKA,
  isSavingItem,
  handleCheckboxChange,
}) => {
  if (loading) {
    return (
      <div className="mobo">
        <DataList.Root orientation="vertical" className="!font-roboto">
          <SkeletonDataList itens={3} titles={1} columns={3} actionButton={true} />
        </DataList.Root>
      </div>
    );
  }

  const filteredParticipants = sample.participants
    ?.slice(startIndex, endIndex)
    .filter(filterParticipants);

  return (
    <div className="mobo">
      <DataList.Root orientation="vertical" className="!font-roboto">
        {filteredParticipants?.map((participant, idx) => {
          const isExpanded = participant._id ? expandedParticipants[participant._id] : false;
          const isSelected = isChecked[startIndex + idx];
          const participantId = String(participant._id) ?? '';

          const handleToggleExpand = (e: React.MouseEvent) => {
            e.stopPropagation();
            const target = e.currentTarget;

            setExpandedParticipants(prev => ({
              ...prev,
              [participantId]: !prev[participantId],
            }));

            setTimeout(() => {
              if (!isExpanded) {
                target.closest('[data-list-item]')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                });
              }
            }, 100);
          };

          return (
            <MobileCard
              key={startIndex + idx}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onSelect={() => handleChange(startIndex + idx)}
              onToggleExpand={handleToggleExpand}
              selectedLabel="Selecionado"
              unselectedLabel="Selecionar participante"
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
                    label: '2ªs Fontes',
                    value: participant.secondSources?.length,
                    className: 'text-violet-700'
                  }
                ]}
                columns={2}
              />

              <ExpandableSection isExpanded={isExpanded}>
                <div className="mt-6 space-y-4">
                  <SectionCard
                    title="Indicadores de AH/SD"
                    icon={<Icon.Certificate size={20} weight="bold" className="inline-block mr-2" />}
                    gradient="bg-gradient-to-r from-violet-500/5 to-purple-500/5"
                    titleColor="text-violet-900"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Questionário</p>
                        <Badge
                          size="2"
                          color={`${participant.adultForm?.giftednessIndicators ? 'green' : 'red'}`}
                          className={`w-full justify-center border ${participant.adultForm?.giftednessIndicators ? '!border-green-500' : '!border-red-500'}`}
                        >
                          {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                        </Badge>
                      </div>

                      <div className="text-center p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Pesquisador</p>
                        <Badge
                          size="2"
                          color={`${participant.giftdnessIndicatorsByResearcher ? 'green' : 'red'}`}
                          className={`w-full justify-center border ${participant.giftdnessIndicatorsByResearcher ? '!border-green-500' : '!border-red-500'}`}
                        >
                          {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                        </Badge>
                      </div>
                    </div>

                    <DataList.Value className="justify-center mt-3">
                      <Modal
                        open={openModalIAH}
                        setOpen={setOpenModalIAH}
                        title="Indicadores de AH/SD"
                        accessibleDescription="Identifique se a pessoa apresenta características de Altas Habilidades/Superdotação (AH/SD) com base nos critérios estabelecidos."
                      >
                        <Flex direction="column" gap="4" className="py-2">
                          <Flex align="center" gap="3" className="text-[16px] p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <Checkbox
                              checked={selectedOption === "sim"}
                              onCheckedChange={() => handleCheckboxChange("sim")}
                              className="hover:cursor-pointer size-5"
                            />
                            <span className="font-medium">Sim</span>
                          </Flex>
                          <Flex align="center" gap="3" className="text-[16px] p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <Checkbox
                              checked={selectedOption === "nao"}
                              onCheckedChange={() => handleCheckboxChange("nao")}
                              className="hover:cursor-pointer size-5"
                            />
                            <span className="font-medium">Não</span>
                          </Flex>
                        </Flex>
                        <Flex align="center" justify="center" className="gap-4 mt-4">
                          <Button
                            loading={isSavingItem}
                            title="Salvar alterações"
                            color="green"
                            size="Medium"
                            className="min-w-[140px] shadow-sm"
                            onClick={handleSaveGift}
                            disabled={isSavingItem}
                          >
                            <Icon.FloppyDisk size={18} weight="bold" />
                          </Button>
                        </Flex>
                      </Modal>
                      <Button
                        onClick={() => participant._id && handleShowIAH(participant._id)}
                        title="Editar Indicador de AH/SD"
                        color="violet"
                        className="w-full mt-2 shadow-sm hover:shadow transition-all"
                        size="Small"
                      >
                        <Icon.Pencil size={15} />
                      </Button>
                    </DataList.Value>
                  </SectionCard>

                  <SectionCard
                    title="Áreas do Saber"
                    icon={<Icon.BookBookmark size={20} weight="bold" className="inline-block mr-2" />}
                    gradient="bg-gradient-to-r from-blue-500/5 to-cyan-500/5"
                    titleColor="text-blue-900"
                  >
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm">
                        <DataList.Label className="text-sm font-semibold text-gray-800 mb-2">Indicadas pelo Questionário</DataList.Label>
                        <DataList.Value className="gap-1 flex-wrap min-h-[32px]">
                          {participant.adultForm?.knowledgeAreas?.map((area, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full border border-blue-200 mb-1 mr-1"
                            >
                              {area}
                            </span>
                          ))}
                        </DataList.Value>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-green-100 shadow-sm">
                        <DataList.Label className="text-sm font-semibold text-gray-800 mb-2">Indicadas pelo Pesquisador</DataList.Label>

                        <div className="space-y-3">
                          <div>
                            <DataList.Label className="text-xs font-medium text-gray-600 mb-2">Áreas Gerais</DataList.Label>
                            <DataList.Value className="flex-wrap gap-1 min-h-[32px]">
                              {participant.knowledgeAreasIndicatedByResearcher?.general?.map((area, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-green-50 text-green-800 text-xs font-medium rounded-full border border-green-200 mb-1 mr-1"
                                >
                                  {area}
                                </span>
                              ))}
                            </DataList.Value>
                            <Modal
                              open={openModalKAG}
                              setOpen={setOpenModalKAG}
                              title="Selecione as Áreas Gerais"
                              accessibleDescription="Identifique as áreas gerais de conhecimento para compreender habilidades e talentos amplos do participante."
                            >
                              <div className="py-3">
                                <Select
                                  isMulti
                                  aria-hidden="false"
                                  options={selectItensKA.map((item) => ({
                                    value: item.value,
                                    label: item.label,
                                  }))}
                                  className="text-black"
                                  placeholder="Selecione uma ou várias opções"
                                  menuPosition="fixed"
                                  onChange={handleChangeKA}
                                />
                              </div>
                              <Flex align="center" justify="center" className="gap-4 mt-2">
                                <Button
                                  loading={isSavingItem}
                                  title="Salvar alterações"
                                  color="green"
                                  size="Medium"
                                  className="min-w-[140px] shadow-sm"
                                  onClick={() => handleSubmitKA("KAG")}
                                  disabled={isSavingItem}
                                >
                                  <Icon.FloppyDisk size={18} weight="bold" />
                                </Button>
                              </Flex>
                            </Modal>
                            <Button
                              onClick={() => participant._id && handleShowKAG(participant._id)}
                              title="Editar Áreas Gerais"
                              color="emerald"
                              className="w-full mt-2 shadow-sm hover:shadow transition-all"
                              size="Small"
                            >
                              <Icon.Pencil size={15} />
                            </Button>
                          </div>

                          <Separator size="4" className="bg-gray-200" />

                          <div>
                            <DataList.Label className="text-xs font-medium text-gray-600 mb-2">Áreas Específicas</DataList.Label>
                            <DataList.Value className="flex-wrap gap-1 min-h-[32px]">
                              {participant.knowledgeAreasIndicatedByResearcher?.specific?.map((area, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-800 text-xs font-medium rounded-full border border-orange-200 mb-1 mr-1"
                                >
                                  {area}
                                </span>
                              ))}
                            </DataList.Value>
                            <Modal
                              open={openModalKAE}
                              setOpen={setOpenModalKAE}
                              title="Selecione as Áreas Específicas"
                              accessibleDescription="Identifique talentos excepcionais em campos específicos para orientar intervenções educacionais."
                            >
                              <div className="py-3">
                                <Select
                                  isMulti
                                  options={selectItensKA.map((item) => ({
                                    value: item.value,
                                    label: item.label,
                                  }))}
                                  className="text-black"
                                  placeholder="Selecione uma ou várias opções"
                                  menuPosition="fixed"
                                  onChange={handleChangeKA}
                                />
                              </div>
                              <Flex align="center" justify="center" className="gap-4 mt-2">
                                <Button
                                  loading={isSavingItem}
                                  title="Salvar alterações"
                                  color="green"
                                  size="Medium"
                                  className="min-w-[140px] shadow-sm"
                                  onClick={() => handleSubmitKA("KAE")}
                                  disabled={isSavingItem}
                                >
                                  <Icon.FloppyDisk size={18} weight="bold" />
                                </Button>
                              </Flex>
                            </Modal>
                            <Button
                              onClick={() => participant._id && handleShowKAE(participant._id)}
                              title="Editar Áreas Específicas"
                              color="orange"
                              className="w-full mt-2 shadow-sm hover:shadow transition-all"
                              size="Small"
                            >
                              <Icon.Pencil size={15} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Ações"
                    icon={<Icon.RocketLaunch size={20} weight="bold" className="inline-block mr-2" />}
                    gradient="bg-gradient-to-r from-amber-500/5 to-yellow-500/5"
                    titleColor="text-amber-900"
                  >
                    <Flex gap="2" direction="row" align="center" justify="center" className="mb-4">
                      <ActionButtonExplain />
                    </Flex>

                    <Flex gap="3" direction="column" align="center">
                      <Dialog.Root>
                        <Dialog.Trigger className="w-full">
                          <Button
                            title={`Informações Completas`}
                            color="blue"
                            className="w-full shadow-sm hover:shadow transition-all"
                            size="Small"
                          >
                            <Icon.IdentificationCard size={18} />
                          </Button>
                        </Dialog.Trigger>
                        <Dialog.Content style={{ maxWidth: 450, borderRadius: 16 }} className='!p-0'>
                          <Dialog.Title align="center" mb="5" className="text-white bg-gradient-to-br from-violet-600 via-purple-500 to-primary py-6 max-sm:py-10 !text-[18px] w-full flex justify-center items-center">
                            Informações Gerais do Participante
                          </Dialog.Title>
                          <Flex direction="column" gap="3" className='p-4'>
                            {[
                              { label: "Nome Completo", value: participant.personalData.fullName },
                              { label: "Data de Nascimento", value: getFormattedBirthDate(participant.personalData.birthDate) },
                              { label: "Gênero", value: participant.personalData.gender },
                              { label: "Telefone", value: participant.personalData.phone },
                              { label: "E-mail", value: participant.personalData.email },
                              { label: "Estado Civil", value: participant.personalData.maritalStatus },
                              { label: "Trabalho", value: participant.personalData.job }
                            ].map((field, index) => (
                              <div key={index} className="space-y-1">
                                <Text as="label" size="2" className="text-gray-700 font-semibold">
                                  {field.label}
                                </Text>
                                <TextField.Root
                                  defaultValue={field.value}
                                  disabled
                                  className="bg-gray-50 border-gray-200"
                                />
                              </div>
                            ))}
                          </Flex>
                          <Flex gap="3" mt="5" justify="end">
                            <Dialog.Close className='absolute top-2 right-2'>
                              <Button
                                title=""
                                color="red"
                                className="shadow-sm"
                                size="Extra Small"
                              >
                                <Icon.X size={18} weight="bold" />
                              </Button>
                            </Dialog.Close>
                          </Flex>
                        </Dialog.Content>
                      </Dialog.Root>

                      <Dialog.Root>
                        <Dialog.Trigger className="w-full">
                          <Button
                            title={`Comparar 2ªs Fontes`}
                            color="violet"
                            className="w-full shadow-sm hover:shadow transition-all"
                            size="Small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompareSource(participant);
                            }}
                          >
                            <Icon.ClipboardText size={18} />
                          </Button>
                        </Dialog.Trigger>
                        <Dialog.Content style={{ maxWidth: 450, borderRadius: 16 }} className='!p-0'>
                          <EmptyState
                            icon={<Icon.Users size={40} />}
                            title="Aguardando resposta da 2ª fonte."
                            description="A comparação só será exibida após a 2ª fonte concluir o questionário. Assim que a resposta for registrada, você poderá visualizar as diferenças e semelhanças entre as percepções."
                          />
                          <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close className="absolute top-2 right-2">
                              <Button
                                className="hover:cursor-pointer"
                                aria-label="Close modal"
                                title=""
                                color="red"
                                size="Small"
                              >
                                <Icon.X size={20} weight="bold" />
                              </Button>
                            </Dialog.Close>
                          </Flex>
                        </Dialog.Content>
                      </Dialog.Root>

                      <Button
                        title={`Autobiografia`}
                        color="amber"
                        className="w-full shadow-sm hover:shadow transition-all"
                        size="Small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEvaluateAutobiography(participant, sample);
                        }}
                      >
                        <Icon.IdentificationBadge size={18} />
                      </Button>
                    </Flex>
                  </SectionCard>
                </div>
              </ExpandableSection>
            </MobileCard>
          );
        })}
      </DataList.Root>
    </div>
  );
};

export default MobileDataListView;