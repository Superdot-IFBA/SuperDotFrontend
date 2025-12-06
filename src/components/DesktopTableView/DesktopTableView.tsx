import React from 'react';
import {
  Table,
  Checkbox,
  Flex,
  Text,
  IconButton,
  Tooltip,
  HoverCard,
  Dialog,
  Box,
  TextField,
  AlertDialog,
  Strong,
  Badge
} from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from "../../interfaces/participant.interface";
import { ISample } from "../../interfaces/sample.interface";
import ActionButtonExplain from '../../components/ActionButtonExplain/ActionButtonExplain';
import SkeletonTableBody from '../../components/Skeletons/SkeletonTableBody';
import Modal from '../../components/Modal/Modal';
import { Button } from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import Select from 'react-select';

interface DesktopTableViewProps {
  sample: ISample;
  loading: boolean;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  isChecked: boolean[];
  isCheckedAll: boolean;
  handleCheckAll: () => void;
  handleChange: (index: number) => void;
  filterParticipants: (participant: IParticipant) => boolean;
  openModalIAH: boolean;
  setOpenModalIAH: (open: boolean) => void;
  openModalKAG: boolean;
  setOpenModalKAG: (open: boolean) => void;
  openModalKAE: boolean;
  setOpenModalKAE: (open: boolean) => void;
  selectedOption: string | null;
  handleCheckboxChange: (option: string | null) => void;
  isSavingItem: boolean;
  handleSaveGift: () => void;
  handleChangeKA: (selectedOptions: any) => void;
  handleSubmitKA: (type: string) => Promise<void>;
  selectedItems: { value: string }[];
  getFirstAndLastName: (fullName: string) => string;
  getFormattedBirthDate: (birthDate: Date | string | undefined) => string;
  handleCompareSource: (participant: IParticipant) => void;
  handleEvaluateAutobiography: (participant: IParticipant, sample: ISample) => void;
  handleShowIAH: (participantId: string) => void;
  handleShowKAG: (participantId: string) => void;
  handleShowKAE: (participantId: string) => void;
  selectItensKA: { label: string; value: string }[];
}

