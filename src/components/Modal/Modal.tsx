import * as Icon from "@phosphor-icons/react";
import { AlertDialog, Flex, Text } from "@radix-ui/themes";
import { Button } from "../Button/Button";

interface ModalProps extends React.PropsWithChildren {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    accessibleDescription: string;
    className?: string;
    classNameChildren?: string;
    onclickCancel?: () => void
}

const Modal = ({
    title,
    accessibleDescription,
    open,
    setOpen,
    children,
    className,
    classNameChildren,
    onclickCancel
}: ModalProps) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content className={`relative bg-white rounded-md !p-0 z-50 ${className} !font-roboto`}>
                <AlertDialog.Cancel className="absolute top-2 right-2 !font-roboto">
                    <Button
                        className="hover:cursor-pointer"
                        aria-label="Close modal" title={""} color={"red"} size={"Small"}
                        onClick={onclickCancel}>
                        <Icon.X size={20} weight="bold" />
                    </Button>
                </AlertDialog.Cancel>


                <AlertDialog.Title className={`text-xl font-bold max-sm:!text-[18px] text-white !font-roboto bg-gradient-to-br from-violet-600 via-purple-500 to-primary py-6 w-full flex justify-center items-center ${title ? '' : 'hidden'}`}>{title}</AlertDialog.Title>

                <AlertDialog.Description className={`${accessibleDescription ? '' : 'hidden'} px-6 mb-3`}>
                    <Flex direction="column" gap="2" className="mb-6 !font-roboto">
                        <Text as="p" className="text-sm max-sm:text-xs">
                            {accessibleDescription}
                        </Text>
                    </Flex>
                </AlertDialog.Description>
                <div className={`px-6 pt-0 mb-6 ${classNameChildren}`}>{children}</div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default Modal;
