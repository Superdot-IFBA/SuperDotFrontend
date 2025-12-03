import React from 'react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  titleColor: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  gradient,
  titleColor,
  children,
  className = ''
}) => {
  return (
    <div className={`rounded-xl p-4 -mx-2 ${gradient} ${className}`}>
      <p className={`text-[15px] font-semibold text-center ${titleColor} mb-3`}>
        {icon} {title}
      </p>
      {children}
    </div>
  );
};

export default SectionCard;