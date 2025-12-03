const CardAction = ({ children, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            disabled={disabled}
            className={`h-10 max-sm:h-8 w-full rounded-md px-2  text-white transition-all focus:outline-none btn-primary 
                ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-secondary "} 
                max-xl:w-full `}
            {...rest}
        >
            {children}
        </button>
    );
};
export default CardAction;