import { Activity } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface JobPerformanceChartProps {
  data: Array<{ month: string; posted: number; active: number }>;
  loading: boolean;
}

export function JobPerformanceChart({ data, loading }: JobPerformanceChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Job Posting Trends
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Monthly performance overview
          </p>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[250px]">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading chart data...</p>
          </div>
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorPosted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" opacity={0.5} />
            <XAxis 
              dataKey="month" 
              className="text-xs" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              className="text-xs" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
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
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="posted" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
              name="Posted Jobs"
            />
            <Line 
              type="monotone" 
              dataKey="active" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
              name="Active Jobs"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No job posting data available</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Data will appear once you post jobs</p>
          </div>
        </div>
      )}
    </div>
  );
}
