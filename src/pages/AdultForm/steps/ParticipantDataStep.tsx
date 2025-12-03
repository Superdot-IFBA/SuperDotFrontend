import * as Form from "@radix-ui/react-form";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { InputField } from "../../../components/InputField/InputField";
import { SelectField } from "../../../components/SelectField/SelectField";
import { ParticipantDataDTO, participantDataSchema } from "../../../schemas/adultForm/participantData.schema";
import {
    DEVICES_ARRAY,
    EDUCATION_LEVEL_ARRAY,
    GENDER_ARRAY,
    INCOME_LEVELS_ARRAY,
    MARITAL_STATUS_ARRAY,
} from "../../../utils/consts.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { putSubmitParticipantData } from "../../../api/participant.api";
import Select from "react-select";
import { IParticipant } from "../../../interfaces/participant.interface";
import { Button } from "../../../components/Button/Button";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import * as Icon from "@phosphor-icons/react";
import { NotificationType } from "../../../components/Notify/Notify";
interface ParticipantDataStepProps {
    nextStep: () => void;
    setFormData: (formData: IParticipant) => void;
    setNotificationData: (data: { title: string; description: string; type: NotificationType }) => void;
    formData?: IParticipant;
    sampleId: string;
    header: string;
}

/* This step will collect the personal, family, and address data from participant. */
const ParticipantDataStep = ({
    nextStep,
    setFormData,
    formData,
    setNotificationData,
    sampleId,
    header,
}: ParticipantDataStepProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        formState,
    } = useForm({
        resolver: yupResolver(participantDataSchema),
        defaultValues: formData,
        mode: "onChange",
    });

    const [loading, setLoading] = useState(false);


    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };

    const onSubmit = handleSubmit(async (participantData: ParticipantDataDTO) => {
        setLoading(true);
        try {
            const response = await putSubmitParticipantData({ sampleId, participantData });
            if (response.status === 200) {
                if (formData) {
                    setFormData({
                        ...formData,
                        ...participantData,
                    });
                } else {
                    setFormData(participantData);
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

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 8, today.getMonth(), today.getDate());

    return (
        <Flex direction={"column"} className="rt-Flex rt-r-fd-column bg-white gap-y-5  max-sm:p-0  relative w-[100%]  m-auto rounded-2xl p-5">
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
                    <SelectField
                        {...register("personalData.maritalStatus")}
                        label="Estado civil"
                        required={true}
                        placeholder="Selecione uma opção"
                        errorMessage={errors.personalData?.maritalStatus?.message}
                    >
                        {MARITAL_STATUS_ARRAY.map((maritalStatus) => (
                            <option key={maritalStatus}>{maritalStatus}</option>
                        ))}
                    </SelectField>
                    <InputField
                        {...register("personalData.job")}
                        label="Profissão"
                        required={true}
                        placeholder="Qual a sua profissão?"
                        errorMessage={errors.personalData?.job?.message}
                    />
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
                        {...register("personalData.gender")}
                        label="Sexo"
                        required={true}
                        placeholder="Selecione uma opção"
                        errorMessage={errors.personalData?.gender?.message}
                    >
                        {GENDER_ARRAY.map((gender) => (
                            <option key={gender}>{gender}</option>
                        ))}
                    </SelectField>

                    <Form.Field name="personalData.birthDate" className="w-full">
                        <Form.Label
                            htmlFor="birthDate"
                            className="block text-sm font-semibold text-gray-800 mb-2 text-left"
                        >
                            Data de nascimento <span className="text-red-500">*</span>
                        </Form.Label>

                        <div className="relative">
                            <Flatpicker
                                id="birthDate"
                                placeholder="dd/mm/aaaa"
                                autoComplete="bday"
                                multiple={false}
                                className="modern-input"
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
                                        instance._input.removeAttribute("readonly");

                                        instance._input.addEventListener("input", function (e: Event) {
                                            const target = e.target as HTMLInputElement;
                                            let value = target.value.replace(/\D/g, "");

                                            if (value.length > 2) {
                                                value = value.substring(0, 2) + "/" + value.substring(2);
                                            }
                                            if (value.length > 5) {
                                                value = value.substring(0, 5) + "/" + value.substring(5, 9);
                                            }

                                            target.value = value;
                                        });
                                    },
                                }}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    const value = e.target.value;

                                    if (value.length === 10) {
                                        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

                                        if (regex.test(value)) {
                                            const [day, month, year] = value.split("/").map(Number);
                                            const date = new Date(year, month - 1, day);

                                            const isValid =
                                                date.getDate() === day &&
                                                date.getMonth() === month - 1 &&
                                                date.getFullYear() === year;

                                            if (isValid && date <= minDate) {
                                                setValue("personalData.birthDate", date);
                                            }
                                        }
                                    }
                                }}
                            />

                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {errors.personalData?.birthDate?.message && (
                            <Form.Message className="error-message mt-2">
                                {errors.personalData.birthDate.message}
                            </Form.Message>
                        )}
                    </Form.Field>

                    <InputField
                        {...register("familyData.qttChildrens")}
                        label="Número de filhos"
                        required={true}
                        type="number"
                        placeholder="Quantos filhos você tem?"
                        errorMessage={errors.familyData?.qttChildrens?.message}
                    />
                    <InputField
                        {...register("familyData.qttSiblings")}
                        label="Número de irmãos/irmãs"
                        required={true}
                        placeholder="Quantos irmãos ou irmãs você tem?"
                        type="number"
                        errorMessage={errors.familyData?.qttSiblings?.message}
                    />
                    <SelectField
                        {...register("familyData.qttFamilyMembers")}
                        label="Quantas pessoas moram com você?"
                        required={true}
                        placeholder="Selecione uma opção"
                        errorMessage={errors.familyData?.qttFamilyMembers?.message}
                    >
                        {[...Array(8).keys()].map((i) => (
                            <option key={i}>{i}</option>
                        ))}
                        <option key={9}>+ de 8</option>
                    </SelectField>
                    <SelectField
                        {...register("familyData.familyMonthIncome")}
                        label="Renda familiar total mensal"
                        required={true}
                        placeholder="selecione uma opção"
                        errorMessage={errors.familyData?.familyMonthIncome?.message}
                    >
                        {INCOME_LEVELS_ARRAY.map((income) => (
                            <option key={income}>{income}</option>
                        ))}
                    </SelectField>

                    <Form.Field name="personalData.houseDevices" className="w-full">
                        <Form.Label className="block text-left text-xs font-bold uppercase tracking-wide mb-2">
                            Aparelhos na casa
                        </Form.Label>
                        <Select
                            onChange={(options) =>
                                setValue(
                                    "familyData.outsideHouseDevices",
                                    [...options].map((option) => option.value)
                                )
                            }
                            isMulti
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    minHeight: '40px',
                                    height: '40px',
                                    overflowY: 'auto',
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    flexWrap: 'nowrap',
                                    overflowX: 'auto',
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    fontSize: '14px',
                                })
                            }}
                            options={DEVICES_ARRAY.map((device) => {
                                return { value: device, label: device };
                            })}
                            className="text-black"
                            placeholder="Selecione uma ou várias opções"
                        />

                    </Form.Field>
                    <Form.Field name="personalData.outsideHouseDevices" className="w-full">
                        <Form.Label className="block text-left text-xs font-bold uppercase tracking-wide mb-2">
                            Fora de casa, você tem acesso a
                        </Form.Label>
                        <Select
                            onChange={(options) =>
                                setValue(
                                    "familyData.houseDevices",
                                    [...options].map((option) => option.value)
                                )
                            }
                            options={DEVICES_ARRAY.map((device) => {
                                return { value: device, label: device };
                            })}
                            isMulti
                            className="text-black !h-10"
                            placeholder="Selecione uma ou várias opções"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    minHeight: '40px',
                                    height: '40px',
                                    overflowY: 'auto',
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    flexWrap: 'nowrap',
                                    overflowX: 'auto',
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    fontSize: '14px',
                                })
                            }}
                        />

                    </Form.Field>
                    <InputField
                        {...register("addressData.city")}
                        label="Cidade"
                        required={true}
                        placeholder="Informe o nome da sua cidade"
                        errorMessage={errors.addressData?.city?.message}
                    />
                    <InputField
                        {...register("addressData.district")}
                        label="Bairro"
                        required={true}
                        placeholder="Informe o nome do seu bairro"
                        errorMessage={errors.addressData?.district?.message}
                    />
                    <InputField
                        {...register("addressData.street")}
                        label="Rua"
                        required={true}
                        placeholder="Informe o nome da sua rua"
                        errorMessage={errors.addressData?.street?.message}
                    />
                    <InputField
                        {...register("addressData.houseNumber")}
                        label="Número da casa"
                        required={true}
                        placeholder="informe o número da casa"
                        errorMessage={errors.addressData?.houseNumber?.message}
                    />
                </div>
                <div className="text-sm text-gray-500 mt-3">
                    <span className="text-red-500">*</span> Campos obrigatórios
                </div>
                <div className="flex justify-center gap-6 mt-6">

                    <Button
                        loading={loading}
                        size="Medium"
                        className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                        title={"Salvar alterações"}
                        color={`${formState.isValid ? "green" : "gray"}`}
                        type="submit"
                        disabled={!formState.isValid}
                        children={<Icon.FloppyDisk size={18} weight="bold" />}
                    />
                </div>
            </Form.Root>
        </Flex>
    );
};

export default ParticipantDataStep;
