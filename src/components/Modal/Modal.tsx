import * as Icon from "@phosphor-icons/react";
import { Dialog, ScrollArea } from "@radix-ui/themes";
import { Button } from "../Button/Button";

interface ModalProps extends React.PropsWithChildren {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    accessibleDescription: string;
    className?: string;
    classNameChildren?: string;
    onclickCancel?: () => void;
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
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content className={`relative bg-white rounded-md !p-0 z-50 ${className} !font-roboto fixed w-[95vw] max-w-[900px] overflow-hidden`}>
                <Dialog.Close className="absolute top-2 right-2 !font-roboto z-10">
                    <Button
                        className="hover:cursor-pointer"
                        aria-label="Close modal"
                        title={""}
                        color={"red"}
                        size={"Small"}
                        onClick={onclickCancel}
                    >
                        <Icon.X size={20} weight="bold" />
                    </Button>
                </Dialog.Close>

                <div className="flex flex-col h-full">
                    <div className="flex-shrink-0">
                        <Dialog.Title
                            className={`text-xl font-bold max-sm:!text-[18px] text-white !font-roboto bg-gradient-to-br from-violet-600 via-purple-500 to-primary py-6 max-sm:py-4 w-full flex justify-center items-center ${title ? '' : 'hidden'}`}
                        >
                            {title}
                        </Dialog.Title>

                        <Dialog.Description
                            className={`${accessibleDescription ? '' : 'hidden'} px-6 py-4 !font-roboto text-sm max-sm:text-xs border-b`}
                        >
                            {accessibleDescription}
                        </Dialog.Description>
                    </div>

                    <ScrollArea
                        type="auto"
                        scrollbars="vertical"
                        className="flex-1"
                        style={{
                            height: '100%',
                            maxHeight: 'calc(85vh - 120px)'
                        }}
                    >
                        <div className={`px-6 py-4 max-sm:px-2 ${classNameChildren}`}>
                            {children}
                        </div>
                    </ScrollArea>

                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default Modal;