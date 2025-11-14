import { Badge, Box, DataList, Flex, Separator, Table, Tooltip, Text } from "@radix-ui/themes"
import { useLocation } from "react-router-dom";
import { IParticipant } from "../../interfaces/participant.interface";
import Accordeon from "../../components/Accordeon/Accordeon";
import { GridComponent } from "../../components/Grid/Grid";
import { ApexOptions } from 'apexcharts';
import ApexChart from "react-apexcharts";
import { SelectField } from "../../components/SelectField/SelectField";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as Icon from "@phosphor-icons/react";

import { ParticipantBasicInfo } from "../../components/DataListView/DatalistViewBasicInfo";
import { get } from "lodash";

interface LocationState {
  selectedParticipants: IParticipant[];
}


const CompareParticipantsSelected = () => {

  const location = useLocation();
  const state = location.state as LocationState;
  const { selectedParticipants } = state || { selectedParticipants: [] };

  const [expandedParticipants, setExpandedParticipants] = useState<Record<string, boolean>>({});
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);

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
    { title: "Características Gerais", numbersOfquestions: `5-22`, numberBlocks: 1 },
    { title: "Habilidades acima da média", numbersOfquestions: `23-34`, numberBlocks: 2 },
    { title: "Criatividade", numbersOfquestions: `35-49`, numberBlocks: 3 },
    { title: "Comprometimento com a tarefa", numbersOfquestions: `50-62`, numberBlocks: 4 },
    { title: "Liderança", numbersOfquestions: `63-67`, numberBlocks: 5 },
    { title: "Atividades artísticas e esportivas", numbersOfquestions: `68-70`, numberBlocks: 6 },
  ];

  function calcularPunctuation(participants: IParticipant[]): number[][] {
    const punctuationS: number[][] = [];

    for (const participant of participants) {
      let participantesPontuacao = [0, 0, 0, 0, 0, 0];

      if (participant.adultForm && participant.adultForm.answersByGroup) {
        for (const group of participant.adultForm.answersByGroup) {
          for (const question of group.questions) {
            const answerPoints = question.answerPoints ?? 0;
            switch (group.groupName) {
              case "Características Gerais":
                participantesPontuacao[0] += answerPoints;
                break;
              case "Habilidade Acima da Média":
                participantesPontuacao[1] += answerPoints;
                break;
              case "Criatividade":
                participantesPontuacao[2] += answerPoints;
                break;
              case "Comprometimento da Tarefa":
                participantesPontuacao[3] += answerPoints;
                break;
              case "Liderança":
                participantesPontuacao[4] += answerPoints;
                break;
              case "Atividades Artísticas e Esportivas":
                participantesPontuacao[5] += answerPoints;
                break;
              default:
                break;
            }
          }
        }
      }
      punctuationS.push(participantesPontuacao);
    }
    return punctuationS;
  }
  const getFirstAndLastName = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0]} ${names[names.length - 1]}`;
    } else {
      return fullName;
    }
  };

  const punctuationS = calcularPunctuation(selectedParticipants);
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
      ...punctuationS.map((data, index) => ({
        name: `A-${index + 1}`,
        data: data
      }))
    ],
    colors: randomColors,
    chart: {
      type: 'bar',
      height: 500,
      stacked: punctuationS.length > 5 ? true : false,
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
        columnWidth: punctuationS.length > 5 ? 80 : 20,
        horizontal: false,
        borderRadius: 5,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          position: 'center',
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
      text: 'Pontuação dos Participantes Selecionados por Bloco',
      align: 'left',
      style: {
        fontSize: '15px',
      }
    },
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBlockIndex(parseInt(event.target.value));
  };

  const selectedQuestions = selectedParticipants[0].adultForm?.answersByGroup?.find(
    group => group.sequence === selectedBlockIndex
  )?.questions || [];


  return (
    <>

      <Box className="w-full m-auto">
        <Accordeon
          title="Informações do(s) Participante(s) Selecionado(s)"
          content={
            <>
              <Table.Root variant="ghost" className="w-full desktop rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                <Table.Header className="text-[18px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                  <Table.Row className="border-b border-violet-200/30">
                    <Table.ColumnHeaderCell colSpan={5} className="border-r border-violet-200/30 py-4">
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
                        Identificação
                      </Flex>
                    </Table.ColumnHeaderCell>
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
                  {selectedParticipants.map((participant, index) => (
                    <Table.Row
                      key={index}
                      align="center"
                      className="border-b border-gray-100/30 hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <Table.Cell justify="center" className="py-4">
                        <Tooltip content={`Avaliado - ${index + 1}`}>
                          <Badge
                            size="2"
                            variant="soft"
                            className="bg-violet-100 text-violet-700 border-violet-200 font-semibold cursor-help"
                          >
                            <Flex align="center" gap="2">
                              <Icon.UserCircle size={14} />
                              A-{index + 1}
                            </Flex>
                          </Badge>
                        </Tooltip>
                      </Table.Cell>

                      <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                        <Text weight="medium" className="text-gray-900">
                          {getFirstAndLastName(participant.personalData.fullName)}
                        </Text>
                      </Table.Cell>

                      <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                        <Badge
                          size="2"
                          variant="soft"
                          className="bg-blue-100 text-blue-700 border-blue-200 font-bold"
                        >
                          {participant.adultForm?.totalPunctuation}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                        <Text weight="medium" className="text-gray-700">
                          {handleAge(participant.personalData.birthDate)}
                        </Text>
                      </Table.Cell>

                      {/* Gênero */}
                      <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                        <Text weight="medium" className="text-gray-700">
                          {participant.personalData.gender}
                        </Text>
                      </Table.Cell>

                      {/* Questionário */}
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
                          color={`${participant.adultForm?.giftednessIndicators ? 'grass' : 'red'}`}
                          className={`w-full justify-center font-semibold border ${participant.adultForm?.giftednessIndicators
                            ? ' border-emerald-500'
                            : ' border-red-500'
                            }`}
                        >
                          {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              <div className="mobo">
                {selectedParticipants.map((participant, index) => (
                  <ParticipantBasicInfo key={index} setExpandedParticipants={setExpandedParticipants} expandedParticipants={expandedParticipants} selectedParticipants={selectedParticipants} getFirstAndLastName={getFirstAndLastName} />
                ))}
              </div>
            </>
          }
          className="mb-2"
          defaultValue="item-1"
        />


        <GridComponent className="gap-5 m-auto mt-2 " columns={2}>

          <Box>
            <Table.Root variant="surface" className=" text-black rounded rounded-b-lg w-full  font-roboto overflow-auto">
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
                    <Table.Cell justify="center">{detail.numberBlocks}</Table.Cell>
                    <Table.Cell justify="center">{detail.title}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>


          <Box className="rounded overflow-hidden bg-white rounded-b-lg w-full pt-4  font-roboto border-2 p-2">
            <ApexChart options={options2} series={options2.series} type="bar" height={300} />
          </Box>

        </GridComponent>
        <Box className="w-full ">
          <Form.Root className="flex flex-row items-center justify-center truncate mb-2">
            <Flex>
              <SelectField label="FILTRAR PERGUNTAS POR BLOCO" className="" name="blocks" onChange={handleSelectChange}>
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
              <Table.Root variant="ghost" className="h-[500px] overflow-auto desktop rounded-2xl border border-gray-200/50 shadow-sm">
                <Table.Header className="text-[16px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                  <Table.Row align="center" className="text-center border-b border-violet-200/30">
                    <Table.ColumnHeaderCell className="border-r border-violet-200/30 py-4">
                      <Flex align="center" justify="center" gap="2" className="text-violet-900">
                        <Icon.Question size={18} weight="bold" />
                        <Text weight="bold">Perguntas</Text>
                      </Flex>
                    </Table.ColumnHeaderCell>
                    {selectedParticipants?.map((participant, index) => (
                      <Table.ColumnHeaderCell key={index} className="border-r border-violet-200/30 py-4 last:border-r-0">
                        <Flex align="center" justify="center" gap="2" className="text-blue-900">
                          <Icon.User size={16} weight="bold" />
                          <Text weight="medium" className="italic">
                            {getFirstAndLastName(participant.personalData?.fullName)}
                          </Text>
                        </Flex>
                      </Table.ColumnHeaderCell>
                    ))}
                  </Table.Row>
                </Table.Header>

                <Table.Body className="bg-white/50 backdrop-blur-sm">
                  {selectedQuestions.map((question, questionIndex) => (
                    <Table.Row
                      align="center"
                      key={`question-${questionIndex}`}
                      className="border-b border-gray-100/30 hover:bg-gray-50/30 transition-colors duration-200"
                    >
                      <Table.Cell className="text-wrap py-4">
                        <Text size="3" weight="medium" className="text-gray-800 leading-relaxed pr-4">
                          {question.statement}
                        </Text>
                      </Table.Cell>

                      {selectedParticipants.map((participant, participantIndex) => {
                        const answerGroup = participant.adultForm?.answersByGroup?.find(
                          group => group.sequence === selectedBlockIndex
                        );

                        const matchedQuestion = answerGroup?.questions?.find(
                          q => q.statement === question.statement
                        );

                        let processedAnswer = '';
                        if (matchedQuestion) {
                          if (typeof matchedQuestion.answer === 'string') {
                            processedAnswer = matchedQuestion.answer.trim();
                          } else if (Array.isArray(matchedQuestion.answer)) {
                            processedAnswer = matchedQuestion.answer
                              .map(a => (typeof a === 'string' ? a.trim() : ''))
                              .filter(a => a)
                              .join(', ');
                          }
                        }

                        const answerStyle = () => {
                          const baseClass = "rounded-lg py-2 px-3 text-center font-semibold  shadow-sm min-w-[140px] mx-auto border";

                          switch (processedAnswer) {
                            case 'Sempre':
                            case 'Frequentemente':
                              return `${baseClass} bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 `;
                            case 'Ás vezes':
                            case 'Raramente':
                            case 'Nunca':
                              return `${baseClass} bg-red-500 text-white border-red-600 hover:bg-red-600 `;
                            default:
                              return `${baseClass} bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300`;
                          }
                        };

                        return (
                          <Table.Cell
                            key={`participant-${participantIndex}`}
                            align="center"
                            className="border-r border-gray-200/30 py-4 last:border-r-0"
                          >
                            <div className={answerStyle()}>
                              {processedAnswer || '—'}
                            </div>
                          </Table.Cell>
                        );
                      })}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              <div className="mobo">
                <DataList.Root orientation="vertical" className="!font-roboto">
                  {/* Pontuação geral por participante */}
                  <DataList.Item className="w-full p-3 rounded-lg mb-1 card-container">
                    <p className="text-[16px] font-bold text-center mb-4 text-black">Pontuação Geral do(s) Participante(s):</p>
                    {selectedParticipants.map((participant, index) => (
                      <div key={index} className="mb-2">
                        <DataList.Label className="font-semibold italic">{participant.personalData.fullName}:</DataList.Label>
                        <DataList.Value>{participant.adultForm?.totalPunctuation}</DataList.Value>
                      </div>
                    ))}
                  </DataList.Item>
                  <Separator size="4" className="my-2" />

                  {/* Perguntas e respostas */}
                  <DataList.Item className="w-full p-3 rounded-lg mb-1 card-container">
                    <p className="text-[16px] font-bold text-center mb-4 text-black">Questionário:</p>

                    {selectedQuestions.map((question, questionIndex) => (
                      <div key={`question-${questionIndex}`} className="mb-2">
                        <p className="text-[16px] font-bold mb-4 text-black">{question.statement}</p>

                        {selectedParticipants.map((participant, participantIndex) => {
                          const answerGroup = participant.adultForm?.answersByGroup?.find(
                            group => group.sequence === selectedBlockIndex
                          );

                          const matchedQuestion = answerGroup?.questions?.find(
                            q => q.statement === question.statement
                          );

                          let processedAnswer = '';
                          if (matchedQuestion) {
                            if (typeof matchedQuestion.answer === 'string') {
                              processedAnswer = matchedQuestion.answer.trim();
                            } else if (Array.isArray(matchedQuestion.answer)) {
                              processedAnswer = matchedQuestion.answer
                                .map(a => (typeof a === 'string' ? a.trim() : ''))
                                .filter(a => a)
                                .join(', ');
                            }
                          }

                          const answerStyle = () => {
                            const baseClass = "font-semibold text-center px-2 py-1 rounded justify-center";

                            switch (processedAnswer) {
                              case 'Sempre':
                              case 'Frequentemente':
                                return `${baseClass} bg-green-400 text-white`;
                              case 'Ás vezes':
                              case 'Raramente':
                              case 'Nunca':
                                return `${baseClass} bg-red-400 text-white`;
                              default:
                                return "gap-2";
                            }
                          };

                          return (
                            <div key={`participant-${participantIndex}`}>
                              <DataList.Label className="font-semibold italic">
                                {participant.personalData.fullName}:
                              </DataList.Label>

                              <DataList.Value className={`${answerStyle()} !mb-5`}>
                                {!processedAnswer ? (
                                  <p className="text-red-500">Nenhuma resposta encontrada.</p>
                                ) : (
                                  processedAnswer
                                )}
                              </DataList.Value>
                            </div>
                          );
                        })}

                        <Separator size="4" className="my-2" />
                      </div>
                    ))}
                  </DataList.Item>
                </DataList.Root>
              </div>

            </>
          }
          defaultValue={""}
        />
      </Box >
    </>
  );
};

export default CompareParticipantsSelected;