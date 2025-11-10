import * as Icon from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { DashboardInfo, getinfoDashboard, MonthlyProgressItem } from "../../api/sample.api";
import Dcard from "../../components/DashboardCard/DCard";
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Notify, NotificationType } from "../../components/Notify/Notify";
import ChartContainer from "../../components/Charts/ChartContainer";
import { SampleResearcherSearch } from "../../components/ResearcherSearch/ResearcherSearch";
import { getUserRole } from "../../utils/auth.utils";



function DashBoardPage() {
    const [dados, setDados] = useState<DashboardInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRole = getUserRole();

    const [notificationData, setNotificationData] = useState<{
        title: string;
        description: string;
        type?: NotificationType;
    }>({
        title: "",
        description: "",
        type: undefined,
    });

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await getinfoDashboard();
                setDados(response.data);
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
            dashArray: 0
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

            <div className="min-h-screen bg-gray-50 mb-4">
                {userRole === "Administrador" && (
                    <div className="flex justify-end w-full py-4">
                        <SampleResearcherSearch
                            onSelect={async (sample) => {
                                try {
                                    setLoading(true);
                                    const result = await getinfoDashboard(sample?.sampleId);
                                    setDados(result.data);
                                    setLoading(false);
                                    if (result.status === 200) {
                                        setNotificationData({
                                            title: "Amostra Selecionada",
                                            description: "Você selecionou a amostra com sucesso. Agora você pode visualizar os detalhes.",
                                            type: "success"
                                        });
                                    }
                                } catch (error: any) {
                                    setNotificationData({
                                        title: "Erro",
                                        description: "Não foi possível atualizar o dashboard",
                                        type: "error"
                                    });
                                    setLoading(false);
                                }
                            }}
                        />

                    </div>
                )}


                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8">
                        <div className="grid grid-cols-1 max-md:grid-cols-1 xl:grid-cols-2 gap-4 max-md:gap-2 mb-6">
                            <Dcard
                                loading={loading}
                                title="Total de Amostras"
                                value={dados?.total_samples}
                                icon={<Icon.Swatches size={24} weight="duotone" className="text-white" />}
                                style="bg-gradient-to-br from-blue-500/60 to-blue-600 shadow-lg"
                            />
                            <Dcard
                                loading={loading}
                                title="Participantes"
                                value={dados?.total_participants ?? 0}
                                icon={<Icon.UsersThree size={24} weight="duotone" className="text-white" />}
                                style="bg-gradient-to-br from-amber-500/60 to-amber-600 shadow-lg"
                            />
                            <Dcard
                                loading={loading}
                                title="Instituições"
                                value={dados?.total_unique_instituition ?? 0}
                                icon={<Icon.GraduationCap size={24} weight="duotone" className="text-white" />}
                                style="bg-gradient-to-br from-purple-500/60 to-primary shadow-lg"
                            />
                            <Dcard
                                loading={loading}
                                title="Taxa de Completude"
                                value={`${completionRate.toFixed(0)}%`}
                                icon={<Icon.ChartLineUp size={24} weight="light" className="text-white" />}
                                style="bg-gradient-to-br from-lime-500/60 to-lime-600 shadow-lg"
                            />
                            {/* <Dcard
                                loading={loading}
                                title="Participantes"
                                value={1500}
                                icon={<Icon.UsersThree size={20} />}
                                style="bg-gradient-to-br from-green-500 to-green-600"
                                trend={{ value: 12, isPositive: true }}
                                linkTo="/participants"
                            /> */}
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                            <ChartContainer
                                title="Progresso Mensal"
                                loading={loading}
                                tooltip="Evolução mensal de amostras e participantes"
                                className="h-80"
                            >
                                <ApexChart
                                    options={lineChartOptions}
                                    series={lineSeries}
                                    type="line"
                                    height={300}
                                />
                            </ChartContainer>

                            <ChartContainer
                                title="Status das Coletas"
                                loading={loading}
                                tooltip="Porcentagem de coletas Autorizadas"
                                className="h-80"
                            >
                                <ApexChart
                                    options={radialChartOptions}
                                    series={collectionStatusSeries}
                                    type="radialBar"
                                    height={300}
                                />
                            </ChartContainer>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                            <ChartContainer
                                title="Distribuição por Instituição"
                                loading={loading}
                                tooltip="Amostras coletadas por instituição participante"
                                className="h-80"
                            >
                                <ApexChart
                                    options={barChartOptions}
                                    series={barChartSeries}
                                    type="bar"
                                    height={300}
                                />
                            </ChartContainer>

                            <ChartContainer
                                title="Distribuição por Região"
                                loading={loading}
                                tooltip="Amostras coletadas por região do país"
                                className="h-80"
                            >
                                <ApexChart
                                    options={regionalDistributionOptions}
                                    series={dados?.regionalDistribution?.series || []}
                                    type="polarArea"
                                    height={300}
                                />
                            </ChartContainer>
                        </div>
                    </div>

                    {/* Coluna Direita - Sidebar de Métricas */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Gráficos Verticais */}
                        <ChartContainer
                            title="Distribuição por Gênero"
                            loading={loading}
                            tooltip="Distribuição dos participantes por gênero"
                            className="h-80"
                        >
                            <ApexChart
                                options={genderChartOptions}
                                series={genderSeries}
                                type="donut"
                                height={300}
                            />
                        </ChartContainer>

                        <ChartContainer
                            title="Status de Preenchimento"
                            loading={loading}
                            tooltip="Distribuição dos participantes por status de preenchimento"
                            className="h-80"
                        >
                            <ApexChart
                                options={participantProgressOptions}
                                series={participantProgressSeries}
                                type="donut"
                                height={300}
                            />
                        </ChartContainer>

                        {/* Métricas Rápidas */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Icon.ChartBar size={20} className="mr-2 text-blue-500" />
                                Métricas Rápidas
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Média Mensal</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {((dados?.total_samples ?? 0) / (dados?.monthlyProgress?.length || 1)).toFixed(0)}
                                        </p>
                                    </div>
                                    <Icon.ChartPieSlice size={24} className="text-blue-500" />
                                </div>

                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Crescimento</p>
                                        <p className="text-2xl font-bold text-gray-800">{calculateGrowth()}%</p>
                                    </div>
                                    <Icon.TrendUp size={24} className="text-green-500" />
                                </div>

                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Dias Ativos</p>
                                        <p className="text-2xl font-bold text-gray-800">{activeDays}</p>
                                    </div>
                                    <Icon.CalendarCheck size={24} className="text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashBoardPage;