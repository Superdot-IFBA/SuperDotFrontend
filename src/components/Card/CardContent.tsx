import { Flex } from "@radix-ui/themes";

const CardContent = ({ children }: React.PropsWithChildren) => {
    return (
        <Flex direction="column" justify="center" className="text-left p-4 max-sm:p-4 space-y-3">
            {children}
        </Flex>
    )
};

export default CardContent;