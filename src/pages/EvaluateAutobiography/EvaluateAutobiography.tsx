import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Icon from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";
import { Flex, Text, HoverCard, Tooltip, Popover, Box, Badge, Tabs } from "@radix-ui/themes";
import { Notify, NotificationType } from "../../components/Notify/Notify";
import { Button } from "../../components/Button/Button";
import { Alert } from "../../components/Alert/Alert";
import { getParticipantDataBio, patchSaveEvalueAutobiography } from "../../api/participant.api";
import BackToTop from "../../components/BackToTop/BackToTop";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { IParticipant } from "../../interfaces/participant.interface";
import { ISample } from "../../interfaces/sample.interface";
import IBio from "../../interfaces/evaluateAutobiography.interface";

interface MarkedText {
    id: number;
    text: string;
    comment: string;
    mark: string;
    start: number;
    end: number;
    background: string;
}

interface LocationState {
    sample: ISample;
    participant: IParticipant;
}

const DEFAULT_MARKS = [
    { title: "Criatividade", gradienteBG: `bg-gradient-to-r from-red-400 to-red-500`, bg: "bg-red-400", borderColor: `border-red-500` },
    { title: "Liderança", gradienteBG: `bg-gradient-to-r from-amber-400 to-amber-500`, bg: "bg-amber-400", borderColor: "border-amber-500" },
    { title: "Características Gerais", gradienteBG: `bg-gradient-to-r from-lime-400 to-lime-500`, bg: "bg-lime-400", borderColor: "border-lime-500" },
    { title: "Habilidades acima da média", gradienteBG: `bg-gradient-to-r from-sky-400 to-sky-500`, bg: "bg-sky-400", borderColor: "border-sky-500" },
    { title: "Comprometimento com a tarefa", gradienteBG: `bg-gradient-to-r from-violet-400 to-violet-500`, bg: "bg-violet-400", borderColor: "border-violet-500" },
    { title: "Atividades artísticas e esportivas", gradienteBG: `bg-gradient-to-r from-pink-400 to-pink-500`, bg: "bg-pink-400", borderColor: "border-pink-500" },
];

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const MarkSpan = React.memo(function MarkSpan({
    id,
    marked,
    onRemove,
}: {
    id: number;
    marked: MarkedText;
    onRemove: (id: number) => void;
}) {
    return (
        <HoverCard.Root>
            <HoverCard.Trigger>
                <span
                    className={`relative rounded-md font-medium px-1.5 py-0.5 transition-all duration-200 hover:scale-105 ${marked.background} cursor-pointer`}
                >
                    {marked.text}
                </span>
            </HoverCard.Trigger>

            <HoverCard.Content
                sideOffset={5}
                collisionPadding={16}
                className="p-4 shadow-xl rounded-lg border border-gray-100 max-w-sm animate-in fade-in-0 zoom-in-95"
            >
                <div className={`rounded-lg overflow-hidden p-4 ${marked.mark === "Criatividade" ? "bg-gradient-to-br from-red-50 to-red-100 border border-red-200" :
                    marked.mark === "Liderança" ? "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200" :
                        marked.mark === "Características Gerais" ? "bg-gradient-to-br from-lime-50 to-lime-100 border border-lime-200" :
                            marked.mark === "Habilidades acima da média" ? "bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200" :
                                marked.mark === "Comprometimento com a tarefa" ? "bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200" :
                                    marked.mark === "Atividades artísticas e esportivas" ? "bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200" :
                                        "bg-white"
                    }`}>
                    <div className="flex flex-col gap-3">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1.5 flex items-center">
                                <Icon.ChatText size={24} className="mr-1" />
                                Comentário
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed text-justify">
                                {marked.comment}
                            </p>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-1">
                            <Alert
                                trigger={
                                    <Box>
                                        <Tooltip content={"Excluir marcação"}>
                                            <Button className="w-full" size="Extra Small" color="red" title={''} children={<Icon.Trash />} />
                                        </Tooltip>
                                    </Box>}
                                title={'Excluir marcação'}
                                description={'Tem certeza que deseja excluir a marcação e o comentário?'}
                                buttoncancel={<Button color="gray" title={'Cancelar'} size={'Small'} />}
                                buttonAction={<Button onClick={() => onRemove(id)} title={'Sim, Excluir'} color="red" size={'Small'}> </Button>}
                            />
                        </div>
                    </div>
                </div>
            </HoverCard.Content>
        </HoverCard.Root>
    );
});

