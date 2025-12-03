import { useLocation } from "react-router-dom";
import { IParticipant, ISecondSource } from "../../interfaces/participant.interface";
import { Flex, Table, Box, Skeleton, Tooltip, DataList, Separator, Badge, Text } from "@radix-ui/themes";
import Accordeon from "../../components/Accordeon/Accordeon";
import { GridComponent } from "../../components/Grid/Grid";
import ApexChart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import { SelectField } from "../../components/SelectField/SelectField";
import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import { ParticipantBasicInfo } from "../../components/DataListView/DatalistViewBasicInfo";
import SecondSourcesList from "../../components/DataListView/DatalistViewSecondSorce";
import * as Icon from "@phosphor-icons/react";


interface LocationState {
    participant: IParticipant;
}

const SecondsSourceCompare = () => {
    const location = useLocation();
    const { participant } = location.state as LocationState;
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
    const [expandedParticipants, setExpandedParticipants] = useState<Record<string, boolean>>({});
    const [expandedSS, setExpandedSS] = useState<Record<string, boolean>>({});

    const handleAge = (birthDate: Date): number => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);

        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        const dayDiff = today.getDate() - birthDateObj.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    };

    const detailBlocks = [
        { title: "Características Gerais", numbersOfquestions: `5-18`, numberBlocks: 1 },
        { title: "Habilidades acima da média", numbersOfquestions: `19-30`, numberBlocks: 2 },
        { title: "Criatividade", numbersOfquestions: `31-45`, numberBlocks: 3 },
        { title: "Comprometimento com a tarefa", numbersOfquestions: `46-58`, numberBlocks: 4 },
        { title: "Liderança", numbersOfquestions: `59-63`, numberBlocks: 5 },
        { title: "Atividades artísticas e esportivas", numbersOfquestions: `64-80`, numberBlocks: 6 },
    ];

    function calcularPunctuation(participants: IParticipant[] | undefined): number[][] {
        if (!participants || participants.length === 0) {
            return [[0, 0, 0, 0, 0, 0]];
        }

        let característicasGerais = 0;
        let HabilidadesAcimaDaMédia = 0;
        let criatividade = 0;
        let ComprometimentoComATarefa = 0;
        let Liderança = 0;
        let AtividadesArtísticasEsportivas = 0;

        for (const participant of participants) {
            if (participant.adultForm && participant.adultForm.answersByGroup) {
                for (const group of participant.adultForm.answersByGroup) {
                    for (const question of group.questions) {
                        const answerPoints = question.answerPoints ?? 0;
                        switch (group.groupName) {
                            case "Características Gerais":
                                característicasGerais += answerPoints;
                                break;
                            case "Habilidade Acima da Média":
                                HabilidadesAcimaDaMédia += answerPoints;
                                break;
                            case "Criatividade":
                                criatividade += answerPoints;
                                break;
                            case "Comprometimento da Tarefa":
                                ComprometimentoComATarefa += answerPoints;
                                break;
                            case "Liderança":
                                Liderança += answerPoints;
                                break;
                            case "Atividades Artísticas e Esportivas":
                                AtividadesArtísticasEsportivas += answerPoints;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }

        return [
            [
                característicasGerais,
                HabilidadesAcimaDaMédia,
                criatividade,
                ComprometimentoComATarefa,
                Liderança,
                AtividadesArtísticasEsportivas,
            ],
        ];
    }

    function calcularPontuacaoSegundasFontes(secondSources: ISecondSource[]): number[][] {
        const punctuationS: number[][] = [];

        for (const secondSource of secondSources) {
            const segundaFontePontuacao = [0, 0, 0, 0, 0, 0];

            if (secondSource.adultForm && secondSource.adultForm.answersByGroup) {
                for (const group of secondSource.adultForm.answersByGroup) {
                    for (const question of group.questions) {
                        const answerPoints = question.answerPoints ?? 0;
                        switch (group.groupName) {
                            case "Características Gerais":
                                segundaFontePontuacao[0] += answerPoints;
                                break;
                            case "Habilidade Acima da Média":
                                segundaFontePontuacao[1] += answerPoints;
                                break;
                            case "Criatividade":
                                segundaFontePontuacao[2] += answerPoints;
                                break;
                            case "Comprometimento da Tarefa":
                                segundaFontePontuacao[3] += answerPoints;
                                break;
                            case "Liderança":
                                segundaFontePontuacao[4] += answerPoints;
                                break;
                            case "Atividades Artísticas e Esportivas":
                                segundaFontePontuacao[5] += answerPoints;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            punctuationS.push(segundaFontePontuacao);
        }
        return punctuationS;
    }

    const secondSources: ISecondSource[] = (participant.secondSources || []).filter(
        (source): source is ISecondSource =>
            source.personalData?.email !== undefined &&
            source.personalData?.fullName !== undefined &&
            source.personalData?.birthDate !== undefined &&
            source.personalData?.relationship !== undefined &&
            source.personalData?.relationshipTime !== undefined &&
            source.personalData?.educationLevel !== undefined
    );
    const punctuationP = calcularPunctuation([participant])[0];
    const punctuationS = calcularPontuacaoSegundasFontes(secondSources);
    const generateRandomColor = (): string => {
        const baseColor = [0x6e, 0x56, 0xcf];
        const variation = 50;

        const randomColor = baseColor.map((channel) => {
            const min = Math.max(0, channel - variation);
            const max = Math.min(255, channel + variation);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        });

        return `rgb(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]})`;
    };

    const randomColors = Array.from({ length: 6 }, generateRandomColor);
    const options2: ApexOptions = {
        series: [
            {
                name: 'Avaliado',
                data: punctuationP
            },
            ...punctuationS.map((data, index) => ({
                name: `ASF ${index + 1}`,
                data: data
            }))
        ],
        colors: randomColors,
        chart: {
            type: 'bar',
            height: 500,
            stacked: false,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 500,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                columnWidth: 20,
                horizontal: false,
                borderRadius: 5,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
                dataLabels: {
                    position: 'top',

                },
            },
        },
        xaxis: {
            categories: ['Bloco 1', 'Bloco 2', 'Bloco 3', 'Bloco 4', 'Bloco 5', "Bloco 6"],
        },
        legend: {
            position: 'right',
            offsetY: 20
        },
        fill: {
            opacity: 1
        },
        title: {
            text: 'Pontuação do Avaliado e das Segundas Fontes por Bloco',
            align: 'left',
            style: {
                fontSize: '15px',
            }
        },
    };
    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };


    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBlockIndex(parseInt(event.target.value));
    };

    const selectedQuestions = secondSources[0]?.adultForm?.answersByGroup?.[selectedBlockIndex]?.questions || [];

    return (
        <>
            <Box className="w-full m-auto">
                <Accordeon
                    title="Informações do Participante Avaliado"
                    content={
                        <>
                            <Table.Root variant="ghost" className="w-full desktop rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                                <Table.Header className="text-[18px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                                    <Table.Row className="border-b border-violet-200/30">
                                        <Table.ColumnHeaderCell colSpan={4} className="border-r border-violet-200/30 py-4">
                                            <Flex align="center" justify="center" gap="3" className="text-violet-900">
                                                <Icon.User size={22} weight="bold" />
                                                <Text weight="bold" size="4">Informações do Participante</Text>
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell colSpan={2} className="border-r-0 py-4 text-center">
                                            <Flex align="center" justify="center" gap="3" className="text-violet-900">
                                                <Icon.Certificate size={22} weight="bold" />
                                                <Text weight="bold" size="4">Indicadores de AH/SD</Text>
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Header className="text-[16px] bg-gradient-to-r from-gray-50 to-gray-100/30">
                                    <Table.Row align="center" className="text-center border-b border-gray-200/50">
                                        <Table.ColumnHeaderCell className="border-r border-gray-200/30 py-3 font-semibold text-gray-800">
                                            <Flex align="center" justify="center" gap="2">
                                                Nome do Avaliado
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-gray-200/30 py-3 font-semibold text-gray-800">
                                            <Flex align="center" justify="center" gap="2">
                                                Pontuação
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-gray-200/30 py-3 font-semibold text-gray-800">
                                            <Flex align="center" justify="center" gap="2">
                                                Idade
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-gray-200/30 py-3 font-semibold text-gray-800">
                                            <Flex align="center" justify="center" gap="2">
                                                Gênero
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-gray-200/30 py-3 font-semibold text-gray-800">
                                            <Flex align="center" justify="center" gap="2">
                                                Questionário
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r-0 py-3 font-semibold text-gray-800">
                                            <Flex align="center" justify="center" gap="2">
                                                Pesquisador
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body className="bg-white/50 backdrop-blur-sm">
                                    <Table.Row align="center" className="border-b border-gray-100/30 hover:bg-gray-50/50 transition-colors duration-200">
                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text weight="medium" className="text-gray-900">
                                                {getFirstAndLastName(participant.personalData.fullName)}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Badge
                                                size="2"
                                                variant="soft"
                                                className="bg-blue-100 text-blue-700 border-blue-200 font-bold shadow-sm"
                                            >
                                                <Icon.Trophy size={16} weight="bold" />
                                                {participant.adultForm?.totalPunctuation}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text weight="medium" className="text-gray-700">
                                                {handleAge(participant.personalData.birthDate)}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Text weight="medium" className="text-gray-700">
                                                {participant.personalData.gender}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                            <Badge
                                                size="2"
                                                color={`${participant.adultForm?.giftednessIndicators ? 'grass' : 'red'}`}
                                                className={`w-full justify-center font-semibold border ${participant.adultForm?.giftednessIndicators
                                                    ? ' border-emerald-500'
                                                    : ' border-red-500'
                                                    }`}
                                            >
                                                {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="py-4">
                                            <Badge
                                                size="2"
                                                color={`${participant.giftdnessIndicatorsByResearcher ? 'grass' : 'red'}`}
                                                className={`w-full justify-center font-semibold border ${participant.giftdnessIndicatorsByResearcher
                                                    ? ' border-emerald-500'
                                                    : ' border-red-500'
                                                    }`}
                                            >
                                                {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                            <div className="mobo">
                                <DataList.Root orientation="vertical" className="!font-roboto">
                                    <ParticipantBasicInfo
                                        setExpandedParticipants={setExpandedParticipants} expandedParticipants={expandedParticipants} selectedParticipants={[participant]} getFirstAndLastName={getFirstAndLastName} />

                                </DataList.Root>
                            </div>
                        </>
                    }
                    className="mb-2"
                    defaultValue="item-1"
                />
                <Accordeon
                    title="Informações do(s) Participante(s) Avaliado(s) Segunda(s) Fonte(s)"
                    content={
                        <>
                            <Table.Root variant="ghost" className="w-full desktop rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                                <Table.Header className="text-[16px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
                                    <Table.Row align="center" className="text-center border-b border-blue-200/30">
                                        <Table.ColumnHeaderCell className="border-r border-blue-200/30 py-4 font-semibold text-blue-900">
                                            <Flex align="center" justify="center" gap="2">
                                                Identificação
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-blue-200/30 py-4 font-semibold text-blue-900">
                                            <Flex align="center" justify="center" gap="2">
                                                Nome do Avaliado
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-blue-200/30 py-4 font-semibold text-blue-900">
                                            <Flex align="center" justify="center" gap="2">
                                                Pontuação
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-blue-200/30 py-4 font-semibold text-blue-900">
                                            <Flex align="center" justify="center" gap="2">
                                                Idade
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-blue-200/30 py-4 font-semibold text-blue-900">
                                            <Flex align="center" justify="center" gap="2">
                                                Escolaridade
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r border-blue-200/30 py-4 font-semibold text-blue-900">
                                            <Flex align="center" justify="center" gap="2">
                                                Relação
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-r-0 py-4 font-semibold text-blue-900">
                                            <Flex align="center" justify="center" gap="2">
                                                Tempo de Relação
                                            </Flex>
                                        </Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body className="bg-white/50 backdrop-blur-sm">
                                    {participant?.secondSources?.map((secondSource, index) => (
                                        <Table.Row
                                            align="center"
                                            key={index}
                                            className="border-b border-gray-100/30 hover:bg-blue-50/30 transition-colors duration-200"
                                        >
                                            <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                                <Tooltip content={`Avaliado Segundas Fontes - ${index + 1}`}>
                                                    <Badge
                                                        size="2"
                                                        variant="soft"
                                                        color="blue"
                                                        className="cursor-help shadow-sm"
                                                    >
                                                        <Flex align="center" gap="2">
                                                            <Icon.UserCircle size={14} weight="bold" />
                                                            ASF - {index + 1}
                                                        </Flex>
                                                    </Badge>
                                                </Tooltip>
                                            </Table.Cell>

                                            <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                                <Text weight="medium" className="text-gray-900">
                                                    {getFirstAndLastName(secondSource?.personalData?.fullName ?? "")}
                                                </Text>
                                            </Table.Cell>

                                            <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                                <Badge
                                                    size="2"
                                                    color="cyan"
                                                    variant="soft"
                                                    className=" font-bold shadow-sm"
                                                >
                                                    <Icon.Trophy size={16} weight="bold" />
                                                    {secondSource.adultForm?.totalPunctuation}
                                                </Badge>
                                            </Table.Cell>

                                            <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                                <Text weight="medium" className="text-gray-700">
                                                    {handleAge(secondSource.personalData?.birthDate ?? new Date())}
                                                </Text>
                                            </Table.Cell>

                                            <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                                <Text weight="medium" className="text-gray-700">
                                                    {secondSource.personalData?.educationLevel}
                                                </Text>
                                            </Table.Cell>

                                            <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                                <Badge
                                                    size="1"
                                                    variant="soft"
                                                    color="cyan"
                                                    className=" font-medium"
                                                >
                                                    {secondSource.personalData?.relationship}
                                                </Badge>
                                            </Table.Cell>

                                            <Table.Cell justify="center" className="py-4">
                                                <Text weight="medium" className="text-gray-700">
                                                    {secondSource.personalData?.relationshipTime}
                                                </Text>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                            <div className="mobo">
                                <SecondSourcesList
                                    secondSources={secondSources}
                                    expandedSS={expandedSS}
                                    setExpandedSS={setExpandedSS}
                                    handleAge={handleAge}
                                    getFirstAndLastName={getFirstAndLastName}
                                />
                            </div>
                        </>
                    }
                    defaultValue=""
                />

                <GridComponent className="gap-5  m-auto mt-2 " columns={2}>
                    <Skeleton loading={false}>
                        <Box>
                            <Table.Root variant="surface" className=" text-black rounded rounded-b-lg w-full card-container font-roboto overflow-auto ">
                                <Table.Header className="text-[14px] text-black bg-violet-200">
                                    <Table.ColumnHeaderCell align="center" colSpan={8}>Detalhes de cada bloco</Table.ColumnHeaderCell>
                                </Table.Header>
                                <Table.Header className="text-[12px] bg-violet-200">
                                    <Table.Row align="center" className="text-center">
                                        <Table.ColumnHeaderCell className="border-l">Nº das perguntas do questionário</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-l">Nº de bloco</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-l">Nome do bloco</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {detailBlocks.map((detail, index) => (
                                        <Table.Row align="center" key={index}>
                                            <Table.Cell justify="center">{detail.numbersOfquestions}</Table.Cell>
                                            <Table.Cell justify="center">{index + 1}</Table.Cell>
                                            <Table.Cell justify="center">{detail.title}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>

                        </Box>
                    </Skeleton>
                    <Skeleton loading={false}>
                        <Box className="rounded overflow-hidden bg-white rounded-b-lg w-full pt-4 card-container font-roboto border-2 p-2">
                            <ApexChart options={options2} series={options2.series} type="bar" height={300} />
                        </Box>
                    </Skeleton>
                </GridComponent>
                <Box className="w-full ">
                    <Form.Root className="flex flex-row items-center justify-center truncate mb-2">
                        <Flex>
                            <SelectField label="FILTRAR PERGUNTAS POR BLOCO" name="blocks" onChange={handleSelectChange}>
                                {detailBlocks.map((detail, index) => (
                                    <option className="hover:cursor-pointer" value={`${index}`} key={index}>
                                        Bloco {index + 1} - {detail.title}
                                    </option>
                                ))}
                            </SelectField>
                        </Flex>
                    </Form.Root>
                </Box>
                <Accordeon
                    title="Comparação:"
                    className="mb-10"
                    content={
                        <>
                            <Table.Root variant="ghost" className="w-full h-[500px] overflow-auto desktop rounded-2xl border border-gray-200/50 shadow-sm">
                                <Table.Header className="text-[16px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                                    <Table.Row align="center" className="text-center border-b border-violet-200/30">
                                        <Table.ColumnHeaderCell className="border-r border-violet-200/30 py-4">
                                            <Flex align="center" justify="center" gap="2" className="text-violet-900">
                                                <Icon.Question size={18} weight="bold" />
                                                <p className="font-bold">Perguntas</p>
                                            </Flex>
                                        </Table.ColumnHeaderCell>

                                        <Table.ColumnHeaderCell className="border-r border-violet-200/30 py-4">
                                            <Flex align="center" justify="center" gap="2" className="text-violet-900">
                                                <Icon.User size={18} weight="bold" />
                                                <p className="font-bold">{getFirstAndLastName(participant?.personalData?.fullName ?? "")}</p>
                                            </Flex>
                                        </Table.ColumnHeaderCell>

                                        {participant?.secondSources?.map((secondSource, index) => (
                                            <Table.ColumnHeaderCell key={index} className="border-r border-violet-200/30 py-4">
                                                <Flex align="center" justify="center" gap="2" className="text-blue-900">
                                                    <Icon.UserCircle size={18} weight="bold" />
                                                    <p className="font-bold">{getFirstAndLastName(secondSource.personalData?.fullName ?? "")}</p>
                                                </Flex>
                                            </Table.ColumnHeaderCell>
                                        ))}
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body className="bg-white/50 backdrop-blur-sm">
                                    <Table.Row align="center" className="border-b border-gray-100/50 hover:bg-gray-50/50 transition-colors">
                                        <Table.Cell className="py-3">
                                            <Flex align="center" gap="2" className="text-gray-700 font-semibold">
                                                <Icon.Trophy size={16} weight="bold" />
                                                Pontuação Total:
                                            </Flex>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="border-r border-gray-200/30 py-3">
                                            <Badge
                                                size="2"
                                                variant="soft"
                                                className=" font-bold shadow-sm"
                                            >
                                                {participant.adultForm?.totalPunctuation}
                                            </Badge>
                                        </Table.Cell>

                                        {participant?.secondSources?.map((secondSource, index) => (
                                            <Table.Cell key={index} justify="center" className="border-r border-gray-200/30 py-3">
                                                <Badge
                                                    size="2"
                                                    color="blue"
                                                    variant="soft"
                                                    className="bg-blue-100 text-blue-700 border-blue-200 font-bold shadow-sm"
                                                >

                                                    {secondSource.adultForm?.totalPunctuation}
                                                </Badge>
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>

                                    {selectedQuestions.map((question, questionIndex) => (
                                        <Table.Row
                                            key={questionIndex}
                                            align="center"
                                            className="border-b border-gray-100/30 hover:bg-gray-50/30 transition-colors duration-200"
                                        >
                                            <Table.Cell className="py-4">
                                                <p className="text-gray-800 leading-relaxed pr-4">
                                                    {question.statement}
                                                </p>
                                            </Table.Cell>

                                            <Table.Cell align="center" className="border-r border-gray-200/30 py-4">
                                                {(() => {
                                                    const getQuestionCode = (statement?: string) => {
                                                        if (!statement) return "";
                                                        return statement.trim().split(" ")[0];
                                                    };
                                                    const q = participant.adultForm?.answersByGroup?.[selectedBlockIndex]?.questions
                                                        ?.find(x => getQuestionCode(x.statement) === getQuestionCode(question.statement));

                                                    const answers = typeof q?.answer === "string"
                                                        ? q.answer.trim()
                                                        : Array.isArray(q?.answer)
                                                            ? q.answer.join(", ")
                                                            : "";

                                                    const answerStyle = () => {
                                                        const baseClass = "rounded-lg py-2 px-3 text-center font-semibold transition-all duration-200 shadow-sm min-w-[140px] mx-auto";
                                                        switch (answers) {
                                                            case "Sempre":
                                                            case "Frequentemente":
                                                                return `${baseClass} bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-600`;
                                                            case "Ás vezes":
                                                            case "Raramente":
                                                            case "Nunca":
                                                                return `${baseClass} bg-red-500 text-white border border-red-600 hover:bg-red-600`;
                                                            default:
                                                                return `${baseClass} bg-gray-200 text-gray-700 hover:bg-gray-300  border border-gray-300`;
                                                        }
                                                    };

                                                    return (
                                                        <p className={answerStyle()}>
                                                            {answers || "—"}
                                                        </p>
                                                    );
                                                })()}
                                            </Table.Cell>

                                            {secondSources.map((source, sourceIndex) => {
                                                const q = source.adultForm?.answersByGroup?.[selectedBlockIndex]?.questions
                                                    ?.find(x => x.statement === question.statement);

                                                const answers = typeof q?.answer === "string"
                                                    ? q.answer.trim()
                                                    : Array.isArray(q?.answer)
                                                        ? q.answer.join(", ")
                                                        : "";

                                                const answerStyle = () => {
                                                    const baseClass = "rounded-lg py-2 px-3 text-center font-semibold transition-all duration-200 shadow-sm min-w-[140px] mx-auto";
                                                    switch (answers) {
                                                        case "Sempre":
                                                        case "Frequentemente":
                                                            return `${baseClass} bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-600`;
                                                        case "Ás vezes":
                                                        case "Raramente":
                                                        case "Nunca":
                                                            return `${baseClass} bg-red-500 text-white border border-red-600 hover:bg-red-600`;
                                                        default:
                                                            return `${baseClass} bg-gray-200 text-gray-700 border hover:bg-gray-300 border-gray-300`;
                                                    }
                                                };

                                                return (
                                                    <Table.Cell key={sourceIndex} align="center" className="border-r border-gray-200/30 py-4">
                                                        <p className={answerStyle()}>
                                                            {answers || "—"}
                                                        </p>
                                                    </Table.Cell>
                                                );
                                            })}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                            <div className="mobo">
                                <DataList.Root orientation="vertical" className="!font-roboto">
                                    <DataList.Item className="w-full rounded-2xl mb-4 transition-all duration-500 ease-out transform
                                    bg-gradient-to-br from-white to-violet-50 shadow-sm hover:shadow-md 
                                    border border-violet-200/80 backdrop-blur-sm overflow-hidden
                                    hover:border-violet-300/60">

                                        <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-xl px-4 py-3 border-b border-violet-100/50">
                                            <p className="text-[17px] font-semibold text-center text-violet-900 tracking-tight flex items-center justify-center gap-2">
                                                <Icon.ChartBar size={20} weight="bold" />
                                                Pontuações
                                            </p>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Icon.User size={18} weight="bold" className="text-violet-600" />
                                                        <DataList.Label className="font-semibold text-gray-700">
                                                            {getFirstAndLastName(participant.personalData?.fullName ?? "")}
                                                        </DataList.Label>
                                                    </div>
                                                    <Badge
                                                        size="2"
                                                        variant="soft"
                                                        className=" font-bold"
                                                    >
                                                        <Icon.Trophy size={16} weight="bold" />
                                                        {participant?.adultForm?.totalPunctuation}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {participant?.secondSources && participant.secondSources.length > 0 && (
                                                <>
                                                    <Separator size="4" className="bg-gray-200/50 my-3" />
                                                    <p className="text-[15px] font-semibold text-center text-gray-600 mb-3 flex items-center justify-center gap-2">
                                                        <Icon.Users size={18} weight="bold" />
                                                        Segundas Fontes
                                                    </p>

                                                    <div className="space-y-2">
                                                        {participant.secondSources.map((secondSource, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Icon.UserCircle size={16} weight="bold" className="text-blue-600" />
                                                                    <DataList.Label className="font-medium text-gray-700">
                                                                        {getFirstAndLastName(secondSource.personalData?.fullName ?? "")}
                                                                    </DataList.Label>
                                                                </div>
                                                                <Badge
                                                                    size="1"
                                                                    variant="soft"
                                                                    color="blue"
                                                                    className="bg-blue-100 text-blue-700 border-blue-200 font-semibold"
                                                                >
                                                                    <Icon.Trophy size={16} weight="bold" className="text-blue-600" />

                                                                    {secondSource.adultForm?.totalPunctuation}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </DataList.Item>

                                    <DataList.Item className="w-full rounded-2xl mb-4 transition-all duration-500 ease-out transform
                                    bg-gradient-to-br from-white to-amber-50 shadow-sm hover:shadow-md 
                                    border border-amber-200/80 backdrop-blur-sm overflow-hidden
                                    hover:border-amber-300/60">

                                        <div className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-t-xl px-4 py-3 border-b border-amber-100/50">
                                            <p className="text-[17px] font-semibold text-center text-amber-900 tracking-tight flex items-center justify-center gap-2">
                                                <Icon.ClipboardText size={20} weight="bold" />
                                                Questionário - Bloco {selectedBlockIndex + 1}
                                            </p>
                                        </div>

                                        <div className="p-4">
                                            {selectedQuestions.map((question, questionIndex) => (
                                                <div key={questionIndex} className="mb-6 last:mb-0">
                                                    <div className="bg-white rounded-xl p-4 border border-gray-200/50 shadow-sm mb-3">
                                                        <p className="text-[15px] font-semibold text-gray-800 leading-relaxed">
                                                            {question.statement}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {(() => {
                                                            const getQuestionCode = (statement?: string) => {
                                                                if (!statement) return "";
                                                                return statement.trim().split(" ")[0];
                                                            };
                                                            const q = participant.adultForm?.answersByGroup?.[selectedBlockIndex]?.questions
                                                                ?.find(x => getQuestionCode(x.statement) === getQuestionCode(question.statement));

                                                            const answers = typeof q?.answer === "string"
                                                                ? q.answer.trim()
                                                                : Array.isArray(q?.answer)
                                                                    ? q.answer.join(", ")
                                                                    : "";

                                                            const answerStyle = () => {
                                                                const baseClass = "rounded-lg px-3 py-2 text-center font-semibold transition-all duration-200";
                                                                switch (answers) {
                                                                    case "Sempre":
                                                                    case "Frequentemente":
                                                                        return `${baseClass} bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm`;
                                                                    case "Ás vezes":
                                                                    case "Raramente":
                                                                    case "Nunca":
                                                                        return `${baseClass} bg-red-100 text-red-800 border border-red-200 shadow-sm`;
                                                                    default:
                                                                        return `${baseClass} bg-gray-100 text-gray-600 border border-gray-200`;
                                                                }
                                                            };

                                                            return (
                                                                <div className="flex items-center gap-3 p-2 bg-violet-50/50 rounded-lg border border-violet-100 flex-col">
                                                                    <div className="flex items-center gap-2 min-w-[120px]">
                                                                        <Icon.User size={16} weight="bold" className="text-violet-600" />
                                                                        <DataList.Label className="font-medium text-violet-700 text-sm ">
                                                                            {getFirstAndLastName(participant.personalData?.fullName)}
                                                                        </DataList.Label>
                                                                    </div>
                                                                    <DataList.Value className={`${answerStyle()}  w-[250px] justify-center`}>
                                                                        {answers || "—"}
                                                                    </DataList.Value>
                                                                </div>
                                                            );
                                                        })()}

                                                        {secondSources.map((source, sourceIndex) => {
                                                            const q = source.adultForm?.answersByGroup?.[selectedBlockIndex]?.questions
                                                                ?.find(x => x.statement === question.statement);

                                                            const answers = typeof q?.answer === "string"
                                                                ? q.answer.trim()
                                                                : Array.isArray(q?.answer)
                                                                    ? q.answer.join(", ")
                                                                    : "";

                                                            const answerStyle = () => {
                                                                const baseClass = "rounded-lg px-3 py-2 text-center font-semibold transition-all duration-200";
                                                                switch (answers) {
                                                                    case "Sempre":
                                                                    case "Frequentemente":
                                                                        return `${baseClass} bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm`;
                                                                    case "Ás vezes":
                                                                    case "Raramente":
                                                                    case "Nunca":
                                                                        return `${baseClass} bg-red-100 text-red-800 border border-red-200 shadow-sm`;
                                                                    default:
                                                                        return `${baseClass} bg-gray-100 text-gray-600 border border-gray-200`;
                                                                }
                                                            };

                                                            return (
                                                                <div key={sourceIndex} className="flex items-center gap-3 p-2 bg-blue-50/50 rounded-lg border border-blue-100 flex-col">
                                                                    <div className="flex items-center gap-2 min-w-[120px]">
                                                                        <Icon.UserCircle size={16} weight="bold" className="text-blue-600" />
                                                                        <DataList.Label className="font-medium text-blue-700 text-sm">
                                                                            {getFirstAndLastName(source.personalData?.fullName)}
                                                                        </DataList.Label>
                                                                    </div>
                                                                    <DataList.Value className={`${answerStyle()} w-[250px] justify-center`}>
                                                                        {answers || "—"}
                                                                    </DataList.Value>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Separador entre perguntas (exceto na última) */}
                                                    {questionIndex < selectedQuestions.length - 1 && (
                                                        <Separator size="4" className="bg-gray-200/30 my-4" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </DataList.Item>
                                </DataList.Root>
                            </div>

                        </>
                    }
                    defaultValue={""} />

            </Box >
        </>
    );
};

export default SecondsSourceCompare;
