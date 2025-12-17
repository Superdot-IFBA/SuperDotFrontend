import ParticipantsRegistrationTable from "../../components/Table/ParticipantsRegistrationTable/ParticipantsRegistrationTable";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ISample } from "../../interfaces/sample.interface";
import Modal from "../../components/Modal/Modal";
import { IParticipant } from "../../interfaces/participant.interface";
import { DateTime } from "luxon";
import { Notify, NotificationType } from "../../components/Notify/Notify";
import { TFormFillStatus } from "../../utils/consts.utils";
import { ISecondSource } from "../../interfaces/secondSource.interface";
import { DeepPartial } from "react-hook-form";
import ParticipantsIndicationForm from "../../components/ParticipantsIndicationForm/ParticipantsIndicationForm";
import { getSampleById } from "../../api/sample.api";
import { DataList, Flex, IconButton, Separator, Badge, Table, Text, Tooltip } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";
import EmptyState from "../../components/EmptyState/EmptyState";
import SkeletonURLCard from "../../components/Skeletons/SkeletonURLCard";
import SkeletonHeader from "../../components/Skeletons/SkeletonHeader";

const ParticipantsRegistration = () => {
    const [sample, setSample] = useState<ISample>({} as ISample);
    const [modalSecondSourcesOpen, setModalSecondSourcesOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentParticipant, setCurrentParticipant] = useState<IParticipant>();
    const [modalIndicateParticipantsOpen, setModalIndicateParticipantsOpen] = useState(false);
    const [notificationData, setNotificationData] = useState<{
        title: string;
        description: string;
        type?: NotificationType;
    }>({
        title: "",
        description: "",
        type: undefined,
    });
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };

    const badgeColorMap: Record<
        ReturnType<typeof getFormFillStatus>,
        "yellow" | "green"
    > = {
        "Não iniciado": "yellow",
        "Preenchendo": "yellow",
        "Aguardando 2ª fonte": "yellow",
        "Finalizado": "green",
    };

    useEffect(() => {
        const getSampleInfo = async (sampleId: string) => {
            try {
                const response = await getSampleById({ sampleId });
                if (response.status === 200) {
                    setSample(response.data);
                    setLoading(false)
                }
            } catch (e) {
                console.error(e);
                setNotificationData({
                    title: "Erro no servidor",
                    description: "Não foi possível buscar as informações da amostra.",
                    type: "error"

                });
            }
        };

        if (location.state.sampleId) {
            getSampleInfo(location.state.sampleId);
        } else {
            navigate(-1);
        }

        if (sample?.participants?.length !== sample?.qttParticipantsAuthorized) {
            setNotificationData({
                title: "Aviso!",
                description: "Você ainda não selecionou a quantidade total de participantes da pesquisa.",
                type: "warning"
            })

        }

    }, [navigate, location]);

    const handleViewSecondSources = (participant: IParticipant) => {
        setCurrentParticipant(participant);
        setModalSecondSourcesOpen(true);
    };


    const handleCopy = (url: string) => {
        const tempInput = document.createElement('input');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        tempInput.value = url;
        document.body.appendChild(tempInput);

        tempInput.focus();
        tempInput.select();
        tempInput.setSelectionRange(0, tempInput.value.length);

        try {
            const result = document.execCommand('copy');

            if (result) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);

                setTimeout(() => {
                    const pasteTest = document.createElement('input');
                    pasteTest.style.position = 'absolute';
                    pasteTest.style.left = '-9999px';
                    document.body.appendChild(pasteTest);
                    pasteTest.focus();
                    document.execCommand('paste');
                    document.body.removeChild(pasteTest);
                }, 100);

            } else {
                console.warn('execCommand retornou false');
                fallbackCopy();
            }

        } catch (error) {
            console.error('Erro no execCommand:', error);
            fallbackCopy();
        } finally {
            // Limpa sempre
            document.body.removeChild(tempInput);
            setNotificationData({
                title: "Link copiado.",
                description: "O link foi copiado para a sua área de transferência.",
                type: "success"
            });
        }
    };

    const fallbackCopy = () => {
        alert(`Não foi possível copiar automaticamente. Selecione e copie o texto:\n\n${urlParticipantForm}`);

        window.prompt('Copie o texto abaixo (Ctrl+C):', urlParticipantForm);
    };



    const getFormFillStatus = (secondSource: DeepPartial<ISecondSource>): TFormFillStatus => {
        if (!secondSource.adultForm?.startFillFormAt) {
            return "Não iniciado";
        }

        if (!secondSource.adultForm.endFillFormAt) {
            return "Preenchendo";
        }

        return "Finalizado";
    };

    const handleFinishParticipantIndication = (participantsAdded: IParticipant[]) => {
        setModalIndicateParticipantsOpen(false);

        const newParticipantsArr = sample?.participants ?? [];
        newParticipantsArr.push(...participantsAdded);

        setSample({
            ...sample,
            participants: newParticipantsArr,
        });
    };

    const urlParticipantForm = `${import.meta.env.VITE_FRONTEND_URL}/formulario-adulto/${sample?._id}`;

    const StatItem = ({ icon, label, value, background }: { icon?: ReactNode; label: string; value: ReactNode; background?: string }) => (
        <Flex align="center" gap="2" className={`${background} p-2 px-4 rounded-lg`} >
            {icon && <span className="text-primary-600">{icon}</span>}
            <Text size="2" weight="medium" className="text-gray-600">{label}:</Text>
            <Text size="2" weight="bold" className="text-gray-900">{value}</Text>
        </Flex>
    );

    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const scrollRef = useRef<HTMLDivElement>(null);
    const paginatedParticipants = sample?.participants?.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage]);
    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: undefined })}
                title={notificationData.title}
                description={notificationData.description}
                type={notificationData.type}
            />


            {loading ? (
                <SkeletonHeader />
            ) : (
                <>
                    <header className="pb-3 pt-4">
                        <h2 className="heading-2 font-semibold text-gray-900 text-left max-sm:text-center">
                            <Badge size={'3'} color="violet" radius='large'>
                                <Icon.ChartBar size={25} weight="duotone" className="text-primary inline-block mr-2" />
                                Amostra: {sample.sampleTitle}
                            </Badge>
                        </h2>
                    </header>

                </>)
            }

            <div className="card-container p-5 mb-5">
                {loading ? (
                    <SkeletonURLCard />
                ) : (
                    <Flex direction="column" gap="4">
                        <Flex align="center" gap="2">
                            <Icon.Info size={24} className="text-primary-600" />
                            <Text size="5" weight="bold">URL de Cadastro</Text>
                        </Flex>

                        <Flex align="center" gap="3" className={`${copied ? "bg-confirm" : "bg-violet-200"} p-3 rounded`}>
                            <Text className="text-ellipsis overflow-hidden flex-1 bg-gray-50 rounded p-2 break-all text-sm">
                                {urlParticipantForm}
                            </Text>
                            <Tooltip content="Copiar URL">
                                <IconButton
                                    variant="soft"
                                    onClick={() => {
                                        handleCopy(urlParticipantForm);
                                    }}
                                    className="transition-transform duration-150 active:scale-90"
                                >
                                    <div className="relative w-[20px] h-[20px]">
                                        <Icon.Copy
                                            className={`absolute inset-0 transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"}`}
                                            width={20}
                                            height={20}
                                        />

                                        <Icon.Check
                                            className={`absolute inset-0  transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                </IconButton>
                            </Tooltip>
                        </Flex>

                        <Separator size="4" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatItem
                                icon={<Icon.Users size={20} />}
                                label="Total Permitido"
                                value={sample?.qttParticipantsAuthorized}
                                background={"bg-violet-200"}
                            />
                            <StatItem
                                icon={<Icon.UserPlus size={20} />}
                                label="Cadastrados"
                                value={sample?.participants?.length}
                                background={"bg-green-200"}
                            />
                            <StatItem
                                icon={<Icon.Clock size={20} />}
                                label="Pendentes"
                                value={(sample?.qttParticipantsAuthorized || 0) - (sample?.participants?.length || 0)} background={"bg-amber-200"} />
                            {sample?.participants?.length !== sample?.qttParticipantsAuthorized && (
                                <Button
                                    size="Large"
                                    className="w-full md:w-auto bg-am"
                                    children={<Icon.PlusCircle size={20} />}
                                    onClick={() => setModalIndicateParticipantsOpen(true)} title={"Adicionar Avaliados"}
                                    color={"green"}>
                                </Button>
                            )}
                        </div>


                    </Flex>
                )}
            </div>

            <div className="card-container-border-variante">
                <ParticipantsRegistrationTable
                    sampleId={sample?._id || ""}
                    data={paginatedParticipants}
                    onClickToViewSecondSources={handleViewSecondSources}
                    onClickToCopySecondSourceURL={handleCopy}
                    currentPage={currentPage}
                    pageSize={PAGE_SIZE}
                    totalCount={sample?.participants?.length || 0}
                    onPageChange={setCurrentPage}
                    expandedParticipants={expanded}
                    setExpandedParticipants={setExpanded}
                />

            </div>

            <Modal
                open={modalIndicateParticipantsOpen}
                setOpen={setModalIndicateParticipantsOpen}
                title={"Indicar Novos Participantes"} accessibleDescription={"Para indicar novos participantes à pesquisa informe seus dados de contato. Após a inclusão, o sistema envia automaticamente um e-mail personalizado contendo o convite e as instruções necessárias para que o participante acesse e responda ao questionário."}
            >
                <ParticipantsIndicationForm
                    setNotificationData={setNotificationData}
                    sampleId={sample?._id as string}
                    onFinish={handleFinishParticipantIndication}
                />
            </Modal>

            <Modal
                open={modalSecondSourcesOpen}
                setOpen={setModalSecondSourcesOpen}
                title="Segundas Fontes" accessibleDescription={""}                    >
                {currentParticipant?.secondSources?.length ? (
                    <>

                        <Table.Root variant="ghost" className="w-full rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden desktop">
                            <Table.Header className="text-[18px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
                                <Table.Row className="border-b border-blue-200/30">
                                    <Table.ColumnHeaderCell colSpan={5} className="py-4">
                                        <Flex align="center" justify="center" gap="3" className="text-blue-900">
                                            <Icon.Users size={22} weight="bold" />
                                            <Text weight="bold" size="4">Segundas Fontes do Participante</Text>
                                        </Flex>
                                    </Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Header className="text-[16px] bg-gradient-to-r from-gray-50 to-gray-100/30">
                                <Table.Row align="center" className="text-center border-b border-gray-200/50">
                                    {["Nome", "Status", "Relação", "Início", "Término"].map((header) => (
                                        <Table.ColumnHeaderCell
                                            key={header}
                                            className="border-r border-gray-200/30 py-3 font-semibold text-gray-800 last:border-r-0"
                                        >
                                            <Flex align="center" justify="center" gap="2">
                                                {header === "Nome"}
                                                {header === "Status"}
                                                {header === "Relação"}
                                                {header === "Início"}
                                                {header === "Término"}
                                                {header}
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                    ))}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body className="bg-white/50 backdrop-blur-sm">
                                {currentParticipant.secondSources.map((secondSource) => (
                                    <Table.Row
                                        key={secondSource._id}
                                        align="center"
                                        className="border-b border-gray-100/30 hover:bg-blue-50/30 transition-colors duration-200"
                                    >
                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text weight="medium" className="text-gray-900">
                                                {secondSource.personalData?.fullName}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">

                                            <Badge
                                                size="1"
                                                color={badgeColorMap[getFormFillStatus(secondSource)]}
                                                className="font-semibold"
                                            >
                                                {getFormFillStatus(secondSource)}
                                            </Badge>

                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text weight="medium" className="text-gray-700">
                                                {secondSource.personalData?.relationship}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text size="2" className="text-gray-600">
                                                {secondSource.adultForm?.startFillFormAt
                                                    ? DateTime.fromISO(secondSource.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                    : "Não iniciado"}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="py-4">
                                            <Text size="2" className="text-gray-600">
                                                {secondSource.adultForm?.endFillFormAt
                                                    ? DateTime.fromISO(secondSource.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                    : "Não finalizado"}
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>

                        <div className="mobo">
                            <DataList.Root orientation="vertical" className="!font-roboto p-2">
                                {currentParticipant?.secondSources?.map((secondSource, index) => (
                                    <DataList.Item
                                        key={secondSource._id || index}
                                        className="w-full rounded-2xl mb-4 transition-all duration-300 ease-out transform
                    bg-gradient-to-br from-white to-blue-50 shadow-sm hover:shadow-md 
                    border border-blue-200/80 backdrop-blur-sm overflow-hidden
                    hover:border-blue-300/60"
                                    >
                                        <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-t-xl px-4 py-3 border-b border-blue-100/50">
                                            <p className="text-[17px] font-semibold text-center text-blue-900 tracking-tight flex items-center justify-center gap-2">
                                                <Icon.Users size={20} weight="bold" />
                                                Segunda Fonte
                                            </p>
                                        </div>

                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="space-y-1">
                                                    <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Nome</DataList.Label>
                                                    <DataList.Value className="text-sm font-semibold text-gray-900">
                                                        {getFirstAndLastName(secondSource.personalData?.fullName || '')}
                                                    </DataList.Value>
                                                </div>

                                                <div className="space-y-1">
                                                    <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Status</DataList.Label>
                                                    <DataList.Value className="text-sm font-semibold">
                                                        <Badge
                                                            size="1"
                                                            color={badgeColorMap[getFormFillStatus(secondSource)]}
                                                            className="font-semibold"
                                                        >
                                                            {getFormFillStatus(secondSource)}
                                                        </Badge>

                                                    </DataList.Value>
                                                </div>

                                                <div className="space-y-1">
                                                    <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Relação</DataList.Label>
                                                    <DataList.Value className="text-sm font-semibold text-gray-900">
                                                        {secondSource.personalData?.relationship}
                                                    </DataList.Value>
                                                </div>
                                            </div>

                                            <Separator size="4" className="bg-gray-200/50 mb-4" />

                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="space-y-1">
                                                    <DataList.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                        <Icon.Play size={16} weight="bold" />
                                                        Data de Início
                                                    </DataList.Label>
                                                    <DataList.Value className="text-sm text-gray-600">
                                                        {secondSource.adultForm?.startFillFormAt
                                                            ? DateTime.fromISO(secondSource.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                            : "Não iniciado"}
                                                    </DataList.Value>
                                                </div>

                                                <Separator size="2" className="bg-gray-200/30" />

                                                <div className="space-y-1">
                                                    <DataList.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                        <Icon.Stop size={16} weight="bold" />
                                                        Data de Finalização
                                                    </DataList.Label>
                                                    <DataList.Value className="text-sm text-gray-600">
                                                        {secondSource.adultForm?.endFillFormAt
                                                            ? DateTime.fromISO(secondSource.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                            : "Não finalizado"}
                                                    </DataList.Value>
                                                </div>
                                            </div>
                                        </div>
                                    </DataList.Item>
                                ))}
                            </DataList.Root>
                        </div>

                    </>
                ) : (
                    <EmptyState
                        icon={<Icon.UserGear size={40} />}
                        title="Nenhuma segunda fonte encontrada!"
                        description="Adicione segundas fontes através do formulário do participante."
                    />
                )}

            </Modal>
        </ >
    );
};

export default ParticipantsRegistration;
