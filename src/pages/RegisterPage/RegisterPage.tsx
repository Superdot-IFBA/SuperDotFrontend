import { RegisterValues } from "../../schemas/registerSchema";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import DetailsForm from "./components/DetailsForm/DetailsForm";
import ProfilePhotoForm from "./components/ProfilePhotoForm/ProfilePhotoForm";
import { registerResearcher } from "../../api/auth.api";
import { saveTokens } from "../../utils/tokensHandler";
import LoginInfoForm from "./components/LoginInfoForm/LoginInfoForm";
import { Notify, NotificationType } from "../../components/Notify/Notify";

import { Flex } from "@radix-ui/themes";
import Stepper, { Step } from "../../components/NewStepper/NewStteper";
import BackgroundComponent from "../../components/Background/Background";



const INITIAL_VALUES: RegisterValues = {
    personalData: {
        fullName: "",
        phone: "",
        birthDate: new Date(),
        profilePhoto: undefined,
        countryState: "",
    },
    email: "",
    emailConfirmation: "",
    password: "",
    passwordConfirmation: "",
    acceptUseTerm: false,
};

const RegisterPage = () => {
    const [registerData, setCurrentData] = useState<RegisterValues>(INITIAL_VALUES);
    const navigate = useNavigate();
    const [notificationData, setNotificationData] = useState<{
        title: string;
        description: string;
        type?: NotificationType;
    }>({
        title: "",
        description: "",
        type: undefined,
    });

    const [loading, setLoading] = useState(false);
    const handleSubmit = async (data: RegisterValues) => {
        setLoading(true);

        const formData = new FormData();

        for (const key in data) {
            if (key === "personalData") {
                for (const nestedKey in data[key]) {
                    formData.append(
                        `personalData[${nestedKey}]`,
                        data["personalData"][nestedKey as keyof (typeof data)["personalData"]] as string
                    );
                }
            } else {
                formData.append(key, data[key as keyof RegisterValues] as string);
            }
        }

        if (data.personalData.profilePhoto) {
            formData.set("personalData[profilePhoto]", data.personalData.profilePhoto);
        }

        formData.set("personalData[birthDate]", data.personalData.birthDate.toISOString());

        try {
            const result = await registerResearcher(formData);
            if (result.status === 200) {
                saveTokens(result.data);
                navigate("/app/home");
                setLoading(false);

            }
        } catch (error) {
            console.error(error);
            setNotificationData({
                title: "Erro ao cadastrar",
                description: "Por favor, confira as informações fornecidas e tente novamente.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };
    const stepperRef = useRef<{
        handleNext: () => void;
        handleBack: () => void;
    }>(null);

    const handleNextStep = () => {
        stepperRef.current?.handleNext();
    };

    const handlePreviousStep = () => {
        stepperRef.current?.handleBack();
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
            <Flex className="w-full">
                <Flex className="desktop w-full">
                    <BackgroundComponent />
                </Flex>
                <Flex direction="column" className="p-4 h-full w-full justify-center overflow-auto bg-offwhite text-[#4F4F4F]">

                    <Stepper ref={stepperRef}
                        initialStep={1}
                        footerClassName="hidden"
                        disableStepIndicators
                    >
                        <Step>
                            <DetailsForm
                                handleOnSubmit={handleNextStep}
                                setStepData={setCurrentData}
                                currentData={registerData}
                            />
                        </Step>
                        <Step>
                            <ProfilePhotoForm
                                handleOnSubmit={handleNextStep}
                                handleOnClickPreviousStep={handlePreviousStep}
                                setStepData={setCurrentData}
                                currentData={registerData}
                            />
                        </Step>
                        <Step>
                            <LoginInfoForm
                                handleOnSubmit={handleSubmit}
                                handleOnClickPreviousStep={handlePreviousStep}
                                setStepData={setCurrentData}
                                currentData={registerData}
                                loading={loading}
                            />
                        </Step>
                    </Stepper>
                </Flex>
            </Flex>
        </>
    );
};

export default RegisterPage;
