import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  hoverBorderColor: string;
  bgOpacityColor: string;
  textColor: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradientFrom,
  gradientTo,
  hoverBorderColor,
  bgOpacityColor,
  textColor,
}: StatsCardProps) {
  return (
    <div className={cn(
      "group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl",
      "transition-all duration-300 p-6 border-2 border-transparent overflow-hidden",
      hoverBorderColor
    )}>
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full -mr-12 -mt-12",
        "group-hover:scale-150 transition-transform duration-500",
        bgOpacityColor
      )}></div>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className={cn("text-xs mt-1 flex items-center gap-1 font-medium", textColor)}>
            {subtitle}
          </p>
        </div>
        <div className={cn(
          "h-14 w-14 rounded-xl flex items-center justify-center shadow-lg",
          `bg-gradient-to-br ${gradientFrom} ${gradientTo}`
        )}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}
