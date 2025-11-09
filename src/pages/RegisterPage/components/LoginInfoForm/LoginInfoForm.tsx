import * as Form from "@radix-ui/react-form";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useForm } from "react-hook-form";
import * as Icon from "@phosphor-icons/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterValues, loginInfoSchema } from "../../../../schemas/registerSchema";
import { useState } from "react";
import { Button } from "../../../../components/Button/Button";
import { PasswordValidationCard } from "../../../../components/PasswordValidate/PasswordValidate";

interface LoginInfoProps {
    handleOnSubmit: (data: RegisterValues) => void;
    handleOnClickPreviousStep: () => void;
    setStepData: (stepData: RegisterValues) => void;
    currentData: RegisterValues;
    loading: boolean;
}

const LoginInfoForm = ({
    handleOnSubmit,
    handleOnClickPreviousStep,
    setStepData,
    currentData,
    loading,
}: LoginInfoProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(loginInfoSchema),
        mode: "onChange",
    });
    const [errorUseTerm, setErrorUseTerm] = useState("");
    const [useTermChecked, setUseTermChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [newPassword, setNewPassword] = useState("");



    const onSubmit = handleSubmit((stepData) => {
        setErrorUseTerm("");
        if (!useTermChecked) {
            setErrorUseTerm("É obrigatório aceitar o termo de uso.");
            return;
        }

        const newRegisterData = {
            ...currentData,
            ...stepData,
            acceptUseTerm: useTermChecked,
        };
        setStepData(newRegisterData);
        handleOnSubmit(newRegisterData);
    });

    const handleCheckUseTerm = (checked: boolean | "indeterminate") => {
        if (typeof checked === "boolean") setUseTermChecked(checked);
    };

    return (
        <Form.Root
            about="Form to provide login info."
            onSubmit={onSubmit}
            className="mt-6 m-auto w-10/12 max-sm:w-full max-w-2xl"
        >
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar uma conta</h1>
                <h3 className="text-lg text-gray-600">Seus dados de acesso</h3>
            </div>

            <div className="space-y-2 ">
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-3">
                    <Form.Field name="email">
                        <Form.Label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800 mb-2 text-left"
                        >
                            E-mail <span className="text-red-500">*</span>
                        </Form.Label>
                        <Form.Control
                            id="email"
                            type="email"
                            placeholder="Insira seu e-mail"
                            autoComplete="email"
                            className="modern-input"
                            {...register("email")}
                        />
                        {errors?.email && (
                            <Form.Message className="error-message mt-2">
                                {errors.email.message}
                            </Form.Message>
                        )}
                    </Form.Field>

                    <Form.Field name="emailConfirmation">
                        <Form.Label
                            htmlFor="emailConfirmation"
                            className="block text-sm font-semibold text-gray-800 mb-2 text-left"
                        >
                            Confirmar e-mail <span className="text-red-500">*</span>
                        </Form.Label>
                        <Form.Control
                            id="emailConfirmation"
                            type="email"
                            placeholder="Repita seu e-mail"
                            autoComplete="off"
                            className="modern-input"
                            {...register("emailConfirmation")}
                        />
                        {errors?.emailConfirmation && (
                            <Form.Message className="error-message mt-2">
                                {errors.emailConfirmation.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                </div>

                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-3">
                    <Form.Field name="password">
                        <Form.Label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800 mb-2 text-left"
                        >
                            Senha <span className="text-red-500">*</span>
                        </Form.Label>

                        <div className="relative">
                            <Form.Control
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Crie uma senha"
                                autoComplete="new-password"
                                className="modern-input pr-10"
                                {...register("password")}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            >
                                {showPassword ? <Icon.Eye /> : <Icon.EyeSlash />}
                            </button>
                        </div>



                        {errors?.password && (
                            <Form.Message className="error-message mt-2">
                                {errors.password.message}
                            </Form.Message>
                        )}
                    </Form.Field>

                    <Form.Field name="passwordConfirmation">
                        <Form.Label
                            htmlFor="passwordConfirmation"
                            className="block text-sm font-semibold text-gray-800 mb-2 text-left"
                        >
                            Confirmar senha <span className="text-red-500">*</span>
                        </Form.Label>
                        <div className="relative">
                            <Form.Control
                                id="passwordConfirmation"
                                type={showPasswordConfirmation ? "text" : "password"}
                                placeholder="Repita sua senha"
                                className="modern-input pr-10"
                                {...register("passwordConfirmation")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            >
                                {showPasswordConfirmation ? <Icon.Eye /> : <Icon.EyeSlash />}
                            </button>
                        </div>
                        {errors?.passwordConfirmation && (
                            <Form.Message className="error-message mt-2">
                                {errors.passwordConfirmation.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                </div>
                <div
                    className={`transition-all duration-500 ease-out overflow-hidden ${newPassword ? "opacity-100 max-h-96 translate-y-0" : "opacity-0 max-h-0 -translate-y-2"
                        }`}
                >
                    <PasswordValidationCard password={newPassword} />
                </div>
                <Form.Field name="acceptUseTerm" className="pt-2">
                    <div className="flex items-start gap-3 text-left">
                        <Checkbox.Root
                            id="acceptUseTerm"
                            onCheckedChange={handleCheckUseTerm}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm hover:border-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                        >
                            <Checkbox.Indicator className="text-green-600">
                                <Icon.Check className="h-4 w-4" />
                            </Checkbox.Indicator>
                        </Checkbox.Root>

                        <label
                            htmlFor="acceptUseTerm"
                            className="text-xs text-gray-800 leading-relaxed cursor-pointer select-none text-justify"
                        >
                            Estou ciente de que as estatísticas das pesquisas realizadas poderão ser acessadas
                            publicamente, em conformidade com a
                            <strong> Lei Geral de Proteção de Dados (LGPD)</strong>, com o propósito de subsidiar
                            políticas públicas voltadas à população com altas habilidades/superdotação, e de
                            contribuir para o aprimoramento dos dados do
                            <strong> Censo Escolar brasileiro</strong>.
                        </label>
                    </div>

                    {errorUseTerm && (
                        <Form.Message className="error-message mt-3">
                            {errorUseTerm}
                        </Form.Message>
                    )}
                </Form.Field>

                <div className="pt-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-3">
                    <Button
                        onClick={handleOnClickPreviousStep}
                        type="button"
                        title="Voltar"
                        color="gray"
                        size="Full"
                        className="w-full modern-button"
                    />
                    <Button
                        title="Concluir"
                        color={"green"}
                        size="Full"
                        className="w-full modern-button disabled:bg-gray-400 disabled:cursor-not-allowed"
                        loading={loading}
                    />
                </div>

                <div className="text-center space-y-4 pt-4">
                    <div className="text-sm text-gray-500">
                        <span className="text-red-500">*</span> Campos obrigatórios
                    </div>
                </div>
            </div>
        </Form.Root>

    );
};

export default LoginInfoForm;
