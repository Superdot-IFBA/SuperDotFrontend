import React from "react";
import { Skeleton } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ChartContainerProps {
  title: string;
  loading: boolean;
  children: React.ReactNode;
  tooltip?: string;
  fullHeight?: boolean;
  className?: string;
  actionButtons?: React.ReactNode;
  error?: string | null;
}

const ChartContainer = ({
  title,
  loading,
  children,
  tooltip,
  fullHeight = false,
  className = "",
  actionButtons,
  error,
}: ChartContainerProps) => (
  <div className={`${fullHeight ? "h-full" : "h-80"} ${className}`}>
    <Skeleton loading={loading} className="h-full rounded-xl">
      <div className={`
        bg-white p-4 rounded-xl shadow-lg border border-gray-100 
        hover:shadow-xl transition-all duration-200 h-full flex flex-col
        ${error ? "border-red-300 bg-red-50" : ""}
        group/chart-container
      `}>
        {/* Header Section - Mais Compacto */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-semibold text-gray-800 truncate`}>
              {title}
            </h3>
            {tooltip && (
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                      aria-label="Mais informações"
                    >
                      <Icon.Info className="w-3.5 h-3.5" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="max-w-xs p-3 text-sm bg-gray-800 text-white rounded-lg shadow-xl z-50"
                      sideOffset={5}
                    >
                      {tooltip}
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </div>

          {actionButtons && (
            <div className="flex gap-1 opacity-70 group-hover/chart-container:opacity-100 transition-opacity">
              {actionButtons}
            </div>
          )}
        </div>

        {/* Content Area - Otimizado para altura reduzida */}
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
            <div className="bg-red-100 p-2 rounded-full mb-2">
              <Icon.ExclamationMark className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm font-medium text-red-600 mb-1">Erro ao carregar</p>
            <p className="text-xs text-red-500">{error}</p>
            <button
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className={`flex-1 -mx-2 -mb-2`}>
            {children}
          </div>
        )}
      </div>
    </Skeleton>
  </div>
);

export default ChartContainer;