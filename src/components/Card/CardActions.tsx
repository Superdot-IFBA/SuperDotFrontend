interface cardActionProps {
    children: React.ReactNode,
    className?: string,
}

const CardActions = ({ children, className }: cardActionProps) => {
    return (
        <div className={`flex items-center gap-3 justify-between p-4 max-sm:p-4 pt-4 border-t border-gray-200/50 bg-gray-50/50 ${className}`}>
            {children}
        </div>
    )
};

export default CardActions;