import * as Form from "@radix-ui/react-form";
import { Flex, Select } from "@radix-ui/themes";
import { ReactNode, forwardRef } from "react";

interface SelectFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["select"]> {
    label: string;
    name: string;
    errorMessage?: string;
    extraItem?: ReactNode;
    required?: boolean;
    className2?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label,
        name,
        errorMessage,
        className = "",
        className2,
        children,
        extraItem,
        onChange,
        onBlur,
        value,
        required,
        ...rest }, ref) => {
        return (
            <Form.Field className={`max-xl:w-full ${className2}`} name={name}>
                <Flex justify={"between"} align={"baseline"}>
                    <Form.Label className="text-sm font-semibold text-gray-800 mb-2 block text-left">
                        {label} {required && <span className="text-red-600">*</span>}
                    </Form.Label>
                </Flex>
                <Flex gap="4">
                    <Form.Control asChild>

                        <select
                            name={name}
                            ref={ref}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            {...rest}
                            className={`h-10 hover:cursor-pointer ${className}`}
                        >
                            {children}
                        </select>
                    </Form.Control>
                    {extraItem}
                </Flex>
                {errorMessage && <Form.Message className="error-message">{errorMessage}</Form.Message>}
            </Form.Field>
        );
    }
);

