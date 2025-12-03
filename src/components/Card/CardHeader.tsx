interface CardHeaderProps {
    children: React.ReactNode
    background?: string
}

const CardHeader = ({ children, background }: CardHeaderProps) => {
    return (
        <div className={`py-5 px-6 max-sm:px-4 ${background ? background : 'bg-gradient-to-r from-gray-50 to-gray-100/30 border-b border-gray-200/50'}`}>
            {children}
        </div>
    )
};

export default CardHeader;