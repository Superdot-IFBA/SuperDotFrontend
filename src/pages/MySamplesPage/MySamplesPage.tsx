import * as Form from "@radix-ui/react-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField } from "../../components/InputField/InputField";
import { PAGE_SIZE } from "../../api/researchers.api";
import { useEffect, useState } from "react";
import { Page, deleteSample, paginateSamples } from "../../api/sample.api";
import { MySamplesFilters, mySamplesFiltersSchema } from "../../schemas/mySample.schema";
import { Card } from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";
import { Notify, NotificationType } from "../../components/Notify/Notify";
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithNotification } from "../../validators/navigationStateValidators";
import { DateTime } from "luxon";
import { ISample } from "../../interfaces/sample.interface";
import { Badge, Box, Container, Flex, IconButton, Separator, Skeleton, Text, Tooltip, } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { GridComponent } from "../../components/Grid/Grid";
import { Button } from "../../components/Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import EmptyState from "../../components/EmptyState/EmptyState";
import TruncatedText from "../../components/TruncatedText/TruncatedText";

const MySamplesPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(mySamplesFiltersSchema) });
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const [pageData, setPageData] = useState<Page<ISample>>();
    const [filters, setFilters] = useState<MySamplesFilters>();

    const [notificationData, setNotificationData] = useState<{
        title: string;
        description: string;
        type?: NotificationType;
    }>({
        title: "",
        description: "",
        type: undefined,
    });

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [sampleIdToDelete, setSampleIdToDelete] = useState<string>();

    useEffect(() => {
        if (stateWithNotification(location.state)) {
            setNotificationData({
                title: "Registro Concluído com Sucesso!",
                description: "A amostra foi cadastrada com êxito. Ela estará disponível para uso no sistema somente após aprovação pelo administrador ou revisor.",
                type: "success"
            });
        }
    }, [location.state]);

    useEffect(() => {
        setLoading(true);
        const getPage = async () => {
            try {
                const response = await paginateSamples(1, PAGE_SIZE, filters);
                if (response.status === 200) {
                    setPageData(response.data);
                } else {
                    console.error('Erro na resposta:', response);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        getPage();
    }, [filters]);


    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1020);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const showFilters = isDesktop || showSearch;



    /* HANDLERS TO DELETE SAMPLE REQUEST*/
    const handleNavigateToDeleteSample = (sampleId?: string) => {
        if (sampleId) {
            setSampleIdToDelete(sampleId);
        }
        setOpenModalDelete(true);
    };
    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };

    const handleNavigateToEditSample = (sample?: ISample) => {
        if (sample) {
            navigate("/app/edit-sample", {
                state: {
                    sample,
                },
            });
            scrollToTop();
        }
    };

    const handleDeleteSample = async () => {
        setLoading(true);
        try {
            const response = await deleteSample(sampleIdToDelete);

            if (response.status === 200) {
                const dataFiltered = pageData?.data?.filter((data) => data._id !== sampleIdToDelete);
                const newPageData = {
                    ...pageData,
                    data: dataFiltered ? [...dataFiltered] : undefined,
                };
                setPageData(newPageData);
                setOpenModalDelete(false);
            }
            setNotificationData({
                title: "Solicitação apagada!",
                description: "A solicitação foi apagada com sucesso!",
                type: "success"
            });

        } catch (e) {
            setNotificationData({
                title: "Erro ao apagar solicitação!",
                description: "Não foi possível apagar a solicitação. Tente novamente mais tarde.",
                type: "error"
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterPeople = (sampleId: string) => {
        navigate("/app/my-samples/participants-registration", {
            state: {
                sampleId,
            },
        });
        scrollToTop();
    };

    const handleClickToAnalyzeSampleParticipantes = (sample: ISample) => {
        navigate("/app/my-samples/analyze-sample", {
            state: {
                sample,
            },
        });
        scrollToTop();
    };

    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: undefined })}
                title={notificationData.title}
                description={notificationData.description}
                type={notificationData.type}
            />


            <Box className="w-full pt-5 pb-5 max-xl:pt-2 max-xl:pb-2">
                <Form.Root
                    onSubmit={handleSubmit((data) => {
                        setFilters({
                            ...data,
                        });
                    })}
                    className="flex flex-col items-center gap-4 xl:flex-row xl:justify-between p-4 pt-0 pb-1"
                >
                    {!isDesktop && (
                        <Button
                            type="button"
                            onClick={() => setShowSearch(!showSearch)}
                            className="block xl:hidden"
                            title={`${showSearch ? "Fechar Filtros" : "Mostrar Filtros"}`}
                            color="primary"
                            size="Medium"
                        >
                            {showSearch ? <Icon.X size={20} /> : <Icon.Funnel size={20} />}
                        </Button>
                    )}

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col xl:flex-row xl:items-center gap-3 w-full overflow-hidden"
                            >
                                <Form.Submit asChild className="hidden xl:block">
                                    <Button
                                        size="Large"
                                        className="items-center w-full xl:w-[300px] xl:mt-5"
                                        title="Filtrar"
                                        color="primary"
                                    >
                                        <Icon.Funnel size={20} color="white" />
                                    </Button>
                                </Form.Submit>
                                <InputField
                                    label="Pesquisar pela pesquisa"
                                    icon={<Icon.MagnifyingGlass />}
                                    placeholder="Digite o título da pesquisa"
                                    errorMessage={errors.researcherTitle?.message}
                                    {...register("researcherTitle")}
                                />
                                <InputField
                                    label="Pesquisar pela amostra"
                                    icon={<Icon.MagnifyingGlass />}
                                    placeholder="Digite o título da amostra"
                                    errorMessage={errors.sampleTitle?.message}
                                    {...register("sampleTitle")}
                                />
                                <Form.Submit asChild className="block xl:hidden">
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
                                    onClick={() => setFilters({})}
                                    type="reset"
                                    className="items-center w-full xl:w-[300px] xl:mt-5"
                                    color="primary"
                                    title="Limpar Filtro"
                                >
                                </Button>

                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Flex />
                </Form.Root>
            </Box>

            <Container className="mb-4 p-4 max-lg:p-0">
                {pageData?.data?.length === 0 ? (
                    <EmptyState
                        icon={<Icon.FileX weight="thin" size={100} />}
                        title={"Nenhuma amostra encontrada."}
                        description={"Não foram encontradas amostras que correspondam aos critérios de busca ou filtros aplicados. Verifique os parâmetros utilizados e tente novamente."}
                    />
                ) : (
                    <GridComponent columns={2} className="gap-6 max-sm:gap-4">
                        {loading ? (
                            Array.from({ length: 2 }).map((_, idx) => (
                                <Card.Root
                                    key={idx}
                                    className="rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm"
                                    loading={true}
                                >
                                    <Card.Header >
                                        <Flex justify="between" align="center" className="space-x-4">
                                            <Skeleton className="h-6 w-32 rounded-lg" />
                                            <Flex gap="2">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </Flex>
                                        </Flex>
                                    </Card.Header>

                                    <Card.Content>
                                        <div className="space-y-4">
                                            <Skeleton className="h-4 w-full rounded" />
                                            <div className="space-y-3">
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <Skeleton className="h-4 w-24 rounded" />
                                                        <Skeleton className="h-4 w-32 rounded" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card.Content>

                                    <Card.Actions className="flex gap-3">
                                        <Skeleton className="h-11 flex-1 rounded-xl" />
                                        <Skeleton className="h-11 flex-1 rounded-xl" />
                                    </Card.Actions>
                                </Card.Root>
                            ))
                        ) : (
                            pageData?.data?.map((sample, index) => (
                                <Card.Root
                                    key={index}
                                    className={`rounded-2xl card-container overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm 
                                    ${sample.status === "Autorizado"
                                            ? " !border-l-4 !border-l-emerald-500"
                                            : sample.status === "Pendente"
                                                ? "!border-l-4 !border-l-amber-500"
                                                : "!border-l-4 !border-l-red-500"
                                        }`}
                                >
                                    <div className={`bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-xl px-4 py-3 border-b border-violet-100/50`}>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Text as="label" className="text-[20px] font-semibold text-center text-violet-900 tracking-tight flex items-center justify-center gap-2">
                                                        {sample.sampleGroup}
                                                    </Text>
                                                </div>
                                            </div>

                                            {sample.status !== "Autorizado" && (
                                                <div className="flex gap-2 justify-end">
                                                    <Tooltip content="Editar Amostra">
                                                        <IconButton
                                                            color="purple"
                                                            variant="soft"
                                                            size="2"
                                                            className="hover:scale-105 transition-transform bg-amber-500/10 text-amber-700 border border-amber-200 !cursor-pointer"
                                                            title="Editar Amostra"
                                                            onClick={() => handleNavigateToEditSample(sample)}
                                                        >
                                                            <Icon.Pencil size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Excluir Amostra">
                                                        <IconButton
                                                            color="red"
                                                            variant="soft"
                                                            size="2"
                                                            className="hover:scale-105 transition-transform bg-red-500/10 text-red-700 border border-red-200 !cursor-pointer"
                                                            title="Excluir Amostra"
                                                            onClick={() => handleNavigateToDeleteSample(sample._id)}
                                                        >
                                                            <Icon.Trash size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Card.Content >
                                        <div className="space-y-2 text-sm">

                                            <div className="grid gap-1">
                                                <div className="flex justify-between items-center px-2 py-1.5 border rounded-lg">
                                                    <span className="flex items-center gap-1.5 text-gray-600">
                                                        <Icon.ClipboardText size={13} /> Amostra:
                                                    </span>
                                                    <TruncatedText
                                                        text={sample.sampleTitle}
                                                        maxLength={20}
                                                        className="text-gray-900 font-medium truncate"
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center px-2 py-1.5 border rounded-lg">
                                                    <span className="flex items-center gap-1.5 text-gray-600">
                                                        <Icon.MagnifyingGlass size={13} /> Pesquisa:
                                                    </span>
                                                    <TruncatedText
                                                        text={sample.researchTitle}
                                                        maxLength={20}
                                                        className="text-gray-900 font-medium truncate"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center px-2 py-1.5 border rounded-lg">
                                                    <span className="flex items-center gap-1.5 text-gray-600">
                                                        <Icon.GraduationCap size={13} /> Instituição:
                                                    </span>
                                                    <TruncatedText
                                                        text={sample.instituition.name}
                                                        maxLength={20}
                                                        className="text-gray-900 font-medium truncate"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1 border rounded-lg px-2 py-1.5">
                                                <span className="flex justify-center items-center gap-1.5 text-gray-600">
                                                    Participantes
                                                </span>
                                                <Separator size={"4"} />
                                                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-1">
                                                    <div className="flex gap-2 items-center px-2 ">
                                                        <span className="flex items-center gap-1.5 text-gray-600">
                                                            <Icon.UsersThree size={13} /> Limite:
                                                        </span>
                                                        {sample.qttParticipantsAuthorized || 0}
                                                    </div>

                                                    <div className="flex gap-2 items-center px-2">
                                                        <span className="flex items-center gap-1.5 text-gray-600">
                                                            <Icon.UserList size={13} /> Cadastrados:
                                                        </span>
                                                        {sample.participants?.length || 0}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center px-2 py-1.5 border rounded-lg">
                                                <span className="flex items-center gap-1.5 text-gray-600">
                                                    <Icon.Certificate size={13} /> CEP
                                                </span>
                                                <TruncatedText
                                                    text={sample.researchCep.cepCode}
                                                    maxLength={20}
                                                    className="text-gray-900 font-medium truncate"
                                                />

                                            </div>

                                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-1">
                                                <div className="px-2 py-1.5 border rounded-lg text-center">
                                                    <span className="text-xs text-gray-600 flex justify-center items-center gap-1">
                                                        <Icon.CalendarPlus size={13} /> Data solicitada
                                                    </span>
                                                    <span className="text-xs font-semibold">
                                                        {sample.createdAt && DateTime.fromISO(sample.createdAt).toFormat("dd/LL/yy")}
                                                    </span>
                                                </div>

                                                <div className="px-2 py-1.5 border rounded-lg text-center">
                                                    <span className="text-xs text-gray-600 flex justify-center items-center gap-1">
                                                        <Icon.CalendarCheck size={13} /> Última atualização
                                                    </span>
                                                    <span className="text-xs font-semibold">
                                                        {sample.updatedAt && DateTime.fromISO(sample.updatedAt).toFormat("dd/LL/yy")}
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={`px-2 py-1.5 rounded-lg border flex justify-between items-center ${sample.status === "Autorizado"
                                                    ? "bg-emerald-50 border-emerald-200"
                                                    : sample.status === "Pendente"
                                                        ? "bg-amber-50 border-amber-200"
                                                        : "bg-red-50 border-red-200"
                                                    }`}
                                            >
                                                <span className="flex items-center gap-1.5 text-gray-700 text-sm">
                                                    <Icon.TrendUp size={13} /> Status
                                                </span>

                                                {sample.status === "Autorizado" ? (
                                                    <Badge
                                                        size="2"
                                                        color="green"
                                                        variant="solid"
                                                        className="rounded-full px-3 py-1 text-sm font-semibold border border-emerald-500 shadow-sm justify-center"
                                                    >
                                                        <Icon.CheckCircle size={12} weight="bold" className="mr-1" />
                                                        Autorizado
                                                    </Badge>
                                                ) : sample.status === "Pendente" ? (
                                                    <Badge
                                                        size="2"
                                                        color="orange"
                                                        variant="solid"
                                                        className="rounded-full px-3 py-1 text-xs font-semibold border border-amber-500 shadow-sm justify-center"
                                                    >
                                                        <Icon.Clock size={12} weight="bold" className="mr-1" />
                                                        Aguardando aprovação pelo <br className="sm:hidden" /> administrador do sistema...
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        size="2"
                                                        color="red"
                                                        variant="solid"
                                                        className="rounded-full px-3 py-1 text-xs font-semibold border border-red-500 shadow-sm justify-center"
                                                    >
                                                        <Icon.XCircle size={12} weight="bold" className="mr-1" />
                                                        {sample.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                    </Card.Content>

                                    <Card.Actions className="flex gap-3 max-sm:flex-col bg-gradient-to-r from-violet-500/5 to-purple-500/5  px-4 py-3 border-b border-violet-100/50">
                                        <Card.Action
                                            disabled={sample.status !== "Autorizado"}
                                            onClick={() => handleRegisterPeople(sample._id as string)}
                                        >
                                            Cadastrar Pessoas
                                        </Card.Action>
                                        <Card.Action
                                            disabled={
                                                sample.status !== "Autorizado" ||
                                                sample.participants?.filter(p => p.adultForm?.totalPunctuation != null).length === 0
                                            }
                                            onClick={() => handleClickToAnalyzeSampleParticipantes(sample)}
                                        >

                                            Avaliar Pessoas
                                        </Card.Action>
                                    </Card.Actions>
                                </Card.Root>
                            ))
                        )}
                    </GridComponent>
                )}
            </Container>
            <Modal
                open={openModalDelete}
                setOpen={setOpenModalDelete}
                title="Confirmação de Exclusão"
                accessibleDescription="A solicitação de amostra selecionada está prestes a ser excluída do sistema. Tem certeza de que deseja prosseguir com a exclusão desta solicitação? Esta ação não poderá ser desfeita."
            >

                <Flex gap="3" mt="4" justify="end">
                    <Button loading={loading} onClick={handleDeleteSample} color="red" title={"Ecluir"} size={"Extra Small"} />
                    <Button onClick={() => setOpenModalDelete(false)} color="gray" title={"Cancelar"} size={"Extra Small"} />
                </Flex>
            </Modal>
        </>
    );
};

export default MySamplesPage;
