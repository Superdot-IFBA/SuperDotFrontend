import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE } from "../../../api/researchers.api";
import { PageSampleSummary, SampleSummary } from "../../../api/sample.api";
import { SampleStatus } from "../../../utils/consts.utils";
import { Flex, IconButton, Select, Table, Tooltip, Text, DataList, Badge } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import SkeletonTableBody from "../../Skeletons/SkeletonTableBody";
import SkeletonDataList from "../../Skeletons/SkeletonDataList";
import EmptyState from "../../EmptyState/EmptyState";
import { Button } from "../../Button/Button";
import { DateTime } from "luxon";
import TruncatedText from "../../TruncatedText/TruncatedText";


interface SamplesTableProps {
    page?: PageSampleSummary;
    currentPage: number;
    currentStatus: SampleStatus | "";
    setCurrentPage: (newPage: number) => void;
    onClickToReviewSample: (itemId: string) => void;
    onClickToViewSampleReviews: (sample: SampleSummary) => void;
    onClickToViewSampleAttachments: (files: SampleSummary["files"]) => void;
    onChangeFilterStatus: (filter: SampleStatus | "") => void;
    loading: boolean;
}

const SamplesTable = ({
    page,
    currentPage,
    currentStatus,
    setCurrentPage,
    onClickToReviewSample,
    onClickToViewSampleReviews,
    onClickToViewSampleAttachments,
    onChangeFilterStatus,
    loading,
}: SamplesTableProps) => {
    const handleValueChange = (newValue: string) => {
        const status = newValue === 'Todos' ? "" : newValue as SampleStatus;
        onChangeFilterStatus(status);
        setCurrentPage(1);
    };

    const hasData = page?.data && page.data.length > 0;
    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };


    return (
        <>
            <Flex direction="column" className="w-full mb-6 px-4 sm:px-6 lg:px-8">
                <Text className="text-sm text-gray-600">
                    Revise o status, visualize os documentos ou aprove as amostras solicitadas pelos pesquisadores.
                </Text>
            </Flex>

            <Table.Root variant="ghost" className="w-full m-auto desktop rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                <Table.Header className="text-[15px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                    <Table.Row className="border-b border-violet-200/30">
                        <Table.ColumnHeaderCell align="center" colSpan={7} className="border-r border-violet-200/30 py-4 font-semibold text-violet-900">
                            <Flex align="center" justify="center" gap="2">
                                Lista de Solicitações
                            </Flex>
                        </Table.ColumnHeaderCell>

                    </Table.Row>
                </Table.Header>
                <Table.Header className="text-[15px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                    <Table.Row className="border-b border-violet-200/30">
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-violet-200/30 py-4 font-semibold text-violet-900">
                            <Flex align="center" justify="center" gap="2">
                                Pesquisador
                            </Flex>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-violet-200/30 py-4 font-semibold text-violet-900">
                            <Flex align="center" justify="center" gap="2">
                                Amostra
                            </Flex>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-violet-200/30 py-4 font-semibold text-violet-900">
                            <Tooltip content="Certificado de Apresentação de Apreciação Ética">
                                <Flex align="center" justify="center" gap="2" className="cursor-help">
                                    CAAE
                                </Flex>
                            </Tooltip>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-violet-200/30 py-4 font-semibold text-violet-900">
                            <Flex align="center" justify="center" gap="2">
                                Solicitados
                            </Flex>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-violet-200/30 py-4 font-semibold text-violet-900">
                            <Flex align="center" justify="center" gap="2">
                                Autorizados
                            </Flex>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-violet-200/30 py-4 font-semibold text-violet-900">
                            <Flex direction="column" align="center" gap="2">
                                <Flex align="center" gap="2">
                                    <Icon.TrendUp size={16} weight="bold" />
                                    Status
                                </Flex>
                                <Select.Root defaultValue="Todos" size="1" onValueChange={handleValueChange}>
                                    <Select.Trigger className="w-24" />
                                    <Select.Content>
                                        <Select.Group>
                                            <Select.Label>Status</Select.Label>
                                            <Select.Item value="Todos">Todos</Select.Item>
                                            <Select.Item value="Pendente">Pendente</Select.Item>
                                            <Select.Item value="Autorizado">Autorizado</Select.Item>
                                            <Select.Item value="Não Autorizado">Não Autorizado</Select.Item>
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </Flex>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r-0 py-4 font-semibold text-violet-900">
                            <Flex align="center" justify="center" gap="2">
                                <Icon.Gear size={16} weight="bold" />
                                Ações
                            </Flex>
                        </Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                {loading ? (
                    <SkeletonTableBody itens={PAGE_SIZE} columns={7} />
                ) : hasData ? (
                    <Table.Body className="bg-white/50 backdrop-blur-sm">
                        {page.data.map((sample) => (
                            <Table.Row
                                align="center"
                                key={sample.sampleId}
                                className="border-b border-gray-100/30 hover:bg-gray-50/50 transition-colors duration-200"
                            >
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                    <Text weight="medium" className="text-gray-900">
                                        {getFirstAndLastName(sample.researcherName)}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                    <Flex direction="column" className="text-center">
                                        <TruncatedText
                                            text={sample.sampleName}
                                            maxLength={15}
                                            className="text-gray-900 font-medium truncate"
                                        />
                                        <Text size="1" className="text-gray-500 mt-1">
                                            Criada em: {sample.createdAt && DateTime.fromISO(sample.createdAt).toFormat("dd/LL/yyyy - HH:mm")}
                                        </Text>
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                    <TruncatedText
                                        text={sample.cepCode}
                                        maxLength={15}
                                        className="text-gray-900 font-medium truncate"
                                    />
                                </Table.Cell>
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">

                                    {sample.qttParticipantsRequested}
                                </Table.Cell>
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                    {sample.qttParticipantsAuthorized}
                                </Table.Cell>
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                    <Badge
                                        size="1"
                                        variant="solid"
                                        color={`${sample.currentStatus === 'Autorizado' ? 'grass' :
                                            sample.currentStatus === 'Pendente' ? 'amber' : 'red'
                                            }`}
                                        className="w-full justify-center"
                                    >
                                        {sample.currentStatus}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell justify="center" className="py-4">
                                    <Flex justify="center" gap="3">
                                        <Tooltip content="Alterar status">
                                            <IconButton
                                                size="1"
                                                variant="soft"
                                                color="violet"
                                                radius="full"
                                                onClick={() => onClickToReviewSample(sample.sampleId)}
                                                className="!cursor-pointer transition-all hover:scale-110 hover:shadow-sm"
                                            >
                                                <Icon.Pencil size={14} weight="bold" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip content="Visualizar histórico">
                                            <IconButton
                                                size="1"
                                                variant="soft"
                                                color="blue"
                                                radius="full"
                                                onClick={() => onClickToViewSampleReviews(sample)}
                                                className="!cursor-pointer transition-all hover:scale-110 hover:shadow-sm"
                                            >
                                                <Icon.MagnifyingGlass size={14} weight="bold" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip content="Visualizar documentos">
                                            <IconButton
                                                size="1"
                                                variant="soft"
                                                color="amber"
                                                radius="full"
                                                onClick={() => onClickToViewSampleAttachments(sample.files)}
                                                className="!cursor-pointer transition-all hover:scale-110 hover:shadow-sm"
                                            >
                                                <Icon.Clipboard size={14} weight="bold" />
                                            </IconButton>
                                        </Tooltip>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                ) : (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan={7} align="center" className="py-8">
                                <EmptyState
                                    icon={<Icon.FileX weight="thin" size={40} />}
                                    title="Nenhuma amostra encontrada"
                                    description="Não foram encontradas amostras que correspondam aos critérios de busca."
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                )}
            </Table.Root>

            <div className="w-full mobo">
                <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-2xl p-4 border border-violet-200/30 shadow-sm mb-4">
                    <Flex justify="center" align="center" gap="3">
                        <Icon.Funnel size={18} weight="bold" className="text-violet-600" />
                        <Text weight="medium" className="text-violet-900">Filtrar por Status:</Text>
                        <Select.Root
                            value={currentStatus || "Todos"}
                            size="1"
                            onValueChange={handleValueChange}
                        >
                            <Select.Trigger className="min-w-[120px]" />
                            <Select.Content>
                                <Select.Group>
                                    <Select.Label>Status</Select.Label>
                                    <Select.Item value="Todos">Todos</Select.Item>
                                    <Select.Item value="Pendente">Pendente</Select.Item>
                                    <Select.Item value="Autorizado">Autorizado</Select.Item>
                                    <Select.Item value="Não Autorizado">Não Autorizado</Select.Item>
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                    </Flex>
                </div>

                {loading ? (
                    <SkeletonDataList itens={PAGE_SIZE} columns={7} titles={1} />
                ) : hasData ? (
                    <DataList.Root orientation="vertical" className="w-full">
                        {page.data.map((sample) => (
                            <DataList.Item
                                key={sample.sampleId}
                                className="w-full rounded-2xl mb-4 transition-all duration-500 ease-out transform
                                bg-gradient-to-br from-white to-violet-50 shadow-sm hover:shadow-md 
                                border border-violet-200/80 backdrop-blur-sm overflow-hidden
                                hover:border-violet-300/60"
                            >
                                {/* Header com gradiente */}
                                <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-xl px-4 py-3 border-b border-violet-100/50">
                                    <p className="text-[17px] font-semibold text-center text-violet-900 tracking-tight flex items-center justify-center gap-2">
                                        <Icon.ClipboardText size={20} weight="bold" />
                                        Informações da Amostra
                                    </p>
                                </div>

                                <div className="p-2">
                                    <div className="space-y-3">
                                        {/* Pesquisador */}
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Icon.User size={16} weight="bold" />
                                                Pesquisador:
                                            </DataList.Label>
                                            <DataList.Value className="text-gray-900 font-medium">
                                                <TruncatedText
                                                    text={getFirstAndLastName(sample.researcherName)}
                                                    maxLength={18}
                                                    className="text-gray-900 font-medium truncate ml-2"
                                                />

                                            </DataList.Value>
                                        </div>

                                        <div className="p-3 bg-white rounded-lg border border-violet-100 shadow-sm flex justify-between">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                                <Icon.ClipboardText size={16} weight="bold" />
                                                Amostra:
                                            </DataList.Label>
                                            <DataList.Value>
                                                <Flex direction="column" justify={"end"} align="center" className="text-center">
                                                    <TruncatedText
                                                        text={sample.sampleName}
                                                        maxLength={20}
                                                        className="text-gray-900 font-medium truncate"
                                                    />
                                                    <Text size="1" className="text-gray-500 mt-1">
                                                        Criada em: {sample.createdAt && DateTime.fromISO(sample.createdAt).toFormat("dd/LL/yyyy - HH:mm")}
                                                    </Text>
                                                </Flex>
                                            </DataList.Value>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Icon.Certificate size={16} weight="bold" />
                                                CAAE:
                                            </DataList.Label>
                                            <DataList.Value>
                                                <Badge size="1" variant="soft" color="violet">
                                                    <TruncatedText
                                                        text={sample.cepCode}
                                                        maxLength={20}
                                                        className="text-gray-900 font-medium truncate"
                                                    />
                                                </Badge>
                                            </DataList.Value>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100 shadow-sm">
                                                <DataList.Label className="font-semibold text-gray-700 text-sm">
                                                    Solicitados:
                                                </DataList.Label>
                                                <Badge size="1" variant="soft" color="orange" >
                                                    {sample.qttParticipantsRequested}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                                                <DataList.Label className="font-semibold text-gray-700 text-sm">
                                                    Autorizados:
                                                </DataList.Label>
                                                <Badge
                                                    size="1"
                                                    variant="soft"
                                                    color="green"
                                                >
                                                    {sample.qttParticipantsAuthorized}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Icon.TrendUp size={16} weight="bold" />
                                                Status:
                                            </DataList.Label>
                                            <DataList.Value>
                                                <Badge
                                                    size="1"
                                                    variant="soft"
                                                    color={`${sample.currentStatus === 'Autorizado' ? 'grass' :
                                                        sample.currentStatus === 'Pendente' ? 'amber' : 'red'
                                                        }`}
                                                >
                                                    {sample.currentStatus}
                                                </Badge>
                                            </DataList.Value>
                                        </div>

                                        <div className="p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                                                <Icon.Gear size={16} weight="bold" />
                                                Ações:
                                            </DataList.Label>
                                            <Flex gap="2" direction="column">
                                                <Button
                                                    title="Alterar status"
                                                    className="w-full shadow-sm hover:shadow transition-all"
                                                    onClick={() => onClickToReviewSample(sample.sampleId)}
                                                    color="violet"
                                                    size="Small"
                                                >
                                                    <Icon.Pencil size={16} weight="bold" />
                                                </Button>
                                                <Button
                                                    title="Visualizar Revisões"
                                                    className="w-full shadow-sm hover:shadow transition-all"
                                                    onClick={() => onClickToViewSampleReviews(sample)}
                                                    color="blue"
                                                    size="Small"
                                                >
                                                    <Icon.MagnifyingGlass size={16} weight="bold" />
                                                </Button>
                                                <Button
                                                    title="Visualizar Documentos"
                                                    className="w-full shadow-sm hover:shadow transition-all"
                                                    onClick={() => onClickToViewSampleAttachments(sample.files)}
                                                    color="amber"
                                                    size="Small"
                                                >
                                                    <Icon.Clipboard size={16} weight="bold" />
                                                </Button>
                                            </Flex>
                                        </div>
                                    </div>
                                </div>
                            </DataList.Item>
                        ))}
                    </DataList.Root>
                ) : (
                    <EmptyState
                        icon={<Icon.FileX weight="thin" size={80} />}
                        title="Nenhuma Solicitação encontrada"
                        description="Não foram encontradas solicitações que correspondam aos critérios de busca ou filtros aplicados. Verifique os parâmetros utilizados e tente novamente."
                    />
                )}
            </div >
            <Pagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalCount={page?.pagination?.totalItems || 0}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default SamplesTable;