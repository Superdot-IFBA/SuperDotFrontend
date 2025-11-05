import { Skeleton } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import * as Icon from "@phosphor-icons/react";

interface DcardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  style?: string;
  linkTo?: string;
  colorBadge?: "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky" | undefined;
  loading?: boolean;
  value?: number | string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function Dcard({
  title,
  icon,
  style,
  linkTo,
  loading,
  value,
  trend
}: DcardProps) {

  const navigate = useNavigate();

  function handleClick() {
    if (linkTo) navigate(linkTo);
  };

  return (
    <Skeleton loading={loading} className="h-full rounded-xl">
      <div
        className={`
          relative p-4 rounded-xl transition-all duration-300 
          shadow-lg hover:shadow-xl cursor-pointer min-h-[110px]
          flex flex-col justify-between group/card overflow-hidden
          ${style} 
          ${linkTo ? 'hover:scale-[1.02] active:scale-[0.99]' : ''}
        `}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80 mb-1 uppercase  ">
                {title}
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-white truncate">
                {value?.toLocaleString() || '0'}
              </p>
            </div>

            <div className="flex-shrink-0 ml-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                {icon}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trend.isPositive
                ? 'bg-green-500/20 text-green-100'
                : 'bg-red-500/20 text-red-100'
                }`}>
                <Icon.CaretUp
                  size={12}
                  className={trend.isPositive ? 'text-green-300' : 'text-red-300 rotate-180'}
                />
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}

            {linkTo && (
              <div className="flex items-center gap-1 text-white/60 group-hover/card:text-white/80 transition-colors">
                <span className="text-xs font-medium">Detalhes</span>
                <Icon.ArrowRight
                  size={14}
                  className="group-hover/card:translate-x-0.5 transition-transform"
                />
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover/card:border-white/20 transition-all duration-300" />
      </div>
    </Skeleton>
  );
}