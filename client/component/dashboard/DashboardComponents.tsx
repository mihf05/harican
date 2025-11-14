import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  hoverBorderColor: string;
  bgOpacityColor: string;
  subtitleColor?: string;
  subtitleIcon?: LucideIcon;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradientFrom,
  gradientTo,
  hoverBorderColor,
  bgOpacityColor,
  subtitleColor = "text-gray-600 dark:text-gray-400",
  subtitleIcon: SubtitleIcon,
}: StatCardProps) {
  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:${hoverBorderColor} overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgOpacityColor} opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs ${subtitleColor} mt-1 flex items-center gap-1`}>
              {SubtitleIcon && <SubtitleIcon className="h-3 w-3" />}
              {subtitle}
            </p>
          )}
        </div>
        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  children: ReactNode;
}

export function ChartCard({ title, icon: Icon, iconColor, children }: ChartCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {title}
      </h3>
      {children}
    </div>
  );
}

interface WelcomeHeaderProps {
  name: string;
  subtitle: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export function WelcomeHeader({
  name,
  subtitle,
  icon: Icon,
  gradientFrom,
  gradientVia,
  gradientTo,
}: WelcomeHeaderProps) {
  return (
    <div className={`mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} p-8 text-white shadow-2xl`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Icon className="h-10 w-10" />
          {name}
        </h1>
        <p className="text-lg opacity-90">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
