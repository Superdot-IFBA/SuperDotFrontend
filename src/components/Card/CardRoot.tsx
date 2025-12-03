import { Skeleton } from "@radix-ui/themes";

interface CardRootProps extends React.PropsWithChildren {
    className?: string;
    loading?: boolean;
}

const CardRoot = ({ children, className, loading }: CardRootProps) => {
    return (
        <Skeleton loading={loading ? loading : false} className="h-full">
            <div
                className={`w-full mb-6 rounded-2xl card-container overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out group border border-gray-200/60  font-roboto ${className}`}
            >
                {children}
            </div>
        </Skeleton>
    );
};

export default CardRoot;