const MarkedTextRenderer = React.memo(function MarkedTextRenderer({
    text,
    marks,
    onRemove,
}: {
    text: string;
    marks: MarkedText[];
    onRemove: (id: number) => void;
}) {
    const textMarks = useMemo(() => {
        return marks.filter((m) => m.start !== m.end).sort((a, b) => a.start - b.start);
    }, [marks]);

    const parts = useMemo(() => {
        if (!text) return [<span key="empty" />];
        const partsLocal: React.ReactNode[] = [];
        let lastIndex = 0;

        for (const mk of textMarks) {
            if (mk.start >= lastIndex) {
                const before = text.substring(lastIndex, mk.start);
                const marked = text.substring(mk.start, mk.end);

                if (before) partsLocal.push(<span key={`before-${mk.id}`}>{before}</span>);
                partsLocal.push(<MarkSpan key={`mark-${mk.id}`} id={mk.id} marked={{ ...mk, text: marked }} onRemove={onRemove} />);
                lastIndex = mk.end;
            }
        }
        partsLocal.push(<span key="last-part">{text.substring(lastIndex)}</span>);
        return partsLocal;
    }, [text, textMarks]);


    return <>{parts}</>;
});

const MarkersSidebar = React.memo(function MarkersSidebar({
    marks,
    onStartAdd,
    limit,
}: {
    marks: typeof DEFAULT_MARKS;
    onStartAdd: (markTitle: string, bg: string, comment: string) => void;
    limit: boolean;
}) {
    return (
        <Flex direction="column" p="4" gap="4">
            <Flex align="center" gap="3" className="mb-2 ">
                <Icon.Highlighter size={24} className="text-violet-600" />
                <h2 className="heading-2">Marcadores</h2>
            </Flex>

            {marks.map((mark, index) => (
                <Popover.Root key={index}>
                    <Popover.Trigger>
                        <button
                            className={`btn-primary w-full p-3 text-left rounded-lg ${mark.gradienteBG} text-white font-medium hover:shadow-md`}
                        >
                            {mark.title}
                        </button>
                    </Popover.Trigger>

                    <Popover.Content className={`${limit ? "invisible" : ""} ${mark.gradienteBG}`} width="360px" size="1">
                        <InnerCommentForm mark={mark} onSubmit={(comment) => onStartAdd(mark.title, mark.bg, comment)} />
                    </Popover.Content>
                </Popover.Root>
            ))}
        </Flex>
    );
});

