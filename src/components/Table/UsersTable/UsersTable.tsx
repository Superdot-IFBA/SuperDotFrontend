import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE, ResearchersPaginated } from "../../../api/researchers.api";
import { Badge, DataList, Flex, IconButton, Text, Table, Tooltip } from "@radix-ui/themes";
import * as Icon from '@phosphor-icons/react'
import SkeletonTableBody from "../../Skeletons/SkeletonTableBody";
import { useEffect, useState } from "react";
import SkeletonDataList from "../../Skeletons/SkeletonDataList";
import { Button } from "../../Button/Button";


interface UsersTableProps {
    data?: ResearchersPaginated;
    currentPage: number;
    setCurrentPage: (newPage: number) => void;
    onClickPencil: (itemId: string) => void;

}

const UsersTable = ({ data, currentPage, setCurrentPage, onClickPencil }: UsersTableProps) => {
    const [loading, setLoading] = useState(true);
    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };
    useEffect(() => {
        if (data) {
            setLoading(false);
        }
    }, [data]);

    return (
        <>
            <Flex direction="column" className="w-full mb-6 px-4 sm:px-6 lg:px-8">
                <Text className="text-sm text-gray-600">
                    Gerencie os usuários cadastrados no sistema
                </Text>
            </Flex>
            <Table.Root variant="ghost" className="w-full m-auto desktop rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                <Table.Header className="text-[18px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                    <Table.Row className="border-b border-violet-200/30">
                        <Table.ColumnHeaderCell align="center" colSpan={4} className="border-r border-violet-200/30 py-4">
                            <Flex align="center" justify="center" gap="3" className="text-violet-900">
                                <Icon.Users size={22} weight="bold" />
                                <Text weight="bold" size="4">Dados do Usuário</Text>
                            </Flex>
                        </Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Header className="text-[15px] bg-gradient-to-r from-gray-50 to-gray-100/30">
                    <Table.Row className="border-b border-gray-200/50">
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-gray-200/30 py-3 font-semibold text-gray-800">
                            <Flex align="center" justify="center" gap="2">
                                Nome
                            </Flex>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-gray-200/30 py-3 font-semibold text-gray-800">
                            <Flex align="center" justify="center" gap="2">
                                E-mail
                            </Flex>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r border-gray-200/30 py-3 font-semibold text-gray-800">
                            <Flex align="center" justify="center" gap="2">
                                Perfil
                            </Flex>
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r-0 py-3 font-semibold text-gray-800">
                            <Flex align="center" justify="center" gap="2">
                                <Icon.Gear size={16} weight="bold" />
                                Ações
                            </Flex>
                        </Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                {loading ? (
                    <SkeletonTableBody itens={PAGE_SIZE} columns={4} />
                ) : data?.researchers && data.researchers.length > 0 ? (
                    <Table.Body className="bg-white/50 backdrop-blur-sm">
                        {data.researchers.map((user) => (
                            <Table.Row
                                key={user._id}
                                align="center"
                                className="border-b border-gray-100/30 hover:bg-gray-50/50 transition-colors duration-200"
                            >
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                    <Text weight="medium" className="text-gray-900">
                                        {getFirstAndLastName(user.fullname)}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4">
                                    <Text weight="medium" className="text-gray-700">
                                        {user.email}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell justify="center" className="border-r border-gray-200/30 py-4 ">
                                    <Badge
                                        size="2"
                                        variant="solid"
                                        color={
                                            user.role === "Revisor"
                                                ? "orange"
                                                : user.role === "Administrador"
                                                    ? "red"
                                                    : "blue"
                                        }
                                        className={`font-semibold border text-xs  w-full justify-center`}
                                    >
                                        {user.role}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell justify="center" className="py-4">
                                    <div className="flex justify-center">
                                        <Tooltip content="Alterar perfil do usuário">
                                            <IconButton
                                                variant="soft"
                                                color="violet"
                                                radius="full"
                                                onClick={() => onClickPencil(user._id)}
                                                className="hover:cursor-pointer transition-all hover:scale-110 hover:shadow-sm"
                                            >
                                                <Icon.Pencil size={16} weight="bold" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                ) : (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan={4} align="center" className="py-8">
                                <Flex direction="column" align="center" gap="3" className="text-gray-500">
                                    <Icon.Users size={32} weight="bold" />
                                    <Text weight="medium">Nenhum usuário encontrado.</Text>
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                )}
            </Table.Root>

            {loading ? (
                <SkeletonDataList itens={PAGE_SIZE} columns={4} titles={1} />
            ) : (
                <>
                    <DataList.Root orientation="vertical" className="w-full mobo">
                        {data?.researchers?.map((user) => (
                            <DataList.Item
                                key={user._id}
                                className="w-full rounded-2xl mb-4 transition-all duration-500 ease-out transform
                                bg-gradient-to-br from-white to-violet-50 shadow-sm hover:shadow-md 
                                border border-violet-200/80 backdrop-blur-sm overflow-hidden
                                hover:border-violet-300/60"
                            >
                                <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-xl px-4 py-3 border-b border-violet-100/50">
                                    <p className="text-[17px] font-semibold text-center text-violet-900 tracking-tight flex items-center justify-center gap-2">
                                        <Icon.User size={20} weight="bold" />
                                        Dados do Usuário
                                    </p>
                                </div>

                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Icon.User size={16} weight="bold" />
                                                Nome:
                                            </DataList.Label>
                                            <DataList.Value className="text-gray-900 font-medium">
                                                {getFirstAndLastName(user.fullname)}
                                            </DataList.Value>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Icon.Envelope size={16} weight="bold" />
                                                E-mail:
                                            </DataList.Label>
                                            <DataList.Value className="text-gray-700">
                                                {user.email}
                                            </DataList.Value>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Icon.UserGear size={16} weight="bold" />
                                                Perfil:
                                            </DataList.Label>
                                            <DataList.Value>
                                                <Badge
                                                    size="1"
                                                    variant="soft"
                                                    color={
                                                        user.role === "Revisor"
                                                            ? "orange"
                                                            : user.role === "Administrador"
                                                                ? "red"
                                                                : "blue"
                                                    }
                                                    className={`font-semibold border text-xs ${user.role === "Revisor" ? "!border-orange-500" : user.role === "Administrador" ? "!border-red-500" : "!border-blue-500"}`}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </DataList.Value>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-violet-100 shadow-sm">
                                            <DataList.Label className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Icon.Gear size={16} weight="bold" />
                                                Ações:
                                            </DataList.Label>
                                            <Tooltip content="Alterar perfil do usuário">
                                                <Button
                                                    onClick={() => onClickPencil(user._id)}
                                                    className="hover:cursor-pointer shadow-sm hover:shadow transition-all"
                                                    title="Alterar perfil"
                                                    color="violet"
                                                    size="Small"
                                                >
                                                    <Icon.Pencil size={16} weight="bold" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </DataList.Item>
                        ))}
                    </DataList.Root>
                </>
            )}
            <Pagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalCount={data?.totalResearchers || 1}
                onPageChange={(page: number) => setCurrentPage(page)}
            />
        </>

    );
};

export default UsersTable;
