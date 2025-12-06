import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithGroupSample } from "../../validators/navigationStateValidators";
import * as Form from "@radix-ui/react-form";
import { InputField } from "../../components/InputField/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SampleValues, sampleSchema } from "../../schemas/sample.schema";
import * as Separator from "@radix-ui/react-separator";
import { createSample } from "../../api/sample.api";
import { Notify, NotificationType } from "../../components/Notify/Notify";
import { SelectField } from "../../components/SelectField/SelectField";
import { FILES_AVAILABLE_TO_CREATE_SAMPLE } from "../../utils/consts.utils";
import { SampleFile } from "../../interfaces/sample.interface";
import SampleUploadFile from "../../components/SampleUploaderFile/SampleUploaderFile";
import { validateFiles } from "../../validators/fileValidator";
import { CustomFileError } from "../../errors/fileErrors";
import * as Icon from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";
import { Badge, Text } from "@radix-ui/themes";

const CreateSamplePage = () => {
    const [sampleFiles, setSampleFiles] = useState<SampleFile[]>(FILES_AVAILABLE_TO_CREATE_SAMPLE);
    const [sampleFileError, setSampleFileError] = useState("");
    const [loading, setLoading] = useState(false);

    /* NOTIFY */
    const [notificationData, setNotificationData] = useState<{
        title: string;
        description: string;
        type?: NotificationType;
    }>({
        title: "",
        description: "",
        type: undefined,
    });

    const showErrorNotification = (message: string) => {
        setNotificationData({
            title: "Por favor, preencha todos os campos.",
            description: message,
            type: "error",
        });
        scrollToTop();
    };



    /* GROUP SELECTION ASSERT */
    const [groupSelected, setGroupSelected] = useState<string>();
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToTop = () => {
        const scrollContainer = document.querySelector(
            '[data-radix-scroll-area-viewport]'
        ) as HTMLElement | null;

        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    useEffect(() => {
        if (stateWithGroupSample(location.state)) {
            setGroupSelected(location.state.groupSelected);
            scrollToTop();
        } else {
            navigate("/app/choose-sample-group");
            scrollToTop();
        }
    }, [location.state, navigate]);

    /* FORM HANDLER */
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({ resolver: yupResolver(sampleSchema) });

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            validateFiles(sampleFiles);
        } catch (e: any) {
            if (e instanceof CustomFileError) {
                setNotificationData({
                    title: "Arquivos inválidos.",
                    description: e.message,
                    type: "error"
                });
                setSampleFileError(e.message);
                setLoading(false);
            }
            return;
        }

        const formData = new FormData();

        for (const key in data) {
            if (key === "researchCep") {
                for (const nestedKey in data[key]) {
                    formData.append(
                        `researchCep[${nestedKey}]`,
                        data["researchCep"][nestedKey as keyof (typeof data)["researchCep"]] as string
                    );
                }
            } else if (key === "instituition") {
                for (const nestedKey in data[key]) {
                    formData.append(
                        `instituition[${nestedKey}]`,
                        data["instituition"][nestedKey as keyof (typeof data)["instituition"]] as string
                    );
                }
            } else {
                formData.append(key, data[key as keyof SampleValues] as string);
            }
        }

        if (groupSelected) {
            formData.append("sampleGroup", groupSelected);
        }

        sampleFiles?.forEach((sampleFile) => {
            if (sampleFile.uploadedFile) {
                formData.append(sampleFile.key, sampleFile.uploadedFile);
            }
        });

        try {
            const response = await createSample(formData);
            if (response.status === 201) {
                navigate("/app/my-samples", {
                    state: {
                        notification: {
                            title: "Operação realizada.",
                            description: "A amostra foi cadastrada com sucesso!",
                            type: "success"
                        },
                    },
                });
                scrollToTop();
            }
        } catch (error) {
            console.error(error);
            setNotificationData({
                title: "Erro no servidor.",
                description: "Não foi possível cadastrar a amostra com as informações fornecidas.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    });
    useEffect(() => {
        const firstError = Object.values(errors)[0]?.message;
        if (firstError) {
            showErrorNotification(firstError as string);
        }
    }, [errors]);
    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: undefined })}
                title={notificationData.title}
                description={notificationData.description}
                type={notificationData.type}
            />


            <div className="container mx-auto">
                <header className="pb-5 pt-3">
                    <h2 className="heading-2 font-semibold text-gray-900 flex max-sm:flex-col gap-2 text-left max-sm:text-center max-sm:items-center">
                        <Text className="text-neutral-600 text-lg max-sm:text-[20px]">
                            Grupo selecionado:
                        </Text>
                        <Badge size={'1'} color="violet" radius='large' className="font-semibold w-fit">
                            <Icon.UsersThree weight="bold" size={25} className="text-violet-600" />
                            {groupSelected}
                        </Badge>
                    </h2>
                </header>

                <Form.Root
                    onSubmit={onSubmit}
                    className="mb-6  opacity-0 animate-fade-in animate-delay-100 animate-fill-forwards max-sm:w-full card-container p-4"
                >
                    <h3 className="text-left text-primary animate-fade-in animate-delay-200">
                        Detalhes da Amostra
                    </h3>

                    <Separator.Root className="my-6 h-px w-full bg-black animate-grow-width animate-delay-300" />


                    <div className="gap-4">
                        <div className="col-span-3 animate-fade-in animate-delay-300">
                            <InputField
                                label="TÍTULO DA PESQUISA"
                                required={true}
                                placeholder="Digite o título da pesquisa"
                                errorMessage={errors.researchTitle?.message}
                                {...register("researchTitle")}
                            />
                        </div>

                        <div className="col-span-3 animate-fade-in animate-delay-400">
                            <InputField
                                label="TÍTULO DA AMOSTRA"
                                required={true}
                                placeholder="Digite o título da amostra"
                                errorMessage={errors.sampleTitle?.message}
                                {...register("sampleTitle")}
                            />
                        </div>

                        <div className="col-span-3 md:flex gap-2 animate-fade-in animate-delay-500">
                            <InputField
                                label="CÓDIGO DO COMITÊ DE ÉTICA"
                                required={true}
                                placeholder="Digite o código fornecido pelo Comitê de Ética em Pesquisa"
                                errorMessage={errors.researchCep?.cepCode?.message}
                                {...register("researchCep.cepCode")}
                                className="flex-1"
                            />
                            <InputField
                                label="QUANTIDADE TOTAL DE PARTICIPANTES"
                                required={true}
                                placeholder="Digite a quantidade total de participantes da pesquisa"
                                errorMessage={errors.qttParticipantsRequested?.message}
                                type="number"
                                {...register("qttParticipantsRequested")}
                                className="flex-1"
                            />
                        </div>

                        <div className="md:col-span-2 md:flex lg:col-span-3 mb-4 gap-2 animate-fade-in animate-delay-600">
                            <SelectField
                                label="REGIÃO DA AMOSTRA"
                                required={true}
                                errorMessage={errors.countryRegion?.message}
                                {...register("countryRegion")}
                                className="md:flex-1 w-full md:w-auto mb-2"
                                defaultValue={""}
                            >
                                <option value="">Selecione uma região</option>
                                <option value="Norte">Norte</option>
                                <option value="Nordeste">Nordeste</option>
                                <option value="Centro-Oeste">Centro-Oeste</option>
                                <option value="Sudeste">Sudeste</option>
                                <option value="Sul">Sul</option>
                            </SelectField>

                            <InputField
                                label="ESTADO DA AMOSTRA"
                                required={true}
                                placeholder="Digite o estado dos participantes da amostra"
                                errorMessage={errors.countryState?.message}
                                {...register("countryState")}
                                className="flex-1"
                            />

                            <InputField
                                label="CIDADE DA AMOSTRA"
                                required={true}
                                placeholder="Digite a cidade dos participantes da amostra"
                                errorMessage={errors.countryCity?.message}
                                {...register("countryCity")}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="col-span-3 gap-2 animate-fade-in animate-delay-700">
                        <h3 className="text-left text-primary">Instituição da Amostra</h3>
                        <Separator.Root className="my-6 h-px w-full bg-black animate-grow-width" />

                        <div className="flex justify-center gap-2 max-lg:flex-col max-lg:mb-4">
                            <InputField
                                label="NOME"
                                required={true}
                                errorMessage={errors.instituition?.name?.message}
                                {...register("instituition.name")}
                            />

                            <SelectField
                                className2="w-[300px]"
                                label="TIPO"
                                required={true}
                                defaultValue=""
                                errorMessage={errors.instituition?.instType?.message}
                                {...register("instituition.instType")}
                            >
                                <option value="">Selecione</option>
                                <option>Pública</option>
                                <option>Particular</option>
                            </SelectField>
                        </div>
                    </div>

                    {/* CONTAINER TO UPLOAD FILES */}
                    <SampleUploadFile
                        messageError={sampleFileError}
                        sampleFiles={sampleFiles}
                        setSampleFiles={setSampleFiles}
                    />
                    <div className="text-sm text-gray-500 mt-5">
                        <span className="text-red-500">*</span> Campos obrigatórios
                    </div>
                    <Form.Submit asChild className="mt-10">
                        <Button
                            size="Medium"
                            loading={loading}
                            className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed mx-auto btn-primary max-sm:w-full`}
                            color={`${loading ? "white" : "green"}`}
                            title={"Enviar Solicitação"}
                            children={<Icon.FloppyDisk size={18} weight="bold" />}
                        />

                    </Form.Submit>

                </Form.Root>
            </div>
        </>
    );
};

export default CreateSamplePage;