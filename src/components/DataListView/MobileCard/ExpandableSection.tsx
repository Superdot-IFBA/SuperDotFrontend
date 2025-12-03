import React from 'react';

interface ExpandableSectionProps {
  isExpanded: boolean;
  children: React.ReactNode;
  className?: string;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  isExpanded,
  children,
  className = ''
}) => {
  return (
    <div className={`
      transition-all duration-500 ease-in-out overflow-hidden
      ${isExpanded
        ? 'max-h-[1000px] opacity-100 translate-y-0'
        : 'max-h-0 opacity-0 -translate-y-4'
      } ${className}
    `}>
      {isExpanded && children}
    </div>
  );
};

export default ExpandableSection;