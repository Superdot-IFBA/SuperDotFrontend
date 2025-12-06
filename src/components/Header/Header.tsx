import { Flex } from '@radix-ui/themes';
import UserInfo from '../UserInfo/UserInfo';
import React from 'react';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import * as Icon from "@phosphor-icons/react";

interface HeaderProps {
    title: string;
    icon?: React.ReactNode;
    onMenuToggle?: () => void;
}
const headerConfig: Record<string, { title: string; icon: JSX.Element }> = {
    "Dashboard": { title: "Dashboard", icon: <Icon.SquaresFour size={20} className='text-primary w-6 h-6' /> },
    "choose-sample-group": { title: "Escolher Grupo de Amostras", icon: <Icon.Binoculars size={20} className='text-primary w-6 h-6' /> },
    "my-samples": { title: "Minhas Amostras", icon: <Icon.Books size={20} className='text-primary w-6 h-6' /> },
    "create-sample": { title: "Criar Amostra", icon: <Icon.FolderSimplePlus size={20} className='text-primary w-6 h-6' /> },
    "edit-sample": { title: "Editar Amostra", icon: <Icon.PencilSimple size={20} className='text-primary w-6 h-6' /> },
    "my-samples/participants-registration": { title: "Cadastro de Participantes", icon: <Icon.UserPlus size={20} className='text-primary w-6 h-6' /> },
    "my-samples/analyze-sample": { title: "Análise da Amostra", icon: <Icon.MagnifyingGlass size={20} className='text-primary w-6 h-6' /> },
    "users": { title: "Usuários", icon: <Icon.UsersThree size={20} className='text-primary w-6 h-6' /> },
    "review-requests": { title: "Revisar Solicitações", icon: <Icon.CheckCircle size={20} /> },
    "logout": { title: "Sair", icon: <Icon.SignOut size={20} className='text-primary w-6 h-6' /> },
    "my-samples/seconds-source-compare": { title: "Comparar Segunda Fonte", icon: <Icon.UsersFour size={20} className='text-primary w-6 h-6' /> },
    "my-samples/compare-participants-selected": { title: "Comparar Participantes", icon: <Icon.UsersFour size={20} className='text-primary w-6 h-6' /> },
    "my-samples/evaluate-autobiography": { title: "Avaliar Autobiografia", icon: <Icon.BookOpen size={20} className='text-primary w-6 h-6' /> },
} as const;
export function Header({ title, icon }: HeaderProps) {


    return (
        <Flex
            asChild
            className={`w-full bg-white border-b border-gray-100 fixed top-0 z-30 h-16 px-4 sm:px-6 xl:pl-24 transition-all duration-300 ease-in-out max-xl:mt-11 shadow-bottom-lg`}
        >
            <header>

                <Flex direction="column" className="w-full h-full !justify-center">
                    <Flex align="center" className="w-full h-10 !justify-between">
                        <Flex align="center" className="text-gray-800 gap-3">
                            {icon && React.cloneElement(icon as React.ReactElement, {
                                className: "text-primary w-6 h-6"
                            })}
                            <h1 className="text-xl font-semibold truncate">
                                {title}
                            </h1>
                        </Flex>

                        <Flex align="center" gap="4" className="flex-shrink-0 mr-14 max-xl:!hidden">
                            <div className="hidden md:flex !pt-6">
                                <UserInfo />
                            </div>
                        </Flex>
                    </Flex>

                    <Breadcrumbs headerConfig={headerConfig} />
                </Flex>
            </header>

        </Flex>
    );
}