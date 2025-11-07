import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { RegisterValues, detailsSchema } from "../../../../schemas/registerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { Button } from "../../../../components/Button/Button";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";


interface DetailsFormProps {
    handleOnSubmit: () => void;
    setStepData: (stepData: RegisterValues) => void;
    currentData: RegisterValues;

}

const DetailsForm = ({ handleOnSubmit, setStepData, currentData }: DetailsFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
    } = useForm({ resolver: yupResolver(detailsSchema), mode: "onChange" });

    const onSubmit = handleSubmit((stepData) => {
        setStepData({
            ...currentData,
            ...stepData,
        });
        handleOnSubmit();
    });
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 8, today.getMonth(), today.getDate());

    return (
        <Form.Root
            about="Form to provide personal details."
            onSubmit={onSubmit}
            className="mt-6 m-auto w-10/12 max-sm:w-full max-w-2xl"
        >
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar uma conta</h1>
                <h3 className="text-lg text-gray-600">Seus dados</h3>
            </div>

            <div className="space-y-2">
                <Form.Field name="personalData.fullName">
                    <Form.Label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                        Nome completo <span className="text-red-500">*</span>
                    </Form.Label>
                    <Form.Control
                        id="fullName"
                        placeholder="Insira seu nome completo"
                        autoComplete="name"
                        className="modern-input"
                        {...register("personalData.fullName")}
                    />
                    {errors?.personalData?.fullName && (
                        <Form.Message className="error-message mt-2">
                            {errors.personalData.fullName.message}
                        </Form.Message>
                    )}
                </Form.Field>

                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-3">
                    <Form.Field name="personalData.phone">
                        <Form.Label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                            Telefone <span className="text-red-500">*</span>
                        </Form.Label>

                        {/* Campo visual com máscara */}
                        <input
                            id="phoneDisplay"
                            placeholder="(00) 00000-0000"
                            autoComplete="tel"
                            className="modern-input"
                            onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                let value = target.value.replace(/\D/g, "");
                                value = value.substring(0, 11);

                                // Aplica máscara visual
                                let maskedValue = value;
                                if (value.length <= 10) {
                                    maskedValue = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
                                } else {
                                    maskedValue = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
                                }

                                target.value = maskedValue;

                                // Atualiza o campo real (hidden)
                                setValue("personalData.phone", value, {
                                    shouldValidate: true
                                });
                            }}
                        />

                        {/* Campo real (pode ser hidden) */}
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

                    <Form.Field name="personalData.birthDate">
                        <Form.Label htmlFor="birthDate" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                            Data de nascimento <span className="text-red-500">*</span>
                        </Form.Label>
                        <div className="relative">
                            <Flatpicker
                                id="birthDate"
                                placeholder="dd/mm/aaaa"
                                autoComplete="bday"
                                multiple={false}
                                onChange={([date]) => setValue("personalData.birthDate", date)}
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
                </div>

                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-3">
                    <Form.Field name="instituition">
                        <Form.Label htmlFor="instituition" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                            Instituição de trabalho <span className="text-red-500">*</span>
                        </Form.Label>
                        <Form.Control
                            id="instituition"
                            placeholder="Onde você trabalha?"
                            className="modern-input"
                            {...register("instituition")}
                        />
                        {errors?.instituition && (
                            <Form.Message className="error-message mt-2">{errors.instituition.message}</Form.Message>
                        )}
                    </Form.Field>

                    <Form.Field name="personalData.countryState">
                        <Form.Label htmlFor="countryState" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                            Estado <span className="text-red-500">*</span>
                        </Form.Label>
                        <div className="relative">
                            <select
                                id="countryState"
                                {...register("personalData.countryState")}
                                className="modern-select"
                            >
                                <option value="">Selecione seu estado</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors?.personalData?.countryState && (
                            <Form.Message className="error-message mt-2">
                                {errors.personalData.countryState.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                </div>

                <div className="pt-4">
                    <Button
                        size="Full"
                        className="w-full modern-button disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        title={"Continuar"}
                        color={"green"}
                    />
                </div>

                <div className="text-center space-y-4 pt-4">
                    <div className="text-sm text-gray-500">
                        <span className="text-red-500">*</span> Campos obrigatórios
                    </div>
                    <div className="text-md">
                        <Link
                            to="/"
                            className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                        >
                            Já tenho uma conta...
                        </Link>
                    </div>
                </div>
            </div>
        </Form.Root >
    );
};

export default DetailsForm;
