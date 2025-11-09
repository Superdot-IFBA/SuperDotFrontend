import * as Form from "@radix-ui/react-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SelectField } from "../../SelectField/SelectField";
import { TextAreaField } from "../../TextAreaField/TextAreaField";
import { createReview } from "../../../api/sampleReview.api";
import { InputField } from "../../InputField/InputField";
import { SampleStatus } from "../../../utils/consts.utils";
import { SampleSummary } from "../../../api/sample.api";
import { Button } from "../../Button/Button";
import { Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import * as Icon from "@phosphor-icons/react";

interface SampleReviewFormProps {
    sample?: SampleSummary;
    onFinish: () => void;
}

type ReviewValues = {
    sampleId: string;
    nextStatus: SampleStatus;
    qttParticipantsAuthorized: number;
    reviewMessage: string;
};

const SampleReviewForm = ({ sample, onFinish }: SampleReviewFormProps) => {
    const [loading, setLoading] = useState(false);

    if (!sample) return null;

    const sampleReviewFormSchema = yup.object({
        nextStatus: yup
            .string()
            .notOneOf([sample?.currentStatus], "Não é possível modificar este status, pois ele já está definido como o atual.")
            .required(),
        qttParticipantsAuthorized: yup
            .number()
            .when('nextStatus', {
                is: "Autorizado",
                then: (schema) => schema
                    .required("Por favor, informe a quantidade de participantes autorizados.")
                    .max(
                        sample?.qttParticipantsRequested || 0,
                        "A quantidade de participantes autorizados precisa ser menor ou igual a quantidade de participantes solicitados."
                    ),
                otherwise: (schema) => schema.default(0)
            }),
        reviewMessage: yup.string().required("Por favor, insira uma mensagem de revisão."),
    });

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(sampleReviewFormSchema),
        defaultValues: { qttParticipantsAuthorized: sample?.qttParticipantsRequested || 0 }
    });
    const watchStatusChange = watch("nextStatus");



    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const payload: ReviewValues = {
                sampleId: sample?.sampleId || "",
                nextStatus: data.nextStatus as "Pendente" | "Autorizado" | "Não Autorizado",
                qttParticipantsAuthorized:
                    watchStatusChange !== "Autorizado" ? 0 : data.qttParticipantsAuthorized ?? 0,
                reviewMessage: data.reviewMessage,
            };

            const response = await createReview(payload);
            if (response.status === 200) {
                onFinish();
                return;
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        let message = "";
        if (watchStatusChange === "Autorizado") {
            message = "Prezado(a) Pesquisador(a), Esperamos que esta mensagem o(a) encontre bem. Informamos que uma nova pesquisa foi liberada e já está disponível para o seu preenchimento na plataforma. Sua participação é essencial para o avanço dos nossos estudos e contribui significativamente para a qualidade dos resultados obtidos. Caso tenha dúvidas ou precise de suporte, não hesite em nos contatar. Agradecemos desde já pela sua colaboração! Atenciosamente, a equipe de pesquisa.";
        } else if (watchStatusChange === "Não Autorizado") {
            message = "Prezado(a) Pesquisador(a), Informamos que, após análise, sua pesquisa foi classificada como “Não Autorizada”. Essa decisão foi tomada com base nos critérios de avaliação definidos pela equipe responsável. Recomendamos que revise as informações e, caso julgue necessário, realize as adequações pertinentes antes de submeter novamente o estudo para nova apreciação. Se desejar mais detalhes sobre o motivo da não autorização ou precisar de orientações para ajustar a pesquisa, nossa equipe está à disposição para auxiliá-lo(a). Agradecemos pela compreensão e pelo comprometimento com o processo de pesquisa. Atenciosamente, a equipe de pesquisa.";
        } else {
            message = "Informamos que o status da sua pesquisa foi revertido para “Pendente”. Essa atualização foi realizada para possibilitar eventuais ajustes ou complementações necessárias antes da nova análise. Por favor, revise as informações inseridas e realize as correções solicitadas, se houver. Após a atualização, a pesquisa poderá ser reenviada para avaliação. Caso precise de orientações ou tenha alguma dúvida sobre o motivo da reversão, nossa equipe está à disposição para auxiliá-lo(a). Agradecemos pela sua atenção e colaboração. Atenciosamente, a equipe de pesquisa.";
        }
        setValue("reviewMessage", message);
    }, [watchStatusChange, setValue]);

    return (
        <Form.Root onSubmit={onSubmit}>
            <>
                <Flex direction="column" className="gap-3">
                    <SelectField
                        defaultValue={sample?.currentStatus}
                        errorMessage={errors?.nextStatus?.message}
                        label="Status da amostra"
                        {...register("nextStatus")}
                    >
                        <option>Pendente</option>
                        <option>Autorizado</option>
                        <option>Não Autorizado</option>
                    </SelectField>

                    <InputField
                        errorMessage={errors?.qttParticipantsAuthorized?.message}
                        disabled={watchStatusChange !== "Autorizado"}
                        label="Quantidade de participantes autorizados"
                        type="number"
                        defaultValue={sample?.qttParticipantsRequested}
                        {...register("qttParticipantsAuthorized", {
                            valueAsNumber: true,
                        })}
                    />

                    <TextAreaField
                        className="border-2 border-stone-200"
                        placeholder="Insira uma mensagem que será enviada para o e-mail do pesquisador"
                        errorMessage={errors?.reviewMessage?.message}
                        label="Mensagem de revisão"
                        {...register("reviewMessage")}
                    />
                </Flex>
                <Form.Submit asChild>
                    <Button loading={loading} className="w-full" title={"Salvar alterações"} color={"green"} size={"Medium"} children={<Icon.FloppyDisk size={18} weight="bold" />}></Button>
                </Form.Submit>
            </>
        </Form.Root>
    );
};

export default SampleReviewForm;
