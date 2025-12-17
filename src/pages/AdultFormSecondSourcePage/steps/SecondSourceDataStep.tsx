import * as Form from "@radix-ui/react-form";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { InputField } from "../../../components/InputField/InputField";
import { SelectField } from "../../../components/SelectField/SelectField";
import { EDUCATION_LEVEL_ARRAY, RELATIONSHIPS_ARRAY, RELATIONSHIP_TIME_ARRAY } from "../../../utils/consts.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SecondSourceDTO, secondSourceDataSchema } from "../../../schemas/adultForm/secondSourceData.schema";
import { putSubmitSecondSourceData } from "../../../api/secondSource.api";
import { ISecondSource } from "../../../interfaces/secondSource.interface";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import * as Icon from "@phosphor-icons/react";

import { Button } from "../../../components/Button/Button";
import { useState } from "react";
import { NotificationType } from "../../../components/Notify/Notify";

interface SecondSourceDataStepProps {
    formData?: ISecondSource;
    setFormData: (formData: ISecondSource) => void;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string, type: NotificationType }) => void;
    sampleId: string;
    header: string;
}

const SecondSourceDataStep = ({
    formData,
    setFormData,
    nextStep,
    setNotificationData,
    sampleId,
    header
}: SecondSourceDataStepProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(secondSourceDataSchema),
        defaultValues: formData,
        mode: "onChange",
    });
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 8, today.getMonth(), today.getDate());
    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };

    const onSubmit = handleSubmit(async (secondSourceData: SecondSourceDTO) => {
        setLoading(true);
        try {
            const response = await putSubmitSecondSourceData({ sampleId, secondSourceData });
            if (response.status === 200) {
                if (formData) {
                    setFormData({
                        ...formData,
                        ...secondSourceData,
                    });
                } else {
                    setFormData(secondSourceData);
                }
                nextStep();
                scrollToTop();
            }
        } catch (e: any) {
            console.error(e);
            setNotificationData({
                title: "Preenchimento inválido!",
                description: "Preencha todos os campos corretamente.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    });

    return (
        <div className="rt-Flex rt-r-fd-column bg-white gap-y-5  max-sm:p-0  relative w-[100%]  m-auto rounded-2xl p-5">
            <header className="text-primary">
                <h3 className="text-xl max-sm:text-lg md:text-xl lg:text-2xl font-bold">
                    {header}
                </h3>

            </header>
            <Form.Root onSubmit={onSubmit} className="w-full">
                <div className="grid grid-cols-1 gap-y-5  gap-3 ">
                    <InputField
                        {...register("personalData.fullName")}
                        label="Nome completo"
                        required={true}
                        placeholder="Insira seu nome completo"
                        errorMessage={errors.personalData?.fullName?.message}
                    />
                    <Form.Field name="personalData.phone">
                        <Form.Label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                            Telefone <span className="text-red-500">*</span>
                        </Form.Label>

                        <input
                            id="phoneDisplay"
                            placeholder="(00) 00000-0000"
                            autoComplete="tel"
                            className="modern-input"
                            onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                let value = target.value.replace(/\D/g, "");
                                value = value.substring(0, 11);

                                let maskedValue = value;
                                if (value.length <= 10) {
                                    maskedValue = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
                                } else {
                                    maskedValue = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
                                }

                                target.value = maskedValue;

                                setValue("personalData.phone", value, {
                                    shouldValidate: true
                                });
                            }}
                        />

                        <Form.Control
                            type="hidden"
                            {...register("personalData.phone", {
                                required: "Telefone é obrigatório",
                                validate: {
                                    validPhone: (value) => {
                                        if (!value) return "Telefone é obrigatório";
                                        return value.length >= 10 || "Telefone deve ter pelo menos 10 dígitos";
                                    }
                                }
                            })}
                        />

                        {errors?.personalData?.phone && (
                            <Form.Message className="error-message mt-2">
                                {errors.personalData.phone.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                    <InputField
                        {...register("personalData.job")}
                        label="Profissão"
                        required={true}
                        placeholder="Qual a sua profissão?"
                        errorMessage={errors.personalData?.job?.message}
                    />
                    <Form.Field name="birthDate">
                        <Form.Label htmlFor="birthDate" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                            Data de nascimento <span className="text-red-500">*</span>
                        </Form.Label>
                        <div className="relative">
                            <Flatpicker
                                id="birthDate"
                                placeholder="dd/mm/aaaa"
                                autoComplete="bday"
                                multiple={false}
                                onChange={([date]) => {
                                    setValue("personalData.birthDate", date, { shouldValidate: true });
                                }}
                                options={{
                                    dateFormat: "d/m/Y",
                                    maxDate: minDate,
                                    locale: Portuguese,
                                    allowInput: true,
                                    clickOpens: true,
                                    onReady: (selectedDates, dateStr, instance) => {
                                        instance._input.removeAttribute('readonly');

                                        instance._input.addEventListener('input', function (e: Event) {
                                            const target = e.target as HTMLInputElement;
                                            let value = target.value.replace(/\D/g, '');

                                            if (value.length > 2) {
                                                value = value.substring(0, 2) + '/' + value.substring(2);
                                            }
                                            if (value.length > 5) {
                                                value = value.substring(0, 5) + '/' + value.substring(5, 9);
                                            }

                                            target.value = value;
                                        });
                                    },
                                }}
                                className="modern-input"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    const value = e.target.value;
                                    if (value.length === 10) {
                                        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                                        if (regex.test(value)) {
                                            const [day, month, year] = value.split('/').map(Number);
                                            const date = new Date(year, month - 1, day);

                                            if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
                                                if (date <= minDate) {
                                                    setValue("personalData.birthDate", date);
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        {errors?.personalData?.birthDate && (
                            <Form.Message className="error-message mt-2">
                                {errors.personalData.birthDate.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                    <SelectField
                        {...register("personalData.educationLevel")}
                        label="Grau de instrução"
                        required={true}
                        placeholder="Selecione uma opção"
                        errorMessage={errors.personalData?.educationLevel?.message}
                    >
                        {EDUCATION_LEVEL_ARRAY.map((educationLevel) => (
                            <option key={educationLevel}>{educationLevel}</option>
                        ))}
                    </SelectField>
                    <SelectField
                        {...register("personalData.relationship")}
                        label="Relação com o avaliado"
                        required={true}
                        placeholder="Selecione uma opção"
                        errorMessage={errors.personalData?.relationship?.message}
                    >
                        {RELATIONSHIPS_ARRAY.map((relationship) => (
                            <option key={relationship}>{relationship}</option>
                        ))}
                    </SelectField>
                    <SelectField
                        {...register("personalData.relationshipTime")}
                        label="Conhece o avaliado a quanto tempo?"
                        required={true}
                        placeholder="Selecione uma opção"
                        errorMessage={errors.personalData?.relationshipTime?.message}
                    >
                        {RELATIONSHIP_TIME_ARRAY.map((relationshipTime) => (
                            <option key={relationshipTime}>{relationshipTime}</option>
                        ))}
                    </SelectField>
                    <InputField
                        {...register("personalData.countryCity")}
                        label="Cidade"
                        required={true}
                        placeholder="Informe o nome da sua cidade"
                        errorMessage={errors.personalData?.countryCity?.message}
                    />
                    <InputField
                        {...register("personalData.district")}
                        label="Bairro"
                        required={true}
                        placeholder="Informe o nome do seu bairro"
                        errorMessage={errors.personalData?.district?.message}
                    />
                    <InputField
                        {...register("personalData.street")}
                        label="Logradouro"
                        required={true}
                        placeholder="Informe o nome do seu logradouro"
                        errorMessage={errors.personalData?.street?.message}
                    />
                </div>
                <div className="text-sm text-gray-500 mt-3">
                    <span className="text-red-500">*</span> Campos obrigatórios
                </div>
                <div className="flex justify-center gap-6 mt-6">

                    <Form.Submit asChild>
                        <Button
                            loading={loading}
                            size="Medium"
                            className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                            title={"Salvar alterações"}
                            color={`${isValid ? "green" : "gray"}`}
                            type="submit"
                            disabled={!isValid}
                            children={<Icon.FloppyDisk size={18} weight="bold" />}
                        />
                    </Form.Submit>
                </div>
            </Form.Root>
        </div>
    );
};

export default SecondSourceDataStep;
