import React from 'react';
import {
  DataList,
  Flex,
  Checkbox,
} from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';

interface MobileCardProps {
  children: React.ReactNode;
  isSelected?: boolean;
  isExpanded?: boolean;
  onSelect?: () => void;
  onToggleExpand?: (e: React.MouseEvent) => void;
  className?: string;
  selectedLabel?: string;
  unselectedLabel?: string;
  expandedLabel?: string;
  collapsedLabel?: string;
  showHeader?: boolean;
  headerTitle?: string;
  headerIcon?: React.ReactNode;
  showFooter?: boolean;
}

const MobileCard: React.FC<MobileCardProps> = ({
  children,
  isSelected = false,
  isExpanded = false,
  onSelect,
  onToggleExpand,
  className = '',
  selectedLabel = "Selecionado",
  unselectedLabel = "Selecionar",
  expandedLabel = "Ver menos",
  collapsedLabel = "Ver mais",
  showHeader = true,
  headerTitle = "Informações",
  headerIcon = <Icon.User size={20} weight="bold" className="inline-block mr-2" />,
  showFooter = true,
}) => {
  return (
    <DataList.Item
      className={`w-full rounded-2xl mb-4 transition-all duration-500 ease-out !gap-0 transform
        bg-gradient-to-br from-white to-violet-50 shadow-sm hover:shadow-md border border-violet-200/80 backdrop-blur-sm 
        ${isSelected ? 'ring-2 ring-primary ring-opacity-50 bg-violet-500 shadow-md scale-[0.998]' : ''} 
        ${isExpanded ? 'max-h-[1250px] opacity-100' : 'max-h-[280px] opacity-100'}
        hover:border-violet-300/60 ${className}`}
    >
      {showHeader && (
        <div className={`bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-xl px-4 py-3 border-b border-violet-100/50 ${isSelected ? 'bg-violet-200' : ''}`}>
          <p className="text-[17px] font-semibold text-center text-violet-900 tracking-tight">
            {headerIcon} {headerTitle}
          </p>
        </div>
      )}

      <div className={`${isSelected ? 'bg-violet-50' : ''} pb-4 px-4`}>
        {children}
      </div>

      {(onSelect || onToggleExpand) && showFooter && (
        <div className={`p-4 pt-3 border-t border-gray-200/60 ${isSelected ? 'bg-violet-200' : ''} rounded-b-xl`}>
          <Flex direction="row" align="center" justify="between" className="mb-2">
            {onSelect && (
              <Flex direction="row" gap="2" align="center">
                <Checkbox
                  id='checkbox'
                  className="hover:cursor-pointer transition-all hover:scale-105"
                  checked={isSelected}
                  onCheckedChange={onSelect}
                  color="violet"
                />
                <label htmlFor="checkbox" className="text-[13px] font-medium text-gray-700">
                  {isSelected ? selectedLabel : unselectedLabel}
                </label>
              </Flex>
            )}

            {onToggleExpand && (
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-700 text-[13px] font-medium transition-all hover:bg-violet-500/20 hover:scale-105 active:scale-95"
                onClick={onToggleExpand}
              >
                {isExpanded ? expandedLabel : collapsedLabel}
                <Icon.CaretDown
                  size={14}
                  className={`transition-all duration-500 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </Flex>
        </div>
      )}
    </DataList.Item>
  );
};

export default MobileCard;