import * as Form from "@radix-ui/react-form";
import noImage from "../../../../assets/no-image.jpg";
import { RegisterValues } from "../../../../schemas/registerSchema";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../../../../components/Button/Button";

interface ProfilePhotoProps {
    handleOnSubmit: () => void;
    handleOnClickPreviousStep: () => void;
    setStepData: (stepData: RegisterValues) => void;
    currentData: RegisterValues;
}

const ProfilePhotoForm = ({
    handleOnSubmit,
    handleOnClickPreviousStep,
    setStepData,
    currentData,
}: ProfilePhotoProps) => {
    const [photoUploaded, setPhotoUploaded] = useState<File>();
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStepData({
            ...currentData,
            personalData: {
                ...currentData.personalData,
                profilePhoto: photoUploaded,
            },
        });
        handleOnSubmit();
    };

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage("");
        const files = e.target.files;
        if (files?.length) {
            if (!files[0].type.startsWith("image")) {
                setErrorMessage("Arquivo inválido. Por favor, carregue uma imagem.");
            } else {
                setPhotoUploaded(files[0]);
            }
        }
    };

    return (
        <Form.Root
            about="Form to provide a profile photo."
            onSubmit={onSubmit}
            className="mt-6 m-auto w-10/12 max-sm:w-full max-w-2xl"
        >
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar uma conta</h1>
                <h3 className="text-lg text-gray-600">Foto de perfil (opcional)</h3>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <img
                            className="h-48 w-48 sm:h-60 sm:w-60 rounded-full object-cover shadow-md border border-gray-200"
                            src={photoUploaded ? URL.createObjectURL(photoUploaded) : noImage}
                            alt="Foto de perfil"
                        />
                    </div>

                    <Form.Field name="personalData.profilePhoto" className="text-center">
                        <Form.Label asChild>
                            <label className="cursor-pointer py-2 px-6 text-sm font-semibold bg-green-500 text-white rounded-xl hover:bg-green-600 active:bg-green-700 transition-all duration-200 shadow-md">
                                Carregar foto
                            </label>
                        </Form.Label>
                        <Form.Control
                            className="hidden"
                            type="file"
                            name="personalData.profilePhoto"
                            accept="image/*"
                            onChange={handleChangeImage}
                        />
                        {errorMessage && (
                            <Form.Message className="error-message mt-2 text-center text-sm text-red-600">
                                {errorMessage}
                            </Form.Message>
                        )}
                    </Form.Field>
                </div>

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
                        title="Continuar"
                        color="green"
                        size="Full"
                        className="w-full modern-button disabled:bg-gray-400 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="text-center space-y-4 pt-4">
                    <div className="text-sm text-gray-500">
                        Essa etapa é opcional. Você pode adicionar sua foto depois.
                    </div>
                </div>
            </div>
        </Form.Root>

    );
};

export default ProfilePhotoForm;
