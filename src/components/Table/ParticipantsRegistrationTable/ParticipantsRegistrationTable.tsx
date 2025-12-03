import { DateTime } from "luxon";
import { ISample } from "../../../interfaces/sample.interface";
import { TFormFillStatus } from "../../../utils/consts.utils";
import { IParticipant } from "../../../interfaces/participant.interface";
import Accordeon from "../../Accordeon/Accordeon";
import { Badge, DataList, Flex, IconButton, Separator, Table, Text } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import SkeletonTableBody from "../../Skeletons/SkeletonTableBody";
import SkeletonDataList from "../../Skeletons/SkeletonDataList";
import Pagination from "../../../components/Table/Pagination/Pagination";
import { Button } from "../../Button/Button";

interface ParticipantsRegistrationTableProps {
    sampleId: string;
    data?: ISample["participants"];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onClickToViewSecondSources: (participant: IParticipant) => void;
    onClickToCopySecondSourceURL: (text: string) => void;
    expandedParticipants: Record<string, boolean>;
    setExpandedParticipants: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const ParticipantsRegistrationTable = ({
    sampleId,
    data,
    currentPage,
    pageSize,
    totalCount,
    onPageChange,
    onClickToViewSecondSources,
    onClickToCopySecondSourceURL,
    expandedParticipants,
    setExpandedParticipants,
}: ParticipantsRegistrationTableProps) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data) {
            setLoading(false);
        }
    }, [data]);

    const getParticipantProgress = (participant: IParticipant): TFormFillStatus => {
        if (!participant.adultForm?.startFillFormAt) {
            return "Não iniciado";
        }

        if (!participant.adultForm?.endFillFormAt) {
            return "Preenchendo";
        }

        const oneSecSourceFinishTheForm = participant.secondSources?.some(
            (secSource) => secSource.adultForm?.endFillFormAt
        );

        if (!oneSecSourceFinishTheForm) {
            return "Aguardando 2ª fonte";
        }

        return "Finalizado";
    };

    const getFirstAndLastName = (fullName: string) => {
        if (typeof fullName !== 'string') {
            return '';
        }
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };

    const getProgressColor = (status: TFormFillStatus) => {
        switch (status) {
            case "Finalizado": return "green";
            case "Preenchendo": return "blue";
            case "Aguardando 2ª fonte": return "amber";
            default: return "red";
        }
    };

    return (
        <Accordeon
            title="Informações do(s) Participante(s):"
            content={
                <>
                    <Table.Root variant="ghost" className="w-full desktop rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                        <Table.Header className="text-[18px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                            <Table.Row className="border-b border-violet-200/30">
                                <Table.ColumnHeaderCell colSpan={7} className="py-4">
                                    <Flex align="center" justify="center" gap="3" className="text-violet-900">
                                        <Icon.Users size={22} weight="bold" />
                                        <Text weight="bold" size="4">Participantes da Amostra</Text>
                                    </Flex>
                                </Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Header className="text-[16px] bg-gradient-to-r from-gray-50 to-gray-100/30">
                            <Table.Row align="center" className="text-center border-b border-gray-200/50">
                                {["Nome", "Andamento", "2ªs Fontes", "Data de início", "Data de finalização", "Indicadores de AH/SD", "URL 2ª fonte"].map((header) => (
                                    <Table.ColumnHeaderCell
                                        key={header}
                                        className="border-r border-gray-200/30 py-3 font-semibold text-gray-800 last:border-r-0"
                                    >
                                        <Flex align="center" justify="center" gap="2">
                                            {header === "Nome"}
                                            {header === "Andamento"}
                                            {header === "2ªs Fontes"}
                                            {header === "Data de início"}
                                            {header === "Data de finalização"}
                                            {header === "Indicadores de AH/SD"}
                                            {header === "URL 2ª fonte"}
                                            {header}
                                        </Flex>
                                    </Table.ColumnHeaderCell>
                                ))}
                            </Table.Row>
                        </Table.Header>

                        {loading ? (
                            <SkeletonTableBody itens={5} columns={7} />
                        ) : (
                            <Table.Body className="bg-white/50 backdrop-blur-sm">
                                {data?.map((participant, index) => (
                                    <Table.Row
                                        key={index}
                                        align="center"
                                        className="border-b border-gray-100/30 hover:bg-gray-50/50 transition-colors duration-200"
                                    >
                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text weight="medium" className="text-gray-900">
                                                {getFirstAndLastName(participant.personalData.fullName)}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Badge
                                                variant="solid"
                                                size="2"
                                                color={getProgressColor(getParticipantProgress(participant))}
                                                className="font-semibold w-full justify-center"
                                            >
                                                {getParticipantProgress(participant)}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <IconButton
                                                onClick={() => onClickToViewSecondSources(participant)}
                                                size="2"
                                                color="blue"
                                                className="hover:cursor-pointer bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors !px-5"
                                                variant="soft"
                                                radius="large"
                                                title="Ver segundas fontes"
                                            >
                                                <Flex gap="1" align="center">
                                                    <Text weight="medium">{participant.secondSources?.length || 0}</Text>
                                                    <Icon.MagnifyingGlass size={14} weight="bold" />
                                                </Flex>
                                            </IconButton>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text size="2" className="text-gray-600">
                                                {participant.adultForm?.startFillFormAt
                                                    ? DateTime.fromISO(participant.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                    : "Não iniciado"}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text size="2" className="text-gray-600">
                                                {participant.adultForm?.endFillFormAt && getParticipantProgress(participant) === "Finalizado"
                                                    ? DateTime.fromISO(participant.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                    : "Não Finalizado"}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Badge
                                                size="2"
                                                color={`${participant.adultForm?.giftednessIndicators ? 'green' : 'red'}`}
                                                className={`w-full justify-center border ${participant.adultForm?.giftednessIndicators ? ' !border-green-500' : '!border-red-500'}`}
                                            >
                                                {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="py-4">
                                            <IconButton
                                                onClick={() =>
                                                    onClickToCopySecondSourceURL(
                                                        `${import.meta.env.VITE_FRONTEND_URL
                                                        }/formulario-adulto-segunda-fonte/${sampleId}/${participant._id}`
                                                    )}
                                                size="2"
                                                className="hover:cursor-pointer bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
                                                variant="soft"
                                                radius="full"
                                                title="Copiar URL para segunda fonte"
                                            >
                                                <Icon.Copy size={16} weight="bold" />
                                            </IconButton>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        )}
                    </Table.Root>

                    <div className="mobo">
                        {loading ? (
                            <SkeletonDataList itens={3} columns={6} titles={1} />
                        ) : (
                            <DataList.Root orientation="vertical" className="!font-roboto p-2">
                                {data?.map((participant, index) => (
                                    <DataList.Item
                                        key={participant._id || index}
                                        className={`w-full rounded-2xl mb-4 transition-all duration-500 ease-out transform
                                        bg-gradient-to-br from-white to-violet-50 shadow-sm hover:shadow-md 
                                        border border-violet-200/80 backdrop-blur-sm overflow-hidden hover:border-violet-300/60
                                        ${participant._id && expandedParticipants[participant._id] ? 'max-h-[900px]' : 'max-h-[350px]'}
                                        `}
                                    >
                                        <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-xl px-4 py-3 border-b border-violet-100/50">
                                            <p className="text-[17px] font-semibold text-center text-violet-900 tracking-tight flex items-center justify-center gap-2">
                                                <Icon.User size={20} weight="bold" />
                                                Informações do Participante
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
                                                    <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Andamento</DataList.Label>
                                                    <DataList.Value className="text-sm font-semibold">
                                                        <Badge
                                                            size="2"
                                                            variant="solid"
                                                            color={getProgressColor(getParticipantProgress(participant))}
                                                            className="font-semibold"
                                                        >
                                                            {getParticipantProgress(participant)}
                                                        </Badge>
                                                    </DataList.Value>
                                                </div>

                                                <div className="space-y-1">
                                                    <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">2ªs Fontes</DataList.Label>
                                                    <DataList.Value className="text-sm font-semibold">
                                                        <IconButton
                                                            onClick={() => onClickToViewSecondSources(participant)}
                                                            size="2"
                                                            color="blue"
                                                            className="hover:cursor-pointer bg-blue-50 text-blue-700 border border-blue-200 !px-10"
                                                            variant="soft"
                                                            radius="large"
                                                            title="Ver segundas fontes"
                                                        >
                                                            <Flex gap="1" align="center">
                                                                <Text size="1" weight="medium">{participant.secondSources?.length || 0}</Text>
                                                                <Icon.MagnifyingGlass size={12} weight="bold" />
                                                            </Flex>
                                                        </IconButton>
                                                    </DataList.Value>
                                                </div>
                                            </div>

                                            {participant?._id && expandedParticipants[participant._id] && (
                                                <div className="mt-4 pt-4 border-t border-gray-200/50 animate-in fade-in-50 duration-300">
                                                    <div className="bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-xl p-4 -mx-2">
                                                        <p className="text-[15px] font-semibold text-center text-violet-900 mb-3 flex items-center justify-center gap-2">
                                                            <Icon.Info size={18} weight="bold" />
                                                            Informações Adicionais
                                                        </p>

                                                        <div className="grid grid-cols-1 gap-3">
                                                            <div className="mt-4 pt-4 border-t border-gray-200/50 animate-in fade-in-50 duration-300">
                                                                <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-xl p-2 -mx-2">
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
                                                                                className={`w-full justify-center border ${participant.adultForm?.giftednessIndicators ? ' !border-green-500' : '!border-red-500'}`}
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

                                                            <Separator size="4" className="bg-gray-200/50" />

                                                            <div className="space-y-1">
                                                                <DataList.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                    <Icon.Play size={16} weight="bold" />
                                                                    Data de Início
                                                                </DataList.Label>
                                                                <DataList.Value className="text-sm text-gray-600">
                                                                    {participant.adultForm?.startFillFormAt
                                                                        ? DateTime.fromISO(participant.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                                        : "Não iniciado"}
                                                                </DataList.Value>
                                                            </div>

                                                            <Separator size="4" className="bg-gray-200/50" />

                                                            <div className="space-y-1">
                                                                <DataList.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                    <Icon.Stop size={16} weight="bold" />
                                                                    Data de Finalização
                                                                </DataList.Label>
                                                                <DataList.Value className="text-sm text-gray-600">
                                                                    {participant.adultForm?.endFillFormAt && getParticipantProgress(participant) === "Finalizado"
                                                                        ? DateTime.fromISO(participant.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                                        : "Não Finalizado"}
                                                                </DataList.Value>
                                                            </div>

                                                            <Separator size="4" className="bg-gray-200/50" />

                                                            <div className="space-y-1">
                                                                <DataList.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                    <Icon.Link size={16} weight="bold" />
                                                                    URL 2ª Fonte
                                                                </DataList.Label>
                                                                <DataList.Value className="text-sm">
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            onClickToCopySecondSourceURL(
                                                                                `${import.meta.env.VITE_FRONTEND_URL
                                                                                }/formulario-adulto-segunda-fonte/${sampleId}/${participant._id}`
                                                                            )}
                                                                        size="4"
                                                                        className="hover:cursor-pointer bg-violet-50 text-violet-700 border border-violet-200 !w-full"
                                                                        variant="soft"
                                                                        radius="large"
                                                                        title="Copiar URL para segunda fonte"
                                                                    >
                                                                        Copiar
                                                                        <Icon.Copy size={14} weight="bold" className="ml-2" />
                                                                    </IconButton>
                                                                </DataList.Value>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 pt-3 border-t border-gray-200/60 rounded-b-xl">
                                            <Flex justify="center">
                                                <Button
                                                    size="Small"

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
                                                    <Icon.CaretDown
                                                        size={14}
                                                        className={`transition-all duration-500 ${participant._id && expandedParticipants[participant._id] ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </Button>
                                            </Flex>
                                        </div>
                                    </DataList.Item>
                                ))}
                            </DataList.Root>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        onPageChange={onPageChange}
                    />
                </>
            }
            className="mb-2"
            defaultValue="item-1"
        />
    );
};

export default ParticipantsRegistrationTable;