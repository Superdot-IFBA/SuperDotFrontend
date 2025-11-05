import * as Icon from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { DashboardInfo, getinfoDashboard, MonthlyProgressItem } from "../../api/sample.api";
import Dcard from "../../components/DashboardCard/DCard";
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Notify, NotificationType } from "../../components/Notify/Notify";
import ChartContainer from "../../components/Charts/ChartContainer";


function DashBoardPage() {
    const [dados, setDados] = useState<DashboardInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationData, setNotificationData] = useState<{
        title: string;
        description: string;
        type?: NotificationType;
    }>({
        title: "",
        description: "",
        type: undefined,
    });
    const [open, setOpen] = useState(false);



    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await getinfoDashboard();
                setDados(response);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setNotificationData({
                    title: "Erro no servidor",
                    description: "Não foi possível carregar os dados do Dashboard",
                    type: "error"
                });
            }
        };

        fetchDados();
    }, []);

    const genderChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Roboto, sans-serif',
        },
        labels: ['Feminino', 'Masculino'],
        colors: ['#2A5C8B', '#4CAF50'],
        dataLabels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '16px'
                        }
                    }
                }
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center'
        }
    };

    const lineChartOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: false
            },
            toolbar: {
                show: true
            }
        },
        colors: ['#4CAF50', '#2A5C8B'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 5,
            hover: {
                size: 7
            }
        },
        xaxis: {
            categories: (dados?.monthlyProgress ?? []).map((item: MonthlyProgressItem) => item.month),
        },

        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (val: number) {
                    return val;
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right'
        }
    };

    const labels = dados?.institutionDistribution?.labels || [];

    const barChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true
            }
        },
        colors: ['#2A5C8B', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 6
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: labels.map(label => {
                const parts = label.split(" ");
                return parts.length > 1
                    ? `${parts[0]} ${parts[1]}...`
                    : `${parts[0]}...`;
            }),
            tooltip: {
                enabled: true
            }
        },
        yaxis: {
            title: {
                text: ''
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            x: {
                formatter: function (_: string, { dataPointIndex }: any) {
                    return labels[dataPointIndex];
                }
            },
            y: {
                formatter: function (val: number) {
                    return val;
                }
            }
        }
    };

    const radialChartOptions: ApexOptions = {
        chart: {
            type: 'radialBar',
            height: 350,
        },
        colors: ['#4CAF50', '#FF9800', '#F44336'],
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: {
                        fontSize: '16px',
                        color: undefined,
                        offsetY: 120
                    },
                    value: {
                        offsetY: 76,
                        fontSize: '22px',
                        color: undefined,
                        formatter: function (val: number) {
                            return val + "%";
                        }
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91]
            },
        },
        stroke: {
            dashArray: 4
        },
        labels: ['Autorizadas', 'Pendentes', 'Rejeitadas'],
    };

    const regionalDistributionOptions: ApexOptions = {
        chart: {
            type: 'polarArea',
            height: 350
        },
        colors: ['#2A5C8B', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'],
        stroke: {
            colors: ['#fff']
        },
        fill: {
            opacity: 0.8
        },
        labels: dados?.regionalDistribution?.labels || [],
        legend: {
            position: 'bottom'
        },
        yaxis: {
            show: false
        },
        plotOptions: {
            polarArea: {
                rings: {
                    strokeWidth: 0
                },
                spokes: {
                    strokeWidth: 0
                },
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val;
                }
            }
        }
    };

    const ageDistributionOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true
            }
        },
        colors: ['#546E7A'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                borderRadius: 4
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: dados?.ageDistribution?.labels || [],
            title: {
                text: ''
            }
        },
        yaxis: {
            title: {
                text: ''
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val;
                }
            }
        }
    };

    const knowledgeAreaDistributionOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true
            }
        },
        colors: ['#2E93fA'],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: string) {
                return val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        xaxis: {
            categories: dados?.knowledgeAreaDistribution?.labels || [],
            title: {
                text: ''
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val;
                }
            }
        }
    };
    const participantProgressOptions: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Roboto, sans-serif',
        },
        labels: ['Finalizado', 'Preenchendo', 'Aguardando 2ª fonte', 'Não iniciado'],
        colors: ['#4CAF50', '#FF9800', '#9C27B0', '#F44336'],
        dataLabels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '16px'
                        }
                    }
                }
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center'
        }
    };

    const genderSeries = [
        dados?.count_female ?? 0,
        dados?.count_male ?? 0
    ];

    const lineSeries = [
        {
            name: "Amostras",
            data: (dados?.monthlyProgress ?? []).map((item: MonthlyProgressItem) => item.samples)
        },
        {
            name: "Participantes",
            data: (dados?.monthlyProgress ?? []).map((item: MonthlyProgressItem) => item.participants)
        }
    ];

    const completedCount = dados?.collectionStatus?.completed || 0;
    const pendingCount = dados?.collectionStatus?.pending || 0;
    const rejectedCount = dados?.collectionStatus?.rejected || 0;
    const totalCount = completedCount + pendingCount + rejectedCount;
    const completedPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const pendingPercentage = totalCount > 0 ? (pendingCount / totalCount) * 100 : 0;
    const rejectedPercentage = totalCount > 0 ? (rejectedCount / totalCount) * 100 : 0;
    const collectionStatusSeries = [
        completedPercentage,
        pendingPercentage,
        rejectedPercentage
    ];

    const ageDistributionSeries = [
        {
            name: 'Participantes',
            data: dados?.ageDistribution?.series || []
        }
    ];

    const knowledgeAreaDistributionSeries = [
        {
            name: 'Participantes',
            data: dados?.knowledgeAreaDistribution?.series || []
        }
    ];

    const participantProgressSeries = [
        dados?.participantProgress?.["Finalizado"] || 0,
        dados?.participantProgress?.["Preenchendo"] || 0,
        dados?.participantProgress?.["Aguardando 2ª fonte"] || 0,
        dados?.participantProgress?.["Não iniciado"] || 0,
    ];

    const totalParticipants =
        (dados?.participantProgress?.["Não iniciado"] || 0) +
        (dados?.participantProgress?.["Preenchendo"] || 0) +
        (dados?.participantProgress?.["Aguardando 2ª fonte"] || 0) +
        (dados?.participantProgress?.["Finalizado"] || 0);

    const completionRate = totalParticipants > 0 ? (dados?.participantProgress?.["Finalizado"] || 0) / totalParticipants * 100 : 0;

    const calculateGrowth = () => {
        const progress = dados?.monthlyProgress ?? [];
        if (progress.length < 6) return 0;

        const last3 = progress.slice(-3).map(m => m.participants).reduce((a, b) => a + b, 0) / 3;
        const prev3 = progress.slice(-6, -3).map(m => m.participants).reduce((a, b) => a + b, 0) / 3;

        if (prev3 === 0) return last3 > 0 ? 100 : 0;
        return (((last3 - prev3) / prev3) * 100).toFixed(0);
    };

    const activeDays = (dados?.monthlyProgress ?? []).length;

    const barChartSeries = [
        {
            name: "Amostras",
            data: dados?.institutionDistribution?.series || []
        }
    ];

    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: undefined })}
                title={notificationData.title}
                description={notificationData.description}
                type={notificationData.type}
            />


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <Dcard
                    loading={loading}
                    title="Total de Amostras"
                    value={dados?.total_samples}
                    icon={<Icon.Swatches size={32} />}
                    style="bg-gradient-to-l from-red-500 to-amber-500" />

                <Dcard
                    loading={loading}
                    title="Participantes"
                    value={dados?.total_participants ?? 0}
                    icon={<Icon.UsersThree size={32} />}
                    style="bg-gradient-to-l from-lime-500 to-sky-500"
                />

                <Dcard
                    loading={loading}
                    title="Instituições"
                    value={dados?.total_unique_instituition ?? 0}
                    icon={<Icon.GraduationCap size={32} />}
                    style="bg-gradient-to-l from-violet-500 to-pink-500"
                />

                <Dcard
                    loading={loading}
                    title="Taxa de Completude"
                    value={`${completionRate.toFixed(0)}%`}
                    icon={<Icon.ChartLineUp size={32} />}
                    style="bg-green-500"
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer
                    title="Distribuição por Gênero"
                    loading={loading}
                    tooltip="Distribuição dos participantes por gênero"
                >
                    <ApexChart
                        options={genderChartOptions}
                        series={genderSeries}
                        type="donut"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Progresso Mensal"
                    loading={loading}
                    tooltip="Evolução mensal de amostras e participantes"
                >
                    <ApexChart
                        options={lineChartOptions}
                        series={lineSeries}
                        type="line"
                        height={350}
                    />
                </ChartContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <ChartContainer
                    title="Distribuição por Instituição"
                    loading={loading}
                    tooltip="Amostras coletadas por instituição participante"
                >
                    <ApexChart
                        options={barChartOptions}
                        series={barChartSeries}
                        type="bar"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Distribuição por Região"
                    loading={loading}
                    tooltip="Amostras coletadas por região do país"
                >
                    <ApexChart
                        options={regionalDistributionOptions}
                        series={dados?.regionalDistribution?.series || []}
                        type="polarArea"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Status das Coletas"
                    loading={loading}
                    tooltip="Porcentagem de coletas Autorizadas"
                >
                    <ApexChart
                        options={radialChartOptions}
                        series={collectionStatusSeries}
                        type="radialBar"
                        height={350}
                    />
                </ChartContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer
                    title="Distribuição por Faixa Etária"
                    loading={loading}
                    tooltip="Distribuição de participantes por faixa etária"
                >
                    <ApexChart
                        options={ageDistributionOptions}
                        series={ageDistributionSeries}
                        type="bar"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Distribuição por Área de Conhecimento"
                    loading={loading}
                    tooltip="Distribuição de participantes por área de conhecimento"
                >
                    <ApexChart
                        options={knowledgeAreaDistributionOptions}
                        series={knowledgeAreaDistributionSeries}
                        type="bar"
                        height={350}
                    />
                </ChartContainer>

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer
                    title="Status de Preenchimento"
                    loading={loading}
                    tooltip="Distribuição dos participantes por status de preenchimento do questionário"
                >
                    <ApexChart
                        options={participantProgressOptions}
                        series={participantProgressSeries}
                        type="donut"
                        height={350}
                    />
                </ChartContainer>

            </div>


            <div className="bg-white card-container p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 ">Resumo Estatístico</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.ChartPieSlice size={20} className="text-blue-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Média Mensal</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            {((dados?.total_samples ?? 0) / (dados?.monthlyProgress?.length || 1)).toFixed(0)}
                        </p>

                        <p className="text-sm text-gray-500 ">amostras/mês</p>
                    </div>
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.TrendUp size={20} className="text-green-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Crescimento</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">{calculateGrowth()}%</p>
                        <p className="text-sm text-gray-500 ">últimos 3 meses</p>
                    </div>
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.CalendarCheck size={20} className="text-purple-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Dias Ativos</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 "> {activeDays}</p>
                        <p className="text-sm text-gray-500 ">coletas realizadas</p>
                    </div>
                </div>
                {/* Footer */}

                <div className="text-xs text-gray-400 mt-2 text-right">
                    Atualizado em {new Date().toLocaleTimeString()}
                </div>

            </div>
        </>
    );
};

export default DashBoardPage;