import * as Form from "@radix-ui/react-form";
import { FormEvent, useState } from "react";
import { InputField } from "../InputField/InputField";
import isEmail from "validator/lib/isEmail";
import { DeepPartial } from "react-hook-form";
import { IParticipant } from "../../interfaces/participant.interface";
import { postAddParticipants } from "../../api/sample.api";
import { DataList, IconButton, Separator, Table } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { NotificationType } from "../Notify/Notify";
interface ParticipantsIndicationFormProps {
    setNotificationData: (data: { title: string; description: string; type: NotificationType }) => void;
    onFinish: (participants: IParticipant[]) => void;
    sampleId: string;
}

const ParticipantsIndicationForm = ({
    setNotificationData,
    onFinish,
    sampleId,
}: ParticipantsIndicationFormProps) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [participants, setParticipants] = useState([] as DeepPartial<IParticipant>[]);
    const [errors, setErrors] = useState<{ fullName?: string; email?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);

    const validateFields = () => {
        const newErrors: { fullName?: string; email?: string; general?: string } = {};

        if (!fullName.trim()) newErrors.fullName = "Informe o nome completo.";
        if (!email.trim()) newErrors.email = "Informe o e-mail do participante.";
        else if (!isEmail(email)) newErrors.email = "Informe um e-mail válido.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleAddPeople = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (!validateFields()) return;

        const alreadyAdded = participants.find(
            (p) => p.personalData?.email?.toLowerCase() === email.toLowerCase()
        );

        if (alreadyAdded) {
            setErrors({ general: "Essa pessoa já foi indicada." });
            return;
        }

        setParticipants((prev) => [
            ...prev,
            {
                personalData: { fullName, email },
            },
        ]);

        setFullName("");
        setEmail("");
        setErrors({});
    };

    const handleDeleteParticipantIndicated = (email: string) => {
        const filtered = participants.filter(
            (p) => p.personalData?.email?.toLowerCase() !== email.toLowerCase()
        );
        setParticipants(filtered);
    };

    const onSubmit = async () => {
        if (participants.length === 0) {
            const newErrors: { fullName?: string; email?: string; general?: string } = {};

            if (!fullName.trim()) newErrors.fullName = "Informe o nome completo.";
            if (!email.trim()) newErrors.email = "Informe o e-mail do participante.";
            else if (!isEmail(email)) newErrors.email = "Informe um e-mail válido.";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            setErrors({
                general: "Adicione o participante antes de salvar.",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await postAddParticipants({ sampleId, participants });

            if (response.status === 201) {
                setNotificationData({
                    title: "Indicações concluídas",
                    description:
                        "Obrigado por indicar os participantes. As indicações foram registradas com sucesso.",
                    type: "success",
                });
                onFinish(participants as IParticipant[]);
            }
        } catch (err: any) {
            console.error(err);

            if (err?.response?.status === 409) {
                setErrors({ general: "Uma ou mais pessoas já foram indicadas anteriormente." });
            } else {
                setNotificationData({
                    title: "Erro ao salvar",
                    description:
                        "Ocorreu um erro ao registrar as indicações. Tente novamente mais tarde.",
                    type: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <Form.Root onSubmit={handleAddPeople}>
            <div className="md:flex gap-2">
                <div className="w-full">
                    <InputField
                        name="fullName"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);

                            if (errors.fullName && e.target.value.trim() !== "") {
                                setErrors((prev) => ({ ...prev, fullName: undefined }));
                            }
                        }}
                        label="Nome completo"
                        placeholder="Informe o nome do participante"
                    />
                    {(participants?.length || 0) === 0 && errors.fullName && (
                        <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                    )}

                </div>

                <div className="w-full">
                    <InputField
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);

                            if (errors.email && e.target.value.trim() !== "") {
                                setErrors((prev) => ({ ...prev, email: undefined }));
                            }
                        }}
                        label="E-mail"
                        placeholder="Informe o e-mail do participante"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
            </div>

            {errors.general && (
                <p className="text-red-600 text-sm mt-2">{errors.general}</p>
            )}

            {(participants?.length || 0) > 0 && (
                <>
                    <Table.Root variant="surface" className="w-full mt-3 desktop">
                        <Table.Header className="text-[16px]">
                            <Table.Row align="center" className="text-center">
                                <Table.ColumnHeaderCell className="border-l">Nome</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l">E-mail</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l">Remover</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {participants.map((p) => (
                                <Table.Row align="center" key={p.personalData?.email}>
                                    <Table.Cell>{p.personalData?.fullName}</Table.Cell>
                                    <Table.Cell>{p.personalData?.email}</Table.Cell>
                                    <Table.Cell>
                                        <IconButton
                                            onClick={() =>
                                                handleDeleteParticipantIndicated(p.personalData?.email as string)
                                            }
                                            color="red"
                                            size="2"
                                            variant="soft"
                                            radius="full"
                                        >
                                            <Icon.Trash size={20} weight="bold" />
                                        </IconButton>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>

                    <div className="mobo">
                        <DataList.Root orientation="vertical" className="!font-roboto">
                            <DataList.Item>
                                <p className="text-[16px] font-bold text-center border-b-black mt-5">
                                    Informações do participante
                                </p>
                                {participants.map((p) => (
                                    <div
                                        key={p.personalData?.email}
                                        className="w-full p-2 rounded-lg mb-5 border-2 card-container"
                                    >
                                        <DataList.Label minWidth="88px">Nome</DataList.Label>
                                        <DataList.Value>{p.personalData?.fullName}</DataList.Value>
                                        <Separator size="4" className="mb-2 mt-2" />

                                        <DataList.Label minWidth="88px">E-mail</DataList.Label>
                                        <DataList.Value>{p.personalData?.email}</DataList.Value>
                                        <Separator size="4" className="mb-2 mt-2" />

                                        <DataList.Label
                                            color="red"
                                            onClick={() =>
                                                handleDeleteParticipantIndicated(p.personalData?.email as string)
                                            }
                                            className="flex justify-center mb-2 border border-red-300 cursor-pointer hover:bg-red-100 rounded-md"
                                        >
                                            Remover
                                        </DataList.Label>
                                    </div>
                                ))}
                            </DataList.Item>
                        </DataList.Root>
                    </div>
                </>
            )}

            <div className="flex justify-between mt-5 gap-2">
                <Form.Submit asChild>
                    <Button
                        size="Small"
                        className="hover:cursor-pointer"
                        title="Adicionar"
                        color="primary"
                    >
                        <Icon.PlusCircle size={18} weight="bold" />
                    </Button>
                </Form.Submit>

                <Button
                    loading={loading}
                    type="button"
                    size="Small"
                    className="disabled:hover:cursor-not-allowed"
                    color="green"
                    onClick={onSubmit}
                    title="Salvar alterações"
                >
                    <Icon.FloppyDisk size={18} weight="bold" />
                </Button>
            </div>

        </Form.Root>
    );
};

export default ParticipantsIndicationForm;
