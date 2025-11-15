import { PieChart as PieChartIcon } from "lucide-react";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface JobStatusChartProps {
  activeJobs: number;
  inactiveJobs: number;
}

const COLORS = ['#10b981', '#6b7280'];

export function JobStatusChart({ activeJobs, inactiveJobs }: JobStatusChartProps) {
  const jobStatusData = [
    { name: 'Active', value: activeJobs },
    { name: 'Inactive', value: inactiveJobs },
  ];

  const totalJobs = activeJobs + inactiveJobs;

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
          <PieChartIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Job Status Distribution
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Active vs Inactive breakdown
          </p>
        </div>
      </div>
      {totalJobs > 0 ? (
        <div className="relative">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={jobStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={85}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
              >
                {jobStatusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  padding: '12px 16px'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                formatter={(value, entry: any) => (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {value} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalJobs}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Jobs</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <PieChartIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No job status data available</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Post your first job to see the distribution</p>
          </div>
        </div>
      )}
    </div>
  );
}
