import * as Form from "@radix-ui/react-form";
import { Flex } from "@radix-ui/themes";
import { forwardRef } from "react";

interface InputFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["input"]> {
    label?: string;
    placeholder?: string;
    name: string;
    errorMessage?: React.ReactNode;
    icon?: React.ReactNode;
    actionButton?: React.ReactNode;
    required?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, placeholder, name, errorMessage, type, className, icon, actionButton, required, ...rest }, ref) => {

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (type === "number") {
                if (e.key === "-" || e.key === "e" || e.key === "+") {
                    e.preventDefault();
                }
            }

            if (rest.onKeyDown) {
                rest.onKeyDown(e);
            }
        };

        return (
            <Form.Field className={`w-full ${label ? "mb-2" : "mb-0"} rounded-lg ${className}`} name={name}>
                {label && (
                    <Form.Label className="text-sm font-semibold text-gray-800 mb-2 block text-left">
                        {label} {required && <span className="text-red-600">*</span>}
                    </Form.Label>
                )}

                <Flex justify="center" align="center" className="rounded-md !border-2 bg-white modern-input !py-[2px]">
                    {icon && <Flex className="p-2">{icon}</Flex>}

                    <Form.Control asChild>
                        <input
                            {...rest}
                            ref={ref}
                            placeholder={placeholder}
                            type={type}
                            min={type === "number" ? 0 : undefined}
                            onKeyDown={handleKeyDown}
                            {...rest}
                            className="bg-white focus-within:ring-0 border-none max-sm:placeholder:text-[12px] max-sm:p-2 !font-roboto"
                        />
                    </Form.Control>

                    {actionButton && <Flex className="p-1 pr-3 text-gray-500">{actionButton}</Flex>}
                </Flex>

                {errorMessage && <Form.Message className="error-message">{errorMessage}</Form.Message>}
            </Form.Field>

        );
    }
);

