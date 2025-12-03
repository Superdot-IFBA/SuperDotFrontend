import React from 'react';
import { DataList } from '@radix-ui/themes';

interface InfoGridProps {
  items: Array<{
    label: string;
    value: React.ReactNode;
    className?: string;
  }>;
  columns?: 1 | 2 | 3;
  className?: string;
}

const InfoGrid: React.FC<InfoGridProps> = ({
  items,
  columns = 2,
  className = ''
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-3 mt-4 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          <DataList.Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {item.label}
          </DataList.Label>
          <DataList.Value className={`text-sm font-semibold text-gray-900 ${item.className || ''}`}>
            {item.value}
          </DataList.Value>
        </div>
      ))}
    </div>
  );
};

export default InfoGrid;