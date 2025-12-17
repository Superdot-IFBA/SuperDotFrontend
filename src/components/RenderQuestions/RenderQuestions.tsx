import IQuestion from "../../interfaces/question.interface";
import { EQuestionType } from "../../utils/consts.utils";
import FourInput from "../FourInput/FourInput";
import MultipleSelect from "../MultipleSelect/MultipleSelect";
import FiveOption from "../FiveOption/FiveOption";
import FourSelect from "../FourSelect/FourSelect";
import { useEffect, useRef, useState } from "react";
import { Flex } from "@radix-ui/themes";
import check from '../../assets/concluido.png';
import Stepper, { Step } from "../NewStepper/NewStteper";

interface RenderQuestionsProps {
    questions: IQuestion[];
    setQuestions: (questions: IQuestion[]) => void;
    handlerSaveAndContinue: () => void;
}

const RenderQuestions = ({ questions, setQuestions, handlerSaveAndContinue }: RenderQuestionsProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completed, setCompleted] = useState(false);

    const stepperRef = useRef<any>(null);

    useEffect(() => {
        setCurrentIndex(0);
    }, [questions]);

    const currentQuestion = questions[currentIndex];

    if (!currentQuestion) {
        return <div>Carregando perguntas...</div>;
    }

    const isAnswered = (q: IQuestion): boolean => {
        if (!q) return false;

        if (q.parentQuestion) {
            const parent = questions.find(p => p._id === q.parentQuestion?.parentId);

            if (!parent) return false;

            const requiredValue = q.parentQuestion.isRequiredOnParentValue;
            const parentAnswer = parent.answer;


            if (Array.isArray(parentAnswer) && !parentAnswer.includes(requiredValue)) {
                return true;
            }

            if (typeof parentAnswer === "string" && parentAnswer !== requiredValue) {
                return true;
            }
        }

        if (typeof q.answer === "string") {
            return q.answer.trim() !== "";
        }

        if (Array.isArray(q.answer)) {
            return q.answer.length > 0 && q.answer.every(v => typeof v === "string" && v.trim() !== "");

        }

        return false;
    };

    const isCurrentDisabled = !isAnswered(currentQuestion);


    const updateStringAnswer = (id: string, value: string) => {
        setQuestions(questions.map(q => q._id === id ? { ...q, answer: value } : q));
    };

    const updateArrayAnswer = (id: string, value: string[]) => {
        setQuestions(questions.map(q => q._id === id ? { ...q, answer: value } : q));
    };


    const shouldRenderChild = (q: IQuestion): boolean => {
        if (!q.parentQuestion) return true;

        const parent = questions.find(p => p._id === q.parentQuestion?.parentId);
        if (!parent) return false;

        const requiredValue = q.parentQuestion.isRequiredOnParentValue;
        const parentAnswer = parent.answer;

        if (Array.isArray(parentAnswer)) return parentAnswer.includes(requiredValue);
        if (typeof parentAnswer === "string") return parentAnswer === requiredValue;

        return false;
    };


    useEffect(() => {
        if (completed) {
            setCompleted(false);
            handlerSaveAndContinue();
        }
    }, [completed]);

    return (
        <>
            <Stepper
                ref={stepperRef}
                initialStep={1}
                onFinalStepCompleted={() => setCompleted(true)}
                nextButtonText="Próximo"
                backButtonText="Voltar"
                stepContainerClassName="hidden"
                className="h-[450px] overflow-hidden"
                contentClassName="!h-[400px]"
                disableButton={isCurrentDisabled}
                nextButtonProps={{
                    className: isCurrentDisabled
                        ? "disabled:bg-neutral-dark disabled:hover:cursor-not-allowed"
                        : ""
                }}
                completedStepContent={
                    <Flex direction="column" align="center" className="gap-2">
                        <img className="m-auto w-72 rounded-md mb-5" src={check} alt="check-img" />
                    </Flex>
                }
                onStepChange={(i) => setCurrentIndex(i - 1)}
            >
                {questions
                    .filter(q => {
                        if (!q.parentQuestion) return true;
                        return shouldRenderChild(q);
                    })
                    .map((q) => (
                        <Step key={q._id}>
                            <p className="text-[18px] max-md:text-[16px] w-[80%] max-md:w-full m-auto">
                                {q.statement}
                            </p>


                            {q.questionType === EQuestionType.FOUR_INPUT && (
                                <FourInput
                                    values={q.answer as string[]}
                                    onChange={(v) => updateArrayAnswer(q._id, v)}
                                />
                            )}

                            {/* MULTIPLE SELECT */}
                            {q.questionType === EQuestionType.MULTIPLE_SELECT && (
                                <Flex direction="column" align="center" gap="2" className="mt-4">
                                    <MultipleSelect
                                        options={q.options?.map(o => o.value) || []}
                                        values={q.answer as string[]}
                                        onChange={(v) => updateArrayAnswer(q._id, v)}
                                        placeholder="Selecione aqui"
                                    />
                                </Flex>
                            )}

                            {/* ONE INPUT */}
                            {q.questionType === EQuestionType.ONE_INPUT && (
                                <Flex direction="column" align="center" gap="2" className="mt-4">
                                    <input
                                        value={q.answer}
                                        placeholder="Digite aqui"
                                        onChange={(e) => updateStringAnswer(q._id, e.target.value)}
                                        className="border px-3 py-2 rounded-md w-[50%]"
                                    />
                                </Flex>
                            )}

                            {/* FIVE OPTION */}
                            {q.questionType === EQuestionType.FIVE_OPTION && (
                                <FiveOption
                                    options={q.options?.map(o => o.value) || []}
                                    value={q.answer as string}
                                    onSelect={(v) => updateStringAnswer(q._id, v)}
                                />
                            )}

                            {/* FOUR SELECT */}
                            {q.questionType === EQuestionType.FOUR_SELECT && (
                                <FourSelect
                                    options={q.options?.map(o => o.value) || []}
                                    values={q.answer as string[]}
                                    onChange={(v) => updateArrayAnswer(q._id, v)}
                                />
                            )}

                        </Step>

                    ))}
            </Stepper>
        </>
    );
};

export default RenderQuestions;
