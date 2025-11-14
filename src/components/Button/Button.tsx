import { Flex } from '@radix-ui/themes';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';

const SIZE_TYPES = ["Large", "Medium", "Small", "Extra Small", "Full", ""] as const;
const COLOR_TYPES = ['primary', 'red', 'green', 'gray', 'secondary', 'white', 'yellow', 'gradiente', 'violet', 'emerald', 'orange', 'blue', 'amber', ''] as const;

type size = typeof SIZE_TYPES[number];
type color = typeof COLOR_TYPES[number];

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  size?: size;
  children?: ReactNode;
  className?: string;
  classNameTitle?: string;
  color?: color;
  loading?: boolean;
}

const sizeClasses = {
  Large: 'h-10 px-4 !text-lg',
  Medium: 'h-8 px-4 !text-base',
  Small: 'h-7 px-3 !text-sm',
  'Extra Small': 'h-6 px-2 !text-xs',
  Full: 'w-full py-1 !text-lg',
  '': ''
} satisfies Record<size, string>;

const colorClasses = {
  primary: 'bg-primary text-white hover:bg-secondary active:bg-primary active:brightness-90 shadow-sm hover:shadow transition-all',
  red: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow transition-all',
  green: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-sm hover:shadow transition-all',
  gray: 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 shadow-sm hover:shadow transition-all',
  secondary: 'bg-secondary text-white hover:bg-primary shadow-sm hover:shadow transition-all',
  white: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow transition-all',
  yellow: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 shadow-sm hover:shadow transition-all',
  gradiente: "bg-gradient-to-br from-violet-600 via-purple-500 to-primary hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg",

  // Novas cores adicionadas
  violet: 'bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
  emerald: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
  orange: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
  blue: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
  amber: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',

  // Versões suaves/outlined
  "": ''
} satisfies Record<color, string>;

// Versão alternativa com cores mais suaves (se preferir)
const softColorClasses = {
  violet: 'bg-violet-100 text-violet-800 border border-violet-200 hover:bg-violet-200 active:bg-violet-300 shadow-sm transition-all',
  emerald: 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 active:bg-emerald-300 shadow-sm transition-all',
  orange: 'bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200 active:bg-orange-300 shadow-sm transition-all',
  blue: 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 active:bg-blue-300 shadow-sm transition-all',
  amber: 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 active:bg-amber-300 shadow-sm transition-all',
  yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 active:bg-yellow-300 shadow-sm transition-all',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      title,
      children,
      color = 'primary',
      size = 'Medium',
      className = '',
      classNameTitle = '',
      disabled,
      loading = false,
      ...props
    },
    ref
  ) => {
    const sizeClass = sizeClasses[size as size];
    const colorClass = colorClasses[color as color];

    const baseClasses = [
      'inline-flex items-center justify-center rounded-md font-medium',
      'transition-colors btn-primary',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100',
      disabled && 'opacity-50 cursor-not-allowed',
      sizeClass,
      colorClass,
      className
    ].filter(Boolean).join(' ');

    const Spinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Flex align="center" gap="2">
            <Spinner />
            <span className={`whitespace-nowrap ${classNameTitle}`}>
              Carregando...
            </span>
          </Flex>
        ) : (
          <Flex align="center" gap="2" justify={'center'}>
            {children}
            <span
              className={`whitespace-nowrap truncate ${classNameTitle} ${title === "" ? 'hidden' : ""}`}
            >
              {title}
            </span>
          </Flex>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Componente adicional para botões com estilo suave/outlined
export const SoftButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      title,
      children,
      color = 'violet',
      size = 'Medium',
      className = '',
      classNameTitle = '',
      disabled,
      loading = false,
      ...props
    },
    ref
  ) => {
    const sizeClass = sizeClasses[size as size];
    const colorClass = softColorClasses[color as keyof typeof softColorClasses] || softColorClasses.violet;

    const baseClasses = [
      'inline-flex items-center justify-center rounded-md font-medium',
      'transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      disabled && 'opacity-50 cursor-not-allowed',
      sizeClass,
      colorClass,
      className
    ].filter(Boolean).join(' ');

    const Spinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Flex align="center" gap="2">
            <Spinner />
            <span className={`whitespace-nowrap ${classNameTitle}`}>
              Carregando...
            </span>
          </Flex>
        ) : (
          <Flex align="center" gap="2" justify={'center'}>
            {children}
            <span
              className={`whitespace-nowrap truncate ${classNameTitle} ${title === "" ? 'hidden' : ""}`}
            >
              {title}
            </span>
          </Flex>
        )}
      </button>
    );
  }
);

SoftButton.displayName = 'SoftButton';