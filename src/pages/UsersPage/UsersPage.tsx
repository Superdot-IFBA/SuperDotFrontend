import { InputField } from "../../components/InputField/InputField";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsersTable from "../../components/Table/UsersTable/UsersTable";
import { Filters, PAGE_SIZE, ResearchersPaginated, paginateResearcher } from "../../api/researchers.api";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import ChangeRoleForm from "../../components/Form/ChangeRoleForm/ChangeRoleForm";
import { fetchUserRole } from "../../api/auth.api";
import { Notify, NotificationType } from "../../components/Notify/Notify";
import { usersPageSearchFormSchema } from "../../schemas/usersPage.schema";
import { USER_ROLE } from "../../utils/consts.utils";
import { Box, Container, Flex } from "@radix-ui/themes";
import { Button } from "../../components/Button/Button";
import * as Icon from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import ForbiddenPage from "../../components/ForbiddenPage/ForbiddenPage";

const UsersPage = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(usersPageSearchFormSchema) });

    const [tablePageData, setTablePageData] = useState<ResearchersPaginated>();
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [userSelected, setUserSelected] = useState<string | null>();
    const [filters, setFilters] = useState<Filters>();
    const [currentUserRole, setCurrentUserRole] = useState<USER_ROLE>("Pesquisador");
    const [loading, setLoading] = useState(true)
    const [notificationData, setNotificationData] = useState<{
        title: string;
        description: string;
        type?: NotificationType;
    }>({
        title: "",
        description: "",
        type: undefined,
    });
    const [showSearch, setShowSearch] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const showFilters = isDesktop || showSearch;

    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1020);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useEffect(() => {
        const getPage = async () => {
            try {
                const response = await paginateResearcher(currentTablePage, PAGE_SIZE, filters);
                if (response.status === 200) {
                    setTablePageData(response.data);
                    setNotFound(false);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    setNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        };

        getPage();
    }, [currentTablePage, filters]);

    if (notFound) {
        return <ForbiddenPage />;
    }

    const onUserSelected = async (userId: string) => {
        const role = await fetchUserRole(userId);
        setCurrentUserRole(role.data);
        setUserSelected(userId);
        setModalOpen(true);
    };

    const onUpdateUserRole = (newRole: USER_ROLE) => {
        setModalOpen(false);

        const researchers = tablePageData?.researchers.map((data) => {
            if (data._id === userSelected) {
                return {
                    ...data,
                    role: newRole,
                };
            } else return data;
        });

        if (!researchers || !tablePageData) return;

        setTablePageData({
            totalResearchers: tablePageData?.totalResearchers,
            researchers,
        });
        setNotificationData({
            title: "Permissões atualizadas!",
            description: "As permissões do usuário foram alteradas com sucesso.",
            type: "success"
        });

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


            <Box className="w-full  pt-10 pb-10 max-xl:pt-2 max-xl:pb-2">
                <Form.Root
                    onSubmit={handleSubmit((data) => {
                        setCurrentTablePage(1);
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
                                    label="Pesquisar Pelo Nome do Usuário"
                                    icon={<Icon.MagnifyingGlass />}
                                    placeholder="Digite o nome do usuário"
                                    errorMessage={errors.userName?.message}
                                    {...register("userName")}
                                />
                                <InputField
                                    label="Pesquisar pelo E-mail do Usuário"
                                    icon={<Icon.MagnifyingGlass />}
                                    placeholder="Digite o e-mail do usuário"
                                    errorMessage={errors.userName?.message}
                                    {...register("userEmail")}
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
                                    onClick={() => {
                                        setCurrentTablePage(1);
                                        setFilters({});
                                        reset({ userName: "", userEmail: "" });
                                    }}
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

            <Container className="mb-8">

                <UsersTable
                    onClickPencil={onUserSelected}
                    currentPage={currentTablePage}
                    setCurrentPage={setCurrentTablePage}
                    data={tablePageData}
                />

            </Container>
            <Modal
                accessibleDescription="Selecione um novo perfil para o usuário escolhido."
                title="Alterando Perfil"
                open={modalOpen}
                setOpen={setModalOpen}
            >
                <ChangeRoleForm
                    currentUserRole={currentUserRole}
                    onFinish={onUpdateUserRole}
                    userId={userSelected || ""}
                />
            </Modal>
        </>
    );
};

export default UsersPage;
