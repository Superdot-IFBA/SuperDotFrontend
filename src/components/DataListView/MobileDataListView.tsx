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
  currentPage,
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
  isCheckedAll,
  handleCheckAll,
  handleCheckboxChange,
  selectedItems,


}) => {
  return (
    <div className="mobo">
      <DataList.Root orientation="vertical" className="!font-roboto ">
        {loading ? (
          <SkeletonDataList itens={3} titles={1} columns={3} actionButton={true} />
        ) : (
          (() => {
            const filteredParticipants = sample.participants
              ?.slice(startIndex, endIndex)
              .filter(filterParticipants);

            return filteredParticipants?.map((participant, idx) => {
              const isExpanded = participant._id ? expandedParticipants[participant._id] : false;
              const isSelected = isChecked[startIndex + idx];
              const participantId = String(participant._id) ?? '';

              return (
                <DataList.Item
                  key={startIndex + idx}
                  className={`w-full rounded-2xl mb-4 transition-all duration-500 ease-out !gap-0 transform
                  bg-gradient-to-br from-white to-violet-50 shadow-sm hover:shadow-md border border-violet-200/80 backdrop-blur-sm 
                  ${isSelected ? 'ring-2 ring-primary ring-opacity-50 bg-violet-500 shadow-md scale-[0.998]' : ''} 
                    ${isExpanded ? 'max-h-[1250px] opacity-100' : 'max-h-[280px] opacity-100'}
                  hover:border-violet-300/60`}
                >
                  <div className={`bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-xl px-4 py-3 border-b border-violet-100/50 ${isSelected ? '  bg-violet-200' : ''}`}>
                    <p className="text-[17px] font-semibold text-center text-violet-900 tracking-tight">
                      <Icon.User size={20} weight="bold" className="inline-block mr-2" /> Informações do participante
                    </p>
                  </div>
                  <div className={`${isSelected ? '  bg-violet-50' : ''} pb-4 px-4`}>
                    <div className={`grid grid-cols-2 gap-3 mt-4 `}>
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
                        <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">2ªs Fontes</DataList.Label>
                        <DataList.Value className="text-sm font-semibold text-violet-700">
                          {participant.secondSources?.length}
                        </DataList.Value>
                      </div>
                    </div>
                    <div className={`
                      transition-all duration-500 ease-in-out overflow-hidden
                      ${isExpanded
                        ? 'max-h-[1000px] opacity-100 translate-y-0'
                        : 'max-h-0 opacity-0 -translate-y-4'
                      }
                    `}>
                      {isExpanded && (
                        <>
                          <div className="mt-6 space-y-4">
                            <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-xl p-4 -mx-2">
                              <p className="text-[15px] font-semibold text-center text-violet-900 mb-3">
                                <Icon.Certificate size={20} weight="bold" className="inline-block mr-2" /> Indicadores de AH/SD
                              </p>

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
                                      Salvar
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
                            </div>

                            <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl p-4 -mx-2">
                              <p className="text-[15px] font-semibold text-center text-blue-900 mb-4">
                                <Icon.BookBookmark size={20} weight="bold" className="inline-block mr-2" /> Áreas do Saber
                              </p>

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
                                            Salvar
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
                                            Salvar
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
                            </div>

                            <div className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-xl p-4 -mx-2">
                              <Flex gap="2" direction="row" align="center" justify="center" className="mb-4">
                                <p className="text-[15px] font-semibold text-center text-amber-900">
                                  <Icon.RocketLaunch size={20} weight="bold" className="inline-block mr-2" /> Ações</p>
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
                                    <Dialog.Title align="center" mb="5" className="text-white bg-gradient-to-br from-violet-600 via-purple-500 to-primary py-6 w-full flex justify-center items-center">
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
                                    <Flex gap="3" mt="5" justify="end" className=''>
                                      <Dialog.Close className='absolute top-2 right-2'>
                                        <Button
                                          title=""
                                          color="red"
                                          className=" shadow-sm"
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
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`p-4 pt-3 border-t border-gray-200/60 ${isSelected ? '  bg-violet-200' : ''}  rounded-b-xl`}>
                    <Flex direction="row" justify="between" align="center" className="mb-2">
                      <Flex direction="row" gap="2" align="center">
                        <Checkbox
                          id={`participanteSelect-${startIndex + idx}`}
                          className="hover:cursor-pointer transition-all hover:scale-105"
                          checked={isSelected ?? false}
                          onCheckedChange={() => handleChange(startIndex + idx)}
                          color="violet"
                        />
                        <label htmlFor={`participanteSelect-${startIndex + idx}`} className="text-[13px] font-medium text-gray-700">
                          {isSelected ? "Selecionado" : "Selecionar participante"}
                        </label>
                      </Flex>

                      <button
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-700 text-[13px] font-medium transition-all hover:bg-violet-500/20 hover:scale-105 active:scale-95"
                        onClick={(e) => {
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
                        }}

                      >
                        {isExpanded ? "Ver menos" : "Ver mais"}
                        <Icon.CaretDown
                          size={14}
                          className={`transition-all duration-500 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </Flex>
                  </div>
                </DataList.Item>
              );
            });
          })()
        )}
      </DataList.Root>
    </div>
  );
};

export default MobileDataListView;