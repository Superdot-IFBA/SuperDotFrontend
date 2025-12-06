import * as Icon from '@phosphor-icons/react';

export const PasswordValidationCard = ({ password }: { password: string }) => {
  const validations = [
    {
      label: 'Mínimo de 8 caracteres',
      isValid: password.length >= 8,
    },
    {
      label: 'Letra maiúscula',
      isValid: /[A-Z]/.test(password),
    },
    {
      label: 'Letra minúscula',
      isValid: /[a-z]/.test(password),
    },
    {
      label: 'Número',
      isValid: /\d/.test(password),
    },
    {
      label: 'Símbolo especial',
      isValid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const allValid = validations.every(validation => validation.isValid);

  return (

    <div className={`mt-3 p-4 border rounded-lg transition-all duration-300 ${allValid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
      <h4 className="text-sm font-semibold text-gray-800 mb-2">
        Requisitos da senha {allValid && '✓'}
      </h4>
      <div className="space-y-2">
        {validations.map((validation, index) => (
          <div key={index} className="flex items-center gap-2">
            {validation.isValid ? (
              <Icon.CheckCircle size={16} className="text-green-500" weight="fill" />
            ) : (
              <Icon.Circle size={16} className="text-gray-300" />
            )}
            <span className={`text-sm ${validation.isValid ? 'text-green-700' : 'text-gray-500'}`}>
              {validation.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};