const DesktopTableView: React.FC<DesktopTableViewProps> = ({
  sample,
  loading,
  currentPage,
  startIndex,
  endIndex,
  isChecked,
  isCheckedAll,
  handleCheckAll,
  handleChange,
  filterParticipants,
  openModalIAH,
  setOpenModalIAH,
  openModalKAG,
  setOpenModalKAG,
  openModalKAE,
  setOpenModalKAE,
  selectedOption,
  handleCheckboxChange,
  isSavingItem,
  handleSaveGift,
  handleChangeKA,
  handleSubmitKA,
  selectedItems,
  getFirstAndLastName,
  getFormattedBirthDate,
  handleCompareSource,
  handleEvaluateAutobiography,
  handleShowIAH,
  handleShowKAG,
  handleShowKAE,
  selectItensKA
}) => {
  return (
    <Box className="w-full !overflow-x-auto rounded-2xl shadow-sm border border-gray-200/50 bg-white">
      <Table.Root variant="ghost" className="desktop min-w-[1000px]">
        <Table.Header className="text-[14px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
          <Table.Row className="border-b border-violet-200/50">
            <Table.ColumnHeaderCell colSpan={4} className="border-l-0 border-r border-violet-200/30" align="center">
              <Flex align="center" justify="center" gap="2" className="py-3">
                <Icon.User size={18} weight="bold" className="text-violet-600" />
                <Text weight="bold" className="text-violet-900">Informações do participante</Text>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={2} className="border-r border-violet-200/30" align="center">
              <Flex align="center" justify="center" gap="2" className="py-3">
                <Icon.Certificate size={18} weight="bold" className="text-violet-600" />
                <Text weight="bold" className="text-violet-900">Indicadores de AH/SD</Text>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={3} className="border-r border-violet-200/30" align="center">
              <Flex align="center" justify="center" gap="2" className="py-3">
                <Icon.BookBookmark size={18} weight="bold" className="text-violet-600" />
                <Text weight="bold" className="text-violet-900">Áreas do saber</Text>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-r-0" align="center">
              <Flex align="center" justify="center" gap="2" className="py-3">
                <Icon.RocketLaunch size={18} weight="bold" className="text-violet-600" />
                <Text weight="bold" className="text-violet-900">Ações</Text>
                <ActionButtonExplain />
              </Flex>
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Header className="text-[13px] bg-gradient-to-r from-violet-500/5 to-purple-500/5">
          <Table.Row className="border-b border-violet-100/50">
            <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-violet-200/30 py-3">
              <Text size="2" weight="medium" className="text-gray-700">
                {isCheckedAll ? "Desmarcar Todos" : "Selecionar Todos"}
              </Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={3} className="border-r border-violet-200/30"></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={2} className="border-r border-violet-200/30 text-center">
              <Text size="2" weight="medium" className="text-gray-700">De acordo com o:</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={1} className="border-r border-violet-200/30 text-center">
              <Text size="2" weight="medium" className="text-gray-700">Indicadas pelo avaliado</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={2} className="text-center border-r border-violet-200/30">
              <Text size="2" weight="medium" className="text-gray-700">Indicadas pelo pesquisador</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={1}></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Header className="text-[13px] bg-gradient-to-r from-gray-50 to-gray-100/30">
          <Table.Row align="center" className="text-center border-b border-gray-200/50">
            <Table.ColumnHeaderCell colSpan={1} className="py-3">
              <Checkbox
                className="hover:cursor-pointer transition-all hover:scale-110"
                onClick={handleCheckAll}
                color="violet"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3 font-semibold text-gray-800">Nome do Avaliado</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3 font-semibold text-gray-800">Pontuação</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3 font-semibold text-gray-800">Quant. 2ªs fontes</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3 font-semibold text-gray-800">Questionário</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3 font-semibold text-gray-800">Pesquisador</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3 font-semibold text-gray-800">Questionário</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3 font-semibold text-gray-800">Áreas gerais</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3 font-semibold text-gray-800">Áreas específicas</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="border-l border-gray-200/30 py-3">

            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        {loading ? (
          <SkeletonTableBody itens={5} columns={10} />
        ) : (
          <Table.Body className="text-[14px]">
            {(() => {
              const filteredParticipants = sample.participants
                ?.slice(startIndex, endIndex)
                .filter(filterParticipants);

              if (filteredParticipants?.length === 0) {
                return (
                  <Table.Row align="center" className="hover:bg-gray-50/50 transition-colors">
                    <Table.Cell colSpan={10} justify="center" className="py-8">
                      <EmptyState
                        icon={<Icon.MagnifyingGlass size={32} />}
                        title="Nenhum participante encontrado"
                        description="Tente ajustar os filtros para ver mais resultados."
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              }

              return filteredParticipants?.map((participant, idx) => (
                <Table.Row
                  align="center"
                  className={`
                transition-all duration-300 ease-out border-b border-gray-100/50
                ${isChecked[startIndex + idx]
                      ? 'bg-gradient-to-r from-violet-50/80 to-purple-50/60 shadow-inner'
                      : 'hover:bg-gray-50/70'
                    }
              `}
                  key={startIndex + idx}
                >
                  <Table.Cell justify="center" className="py-4">
                    <Checkbox
                      className="hover:cursor-pointer transition-all hover:scale-110"
                      checked={isChecked[startIndex + idx] ?? false}
                      onCheckedChange={() => handleChange(startIndex + idx)}
                      color="violet"
                    />
                  </Table.Cell>

                  <Table.Cell justify="center" className="py-4">
                    <Text weight="medium" className="text-gray-900">
                      {getFirstAndLastName(participant.personalData.fullName)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell justify="center" className="py-4">
                    <Badge
                      size="2"
                      variant='soft'
                      color="blue"
                      className="bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                    >
                      <Icon.Trophy size={16} weight="regular" className="mr-1" />
                      {participant.adultForm?.totalPunctuation}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell justify="center" className="py-4">
                    <Badge
                      size="2"
                      variant="soft"
                      className="bg-violet-50 text-violet-700 border-violet-200 font-semibold"
                    >
                      {participant.secondSources?.length}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell justify="center" className="py-4">
                    <Badge
                      size="2"
                      variant="soft"
                      color={`${participant.adultForm?.giftednessIndicators ? 'green' : 'red'}`}
                      className={`!px-6 justify-center border ${participant.adultForm?.giftednessIndicators ? ' !border-green-500' : '!border-red-500'}`}
                    >
                      {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell justify="center" className="py-4">
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
                          className="min-w-[140px] shadow-sm hover:shadow transition-all"
                          onClick={handleSaveGift}
                          disabled={isSavingItem}
                        >
                          <Icon.FloppyDisk size={18} weight="bold" />
                        </Button>
                      </Flex>
                    </Modal>
                    <Flex direction="row" align="center" justify="center" gap="3">
                      <Badge
                        size="2"
                        color={
                          participant.giftdnessIndicatorsByResearcher === true
                            ? "green"
                            : participant.giftdnessIndicatorsByResearcher === false
                              ? "red"
                              : "gray"
                        }
                        className={`
     justify-center font-semibold border 
    ${participant.giftdnessIndicatorsByResearcher === true
                            ? "border-emerald-500 !px-6"
                            : participant.giftdnessIndicatorsByResearcher === false
                              ? "border-red-500 !px-6"
                              : "border-gray-400 !px-4"
                          }
  `}
                      >
                        {participant.giftdnessIndicatorsByResearcher === true
                          ? "Sim"
                          : participant.giftdnessIndicatorsByResearcher === false
                            ? "Não"
                            : "À definir"}
                      </Badge>
                      <IconButton
                        size="2"
                        variant="soft"
                        color="violet"
                        radius="full"
                        className="transition-all hover:scale-110 hover:shadow-sm"
                        onClick={() => participant._id && handleShowIAH(participant._id)}
                      >
                        <Icon.Pencil size={14} className="cursor-pointer" />
                      </IconButton>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell justify="center" className="py-4">
                    <Flex align="center" direction="row" justify="center" className="gap-2">
                      <Text as="label" size="2" className="text-gray-600 truncate max-w-[120px]">
                        {participant.adultForm?.knowledgeAreas?.[0]}
                        {'...'}
                      </Text>
                      <HoverCard.Root>
                        <HoverCard.Trigger>
                          <IconButton
                            size="1"
                            variant="soft"
                            color="blue"
                            radius="full"
                            className="transition-all hover:scale-110"
                          >
                            <Icon.Eye size={13} className="hover:cursor-pointer" />
                          </IconButton>
                        </HoverCard.Trigger>
                        <HoverCard.Content size="2" className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                          <Flex direction="column" gap="2">
                            <Text weight="medium" size="2" className="text-gray-700 mb-1">Áreas do Questionário:</Text>
                            {participant.adultForm?.knowledgeAreas?.map((area, index) => (
                              <Badge key={index} size="1" variant="soft" color="blue" className="w-fit">
                                {area}
                              </Badge>
                            ))}
                          </Flex>
                        </HoverCard.Content>
                      </HoverCard.Root>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell justify="center">
                    <Modal
                      open={openModalKAG}
                      setOpen={setOpenModalKAG}
                      title="Selecione as Áreas Gerais:"
                      accessibleDescription="Essas áreas gerais são utilizadas para compreender as habilidades e talentos amplos de um indivíduo, com o objetivo de fornecer suporte e orientação adequada, identificando o potencial de desenvolvimento em diversas dimensões da vida pessoal e acadêmica."
                    >
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
                      <Flex align="center" justify="center" className="gap-4 mt-0">
                        <Button
                          loading={isSavingItem}
                          title="Salvar alterações"
                          color="green"
                          size="Medium"
                          className="mt-5"
                          onClick={() => handleSubmitKA("KAG")}
                          disabled={isSavingItem}
                        >
                          <Icon.FloppyDisk size={18} weight="bold" />
                        </Button>
                      </Flex>
                    </Modal>
                    <Flex align="center" direction="row" justify="center" className="gap-2">
                      <Text as="label" className="pr-3">
                        {participant.knowledgeAreasIndicatedByResearcher?.general[0]}
                        {'...'}
                      </Text>
                      <HoverCard.Root>
                        <HoverCard.Trigger>
                          <IconButton size="1" color='grass' variant="soft" radius="full" className="transition-all hover:scale-110">
                            <Icon.Eye size={15} className="hover:cursor-pointer" />
                          </IconButton>
                        </HoverCard.Trigger>
                        <HoverCard.Content size="3">
                          <Flex direction="column" gap="2">
                            <Text weight="medium" size="2" className="text-gray-700 mb-1">Áreas gerais:</Text>
                            {participant.knowledgeAreasIndicatedByResearcher?.general.map((area, index) => (
                              <Badge key={index} size="1" variant="soft" color="grass" className="w-fit">
                                {area}
                                {index !== (participant.knowledgeAreasIndicatedByResearcher?.general.length ?? 0) - 1 && ", "}
                              </Badge>
                            ))}
                          </Flex>
                        </HoverCard.Content>
                      </HoverCard.Root>
                      <Tooltip content="Definir/Editar Áreas Gerais">
                        <IconButton
                          size="1"
                          variant="soft"
                          color='grass'
                          radius="full"
                          className="transition-all hover:scale-110"
                          onClick={() => participant._id && handleShowKAG(participant._id)}
                        >
                          <Icon.Pencil className="cursor-pointer" />
                        </IconButton>
                      </Tooltip>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell justify="center">
                    <Modal
                      open={openModalKAE}
                      setOpen={setOpenModalKAE}
                      title="Selecione as Áreas Específicas:"
                      accessibleDescription="Essas áreas específicas são utilizadas para identificar talentos excepcionais em diferentes campos, ajudando a orientar intervenções educacionais e sociais para promover o desenvolvimento e o reconhecimento de indivíduos com AH/SD."
                    >
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
                      <Flex align="center" justify="center" className="gap-4">
                        <Button
                          loading={isSavingItem}
                          title="Salvar alterações"
                          color="green"
                          size="Medium"
                          className="mt-5"
                          onClick={() => handleSubmitKA("KAE")}
                          disabled={isSavingItem}
                        >
                          <Icon.FloppyDisk size={18} weight="bold" />
                        </Button>
                      </Flex>
                    </Modal>
                    <Flex align="center" direction="row" justify="center" className="gap-2">
                      <Text as="label" className="pr-3">
                        {participant.knowledgeAreasIndicatedByResearcher?.specific[0]}
                        {'...'}
                      </Text>
                      <HoverCard.Root>
                        <HoverCard.Trigger>
                          <IconButton color='orange' size="1" variant="soft" radius="full" className="transition-all hover:scale-110">
                            <Icon.Eye size={15} className="hover:cursor-pointer" />
                          </IconButton>
                        </HoverCard.Trigger>
                        <HoverCard.Content size="3">
                          <Flex direction="column" gap="2">
                            <Text weight="medium" size="2" className="text-gray-700 mb-1">Áreas específicas:</Text>
                            {participant.knowledgeAreasIndicatedByResearcher?.specific.map((area, index) => (
                              <Badge key={index} size="1" variant="soft" color="orange" className="w-fit">
                                {area}
                                {index !== (participant.knowledgeAreasIndicatedByResearcher?.specific.length ?? 0) - 1 && ","}
                              </Badge>
                            ))}
                          </Flex>
                        </HoverCard.Content>
                      </HoverCard.Root>
                      <Tooltip content="Definir/Editar Áreas Específicas">
                        <IconButton
                          color='orange'
                          size="1"
                          variant="soft"
                          radius="full"
                          className="transition-all hover:scale-110"
                          onClick={() => participant._id && handleShowKAE(participant._id)}
                        >
                          <Icon.Pencil className="cursor-pointer" />
                        </IconButton>
                      </Tooltip>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell justify="center" className="py-4">
                    <Flex justify="center" align="center" className="gap-3">
                      <Dialog.Root>
                        <Tooltip content="Visualizar Informações Gerais do Participante">
                          <Dialog.Trigger>
                            <IconButton
                              size="2"
                              color="blue"
                              radius="full"
                              variant="soft"
                              className="!cursor-pointer transition-all hover:scale-110 hover:shadow-sm"
                            >
                              <Icon.IdentificationCard size={18} />
                            </IconButton>
                          </Dialog.Trigger>
                        </Tooltip>

                        <Dialog.Content style={{ maxWidth: 450, borderRadius: 16 }} className='!p-0'>
                          <Dialog.Title align="center" mb="5" className="text-white bg-gradient-to-br from-violet-600 via-purple-500 to-primary py-6 w-full flex justify-center items-center !text-[18px]">
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

                      <AlertDialog.Root>
                        <AlertDialog.Trigger>
                          <Box
                            className="flex gap-3"
                            onClick={() => handleCompareSource(participant)}
                          >
                            <Tooltip content="Comparar as respostas do avaliado com as respostas das 2ª fontes">
                              <IconButton
                                color="violet"
                                radius="full"
                                variant="soft"
                                className="!cursor-pointer transition-all hover:scale-110 hover:shadow-sm"
                              >
                                <Icon.ClipboardText size={20} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </AlertDialog.Trigger>
                        <AlertDialog.Content>
                          <EmptyState
                            icon={<Icon.Users size={40} />}
                            title="Aguardando resposta da 2ª fonte."
                            description="A comparação só será exibida após a 2ª fonte concluir o questionário. Assim que a resposta for registrada, você poderá visualizar as diferenças e semelhanças entre as percepções."
                          />
                          <Flex gap="3" mt="4" justify="end">
                            <AlertDialog.Cancel className="absolute top-2 right-2">
                              <Button
                                className="hover:cursor-pointer"
                                aria-label="Close modal"
                                title=""
                                color="red"
                                size="Small"
                              >
                                <Icon.X size={20} weight="bold" />
                              </Button>
                            </AlertDialog.Cancel>
                          </Flex>
                        </AlertDialog.Content>
                      </AlertDialog.Root>

                      <Box
                        className="flex gap-3"
                        onClick={() => handleEvaluateAutobiography(participant, sample)}
                      >
                        <Tooltip content="Visualizar Autobiografia do participante">
                          <IconButton
                            color="yellow"
                            radius="full"
                            variant="soft"
                            className="!cursor-pointer transition-all hover:scale-110 hover:shadow-sm"
                          >
                            <Icon.IdentificationBadge size={20} />
                          </IconButton>
                        </Tooltip>
                      </Box>

                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ));
            })()}
          </Table.Body>
        )}
      </Table.Root>
    </Box >
  );
};

export default DesktopTableView;