function InnerCommentForm({
    mark,
    onSubmit,
}: {
    mark: { title: string; gradienteBG: string; bg: string };
    onSubmit: (comment: string) => void;
}) {
    const [comment, setComment] = useState("");
    const handleSubmit = useCallback(() => {
        if (!comment.trim()) return;
        onSubmit(comment.trim());
        setComment("");
    }, [comment, onSubmit]);

    return (
        <Flex gap="3">
            <Box flexGrow="1">
                <textarea
                    className="bg-white w-full p-2 rounded"
                    placeholder="Escreva um comentário..."
                    style={{ height: 80 }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Flex gap="3" mt="3" justify="between">
                    <Popover.Close>
                        <Button onClick={handleSubmit} title={"Inserir Comentário"} className="w-full" color="green" size={"Medium"} />
                    </Popover.Close>
                </Flex>
            </Box>
        </Flex>
    );
}

const CommentsPanel = React.memo(function CommentsPanel({
    marks,
    open,
    isDesktop,
    onRemove,
}: {
    marks: MarkedText[];
    open: boolean;
    isDesktop: boolean;
    onRemove: (id: number) => void;
}) {
    return (
        <Box
            id="comments-panel"
            className={`card-container ${isDesktop ? "w-[350px]" : "w-full"}
        transition-all duration-300 ease-in-out overflow-hidden ${open ? "opacity-100 scale-100 max-xl:max-h-[1000px]" : "opacity-0 scale-95 translate-x-4 !w-0 max-xl:max-h-0"}`}
        >
            <Flex direction="column" className="h-full">
                <Flex p="4" align="center" gap="3" className="border-b border-neutral-100">
                    <Icon.ChatCircleText size={24} className="text-violet-600" />
                    <h2 className="heading-2">Comentários</h2>
                </Flex>
                <Box className={`p-4 overflow-auto h-[50vh] `}>
                    {marks.map((marked) => (
                        <Box key={marked.id} className={`mb-4 last:mb-0 p-3 rounded-lg ${marked.background} text-left`}>
                            <Text size="2" className="font-medium text-neutral-700 mb-1 ">
                                {marked.mark}: &nbsp;
                            </Text>
                            <Text size="1" className="text-white mb-2">
                                "{marked.text}"
                            </Text>
                            <br />
                            <Text size="2" className="text-neutral-700 font-medium ">
                                Comentário: &nbsp;
                            </Text>
                            <Text size="1" className="text-white mb-2">
                                {marked.comment}
                            </Text>
                            <div className="flex justify-end mobo">
                                <Button size="Extra Small" color="red" onClick={() => onRemove(marked.id)} children={<Icon.Trash size={14} />} title="" />
                            </div>
                        </Box>
                    ))}
                </Box>
            </Flex>
        </Box>
    );
});

const VideoSection = React.memo(function VideoSection({
    videoUrl,
    currentVideoTime,
    setCurrentVideoTime,
    marks,
    onSeek,
    youtubePlayerRef,
    onRemove
}: {
    videoUrl: string;
    currentVideoTime: number;
    setCurrentVideoTime: (t: number) => void;
    marks: MarkedText[];
    onSeek: (t: number) => void;
    youtubePlayerRef: React.MutableRefObject<any | null>;
    onRemove: (id: number) => void;
}) {
    return (
        <div className="flex flex-col items-center gap-6">
            <VideoPlayer videoUrl={videoUrl} onTimeUpdate={setCurrentVideoTime} playerRef={youtubePlayerRef} />

            {!videoUrl.includes("youtube") && (
                <div className="flex gap-2 mb-4 mt-2">
                    <Icon.Clock size={16} className="text-gray-600" />
                    <Text className="font-medium text-gray-700">Tempo atual: {formatTime(currentVideoTime)}</Text>
                </div>
            )}

            {marks.filter((m) => m.start === m.end).length > 0 && (
                <div className="w-full mt-4 max-w-4xl">
                    <Text className="font-semibold mb-4 text-lg">Marcações no vídeo:</Text>
                    <div className="space-y-2 mt-6">
                        {marks
                            .filter((m) => m.start === m.end)
                            .map((mark) => (
                                <>
                                    <div key={mark.id} className={`p-3 rounded-lg ${mark.background} text-white cursor-pointer hover:opacity-90`} onClick={() => onSeek(mark.start)}>
                                        <div className="flex justify-between items-start">
                                            <Text size="2" className="font-medium">
                                                {mark.mark} - {formatTime(mark.start)}
                                            </Text>
                                        </div>
                                        <Text size="1" className="mt-1">{mark.comment}</Text>
                                        <div className="flex justify-end">
                                            <Button size="Extra Small" color="red" onClick={() => onRemove(mark.id)} children={<Icon.Trash size={14} />} title="" />
                                        </div>
                                    </div>

                                </>
                            ))}

                    </div>

                </div>

            )}
        </div>
    );
});

const EvaluateAutobiography: React.FC = () => {
    const location = useLocation();
    const { participant, sample } = (location.state || {}) as LocationState;

    const marksConst = useMemo(() => DEFAULT_MARKS, []);

    const [markedTexts, setMarkedTexts] = useState<MarkedText[]>([]);
    const markedTextsRef = useRef<MarkedText[]>([]);
    const [notificationData, setNotificationData] = useState<{ title: string; description: string; type?: NotificationType; }>({ title: "", description: "", type: undefined });
    const [limit, setLimit] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openMarks, setOpenMarks] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const [currentVideoTime, setCurrentVideoTimeState] = useState<number>(0);
    const currentVideoTimeRef = useRef<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const youtubePlayerRef = useRef<any>(null);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
    const savedRangeRef = useRef<Range | null>(null);


    const [isDesktop, setIsDesktop] = useState<boolean>(() => typeof window !== "undefined" ? window.innerWidth >= 1020 : true);

    useEffect(() => { currentVideoTimeRef.current = currentVideoTime; }, [currentVideoTime]);
    const setCurrentVideoTime = useCallback((t: number) => { currentVideoTimeRef.current = t; setCurrentVideoTimeState(t); }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getParticipantDataBio({ sampleId: sample._id, participantId: participant._id });
                if (data.evaluateAutobiography && Array.isArray(data.evaluateAutobiography)) {
                    const transformed = data.evaluateAutobiography.map((item: IBio, idx: number) => ({
                        id: item.id || Date.now() + idx,
                        text: item.text || "",
                        comment: item.comment || "",
                        mark: item.mark || "",
                        start: item.start || 0,
                        end: item.end || 0,
                        background: item.background || ""
                    }));
                    setMarkedTexts(transformed);
                    markedTextsRef.current = transformed;
                }
            } catch (err) {
                setError(err);
            }
        };

        if (sample?._id && participant?._id) {
            fetchData();
        }
    }, [sample?._id, participant?._id]);

    useEffect(() => {
        const onResize = () => setIsDesktop(window.innerWidth >= 1020);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const handleTouchSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.toString().trim() === "") return;
        handleTextSelection();
    };

    const handleTextSelection = useCallback(() => {

        const textElement = document.getElementById("autobiography");
        if (!textElement) return;

        const selection = window.getSelection();
        if (!selection) return;
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        savedRangeRef.current = range.cloneRange();
        // const startInside = textElement.contains(range.startContainer);
        // const endInside = textElement.contains(range.endContainer);
        // if (!startInside && !endInside) {
        //     setNotificationData({ title: "Seleção inválida", description: "Por favor, selecione o texto dentro da autobiografia.", type: "warning" });
        //     return;
        // }

        const selectedText = range.toString().trim();
        if (!selectedText) return;

        const MAX_LENGTH = 250;
        if (selectedText.length > MAX_LENGTH) {
            setLimit(true);
            setNotificationData({ title: "Seleção fora do limite permitido!", description: `Por favor, selecione no máximo ${MAX_LENGTH} caracteres.`, type: "warning" });
            return;
        }

        const preSelectionRange = document.createRange();
        preSelectionRange.selectNodeContents(textElement);
        try {
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
        } catch (err) {
            setNotificationData({ title: "Erro ao calcular seleção", description: "Não foi possível determinar a posição da seleção.", type: "error" });
            return;
        }

        const start = preSelectionRange.toString().length;
        const end = start + selectedText.length;

        setSelectionRange({ start, end });
        setSelectedText(selectedText);
        setLimit(false);

        setNotificationData({
            title: "Texto selecionado!",
            description: participant?.autobiography?.videoUrl ? "Texto selecionado para marcação. O vídeo será ignorado para esta marcação." : "Texto selecionado para marcação.",
            type: "info"
        });
    }, [participant?.autobiography?.videoUrl]);


    const handleAddComment = useCallback((title: string, bg: string, comment: string) => {
        if (!comment.trim()) return;

        let newMarked: MarkedText | null = null;

        if (selectedText && selectionRange) {
            const { start, end } = selectionRange;
            newMarked = {
                id: Date.now(),
                text: selectedText,
                comment: comment.trim(),
                mark: title,
                start,
                end,
                background: bg,
            };

            setSelectedText(null);
            setSelectionRange(null);

            setNotificationData({
                title: "Marcação de texto adicionada!",
                description: `Texto marcado: "${selectedText.substring(0, 30)}${selectedText.length > 30 ? "..." : ""}"`,
                type: "success",
            });
        }
        else if (participant?.autobiography?.videoUrl) {
            const isYouTube = participant.autobiography.videoUrl.includes("youtube");
            const currentTime = isYouTube ? currentVideoTimeRef.current : (videoRef.current?.currentTime || 0);

            newMarked = {
                id: Date.now(),
                text: `Marcação no tempo ${formatTime(currentTime)}`,
                comment: comment.trim(),
                mark: title,
                start: currentTime,
                end: currentTime,
                background: bg,
            };

            setNotificationData({
                title: "Marcação de vídeo adicionada!",
                description: `Marcação criada no tempo ${formatTime(currentTime)}`,
                type: "success",
            });
        }
        else {
            setNotificationData({
                title: "Nada selecionado!",
                description: "Selecione um texto para marcar Mude para a aba de texto ou tenha um vídeo para marcar",
                type: "warning",
            });
            return;
        }

        // Adiciona a marcação
        if (newMarked) {
            setMarkedTexts((prev) => [...prev, newMarked!].sort((a, b) => a.start - b.start));
            setOpen(true);
        }
    }, [selectedText, selectionRange, participant?.autobiography?.videoUrl]);

    const handleRemoveComment = useCallback((id: number) => {
        setMarkedTexts((prev) => {
            const updated = prev.filter((m) => m.id !== id);
            markedTextsRef.current = updated;
            return updated;
        });
        setNotificationData({ title: "Comentário Excluído", description: "O comentário e a marcação foram excluídos com sucesso!", type: "success" });
    }, []);

    const handleSeekToTime = useCallback((timestamp: number) => {
        const isYouTube = participant?.autobiography?.videoUrl?.includes("youtube");
        if (isYouTube) {
            if (youtubePlayerRef.current) {
                youtubePlayerRef.current.seekTo(timestamp, true);
                youtubePlayerRef.current.playVideo?.();
            }
        } else {
            if (videoRef.current) {
                videoRef.current.currentTime = timestamp;
                videoRef.current.play();
            }
        }
    }, [participant?.autobiography?.videoUrl]);

    const handleSaveEvalueAutobiography = useCallback(async (submitForm?: boolean) => {
        try {
            const response = await patchSaveEvalueAutobiography({
                sampleId: sample._id,
                participantId: participant._id,
                markedTexts,
                submitForm: submitForm || false,
            });
            if (response) {
                setNotificationData({ title: "Comentários salvos com sucesso!", description: "Os comentários foram salvos com sucesso!", type: "success" });
            } else {
                setNotificationData({ title: "Erro ao salvar os comentários!", description: "Houve um erro ao salvar os comentários!", type: "error" });
            }
        } catch (err) {
            setNotificationData({ title: "Erro ao salvar os comentários!", description: "Houve um erro ao salvar os comentários!", type: "error" });
            console.error(err);
        }
    }, [markedTexts, participant?._id, sample?._id]);

    const getFirstAndLastName = useCallback((fullName: string) => {
        const names = fullName.split(" ");
        if (names.length > 1) return `${names[0]} ${names[names.length - 1]}`;
        return fullName;
    }, []);

    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: undefined })}
                title={notificationData.title}
                description={notificationData.description}
                type={notificationData.type}
            />

            <div className="min-h-screen px-4 max-xl:p-2">
                <header className="pb-3 pt-4">
                    <h2 className="heading-2 font-semibold text-gray-900 flex flex-col gap-2 text-left max-sm:text-center max-sm:items-center">
                        <Text className="text-neutral-600 text-lg max-sm:text-[20px]">Análise de Autobiografia</Text>
                        <Badge size={'1'} color="violet" radius='large' className="font-semibold w-fit">
                            <Icon.User weight="bold" size={32} className="text-violet-600" />
                            {participant ? getFirstAndLastName(participant.personalData.fullName) : "Participante"}
                        </Badge>
                    </h2>
                </header>

                <main className="max-w-7xl mx-auto">
                    <Flex direction={isDesktop ? "row" : "column"} gap="6">

                        <Box className={`desktop card-container w-full ${isDesktop ? 'max-w-[25%]' : ''}`}>
                            <MarkersSidebar
                                marks={marksConst}
                                onStartAdd={(title, bg, comment) => handleAddComment(title, bg, comment)}
                                limit={limit}
                            />
                        </Box>

                        <Flex className={`w-full mobo card-container overflow-x-auto flex gap-2 rounded-xl transition-all duration-300`}>
                            <Flex p="4" gap="3" align="center" justify={'start'} className="mb-3 border-b border-neutral-100">
                                <Flex gap="3" align="center">
                                    <Icon.Highlighter size={24} className="text-violet-600" />
                                    <Text as="label" size="5" className="font-bold heading-2">Marcadores</Text>
                                </Flex>
                                <Icon.CaretDown onClick={() => setOpenMarks((v) => !v)} size={25}
                                    className={`heading-2 cursor-pointer transform transition-transform duration-300 ease-in-out ${openMarks ? "rotate-180" : ""}`} />
                            </Flex>

                            <div className={`mb-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden flex flex-wrap gap-3 max-sm:gap-1 justify-center ${!openMarks ? "opacity-100 max-h-[500px] translate-y-0" : "opacity-0 max-h-0 -translate-y-2"}`}>
                                {marksConst.map((mark, idx) => (
                                    <Popover.Root key={idx}>
                                        <Popover.Trigger>
                                            <div className="rounded group group/item">
                                                <button className={`btn-primary-mobo flex-shrink-0 w-10 h-10 text-sm font-semibold text-white rounded-full ${mark.gradienteBG} active:scale-95 transition-transform border border-white`} />
                                            </div>
                                        </Popover.Trigger>
                                        <Popover.Content sideOffset={5} align="start" className={`z-50 bg-white p-4 rounded shadow-lg w-[90vw] ${mark.gradienteBG} max-w-sm ${limit ? "invisible" : ""}`}>
                                            <Text className={`text-sm font-semibold text-white rounded-full px-2 py-1`}>{mark.title}</Text>
                                            <InnerCommentForm mark={mark} onSubmit={(comment) => handleAddComment(mark.title, mark.bg, comment)} />
                                        </Popover.Content>
                                    </Popover.Root>
                                ))}
                            </div>

                            <div className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${openMarks ? "opacity-100 max-h-[500px] translate-y-0" : "opacity-0 max-h-0 -translate-y-2"}`}>
                                {marksConst.map((mark, idx) => (
                                    <Popover.Root key={idx}>
                                        <Popover.Trigger>
                                            <button className={`btn-primary-mobo w-[80%] py-3 px-2 text-left rounded-lg ${mark.gradienteBG} text-white font-medium hover:shadow-md mb-2`} >
                                                {mark.title}
                                            </button>
                                        </Popover.Trigger>
                                        <Popover.Content className={limit ? "invisible" : ""} width="360px">
                                            <InnerCommentForm mark={mark} onSubmit={(comment) => handleAddComment(mark.title, mark.bg, comment)} />
                                        </Popover.Content>
                                    </Popover.Root>
                                ))}
                            </div>
                        </Flex>

                        <Box className="card-container w-full">
                            <Flex direction="column">
                                {participant?.autobiography?.text && participant?.autobiography?.videoUrl ? (
                                    <Tabs.Root defaultValue="video"
                                        className="p-4 h-[60vh] overflow-visible"
                                    >
                                        <Tabs.List className="flex gap-3 border-b pb-2 ">
                                            <Tabs.Trigger value="video" className="data-[state=active]:text-violet-600 data-[state=active]:font-semibold !cursor-pointer">
                                                <Flex className="flex items-center gap-2">
                                                    <Icon.Video size={20} className="text-violet-600" /> Autobiografia em Vídeo
                                                </Flex>
                                            </Tabs.Trigger>

                                            <Tabs.Trigger value="text" className="data-[state=active]:text-violet-600 data-[state=active]:font-semibold !cursor-pointer">
                                                <Flex className="flex items-center gap-2">
                                                    <Icon.Notebook size={20} className="text-violet-600" /> Texto da Autobiografia
                                                </Flex>
                                            </Tabs.Trigger>
                                        </Tabs.List>

                                        <Tabs.Content value="video" className="pt-6 h-[50vh] overflow-y-auto" >
                                            <VideoSection
                                                videoUrl={participant.autobiography.videoUrl}
                                                currentVideoTime={currentVideoTimeRef.current}
                                                setCurrentVideoTime={setCurrentVideoTime}
                                                marks={markedTexts}
                                                onSeek={handleSeekToTime}
                                                youtubePlayerRef={youtubePlayerRef}
                                                onRemove={handleRemoveComment}
                                            />
                                        </Tabs.Content>

                                        <Tabs.Content value="text" className="pt-6 h-[50vh] overflow-y-auto">
                                            <div className="pt-6 overflow-auto">
                                                <div
                                                    id="autobiography"
                                                    onMouseUp={handleTextSelection}
                                                    onTouchEnd={handleTouchSelection}
                                                    className="text-justify leading-relaxed text-neutral-700"
                                                    style={{ WebkitUserSelect: 'text', userSelect: 'text' }}
                                                >
                                                    <MarkedTextRenderer text={participant.autobiography.text} marks={markedTexts} onRemove={handleRemoveComment} />
                                                </div>
                                            </div>
                                        </Tabs.Content>
                                    </Tabs.Root>
                                ) : <></>}

                                {participant?.autobiography?.text && !participant?.autobiography?.videoUrl && (
                                    <>
                                        <Flex className="flex items-center gap-3 p-4 border-b border-neutral-100">
                                            <Icon.Notebook size={24} className="text-violet-600" />
                                            <h2 className="heading-2">Autobiografia</h2>
                                        </Flex>

                                        <Box className="p-4 overflow-auto h-[60vh]">
                                            <p id="autobiography" onMouseUp={handleTextSelection}
                                                onTouchEnd={handleTouchSelection} className="text-justify leading-relaxed text-neutral-700">
                                                <MarkedTextRenderer text={participant.autobiography.text} marks={markedTexts} onRemove={handleRemoveComment} />
                                            </p>
                                        </Box>
                                    </>
                                )}

                                {participant?.autobiography?.videoUrl && !participant?.autobiography?.text && (
                                    <>
                                        <Flex className="flex items-center gap-3 p-4 border-b border-neutral-100">
                                            <Icon.Video size={24} className="text-violet-600" />
                                            <h2 className="heading-2">Autobiografia em Vídeo</h2>
                                        </Flex>

                                        <Box className="p-4 overflow-auto h-[60vh]">
                                            <VideoSection
                                                videoUrl={participant.autobiography.videoUrl}
                                                currentVideoTime={currentVideoTimeRef.current}
                                                setCurrentVideoTime={setCurrentVideoTime}
                                                marks={markedTexts}
                                                onSeek={handleSeekToTime}
                                                youtubePlayerRef={youtubePlayerRef}
                                                onRemove={handleRemoveComment}
                                            />
                                        </Box>
                                    </>
                                )}
                            </Flex>
                        </Box>

                        <CommentsPanel marks={markedTexts} open={open} isDesktop={isDesktop} onRemove={handleRemoveComment} />
                    </Flex>

                    <div className="mt-5 gap-2 flex justify-center max-sm:flex-col">
                        <Button onClick={() => handleSaveEvalueAutobiography(true)} size="Medium" title="Salvar Análise" className="btn-primary px-8" color="green" children={<Icon.FloppyDisk size={18} weight="bold" />} />
                        <Button color="primary" size="Medium" title={`${open ? "Ocultar" : "Mostrar"} Comentários`} onClick={() => setOpen((v) => !v)} />
                    </div>
                </main>

                <BackToTop />
            </div>
        </>
    );
};

export default EvaluateAutobiography;
