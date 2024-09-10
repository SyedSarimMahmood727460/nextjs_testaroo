import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ErrorCount {
  jobId: string;
  errorCount: number;
}

interface ChartDataItem extends ErrorCount {
  jobIndex: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataItem }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{`Job ID: ${payload[0].payload.jobId}`}</p>
        <p className="text-sm text-gray-600">{`Error Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface ErrorCountChartProps {
  errorCounts: ErrorCount[];
  selectedUser: string;
}

const ErrorCountChart: React.FC<ErrorCountChartProps> = ({ errorCounts, selectedUser }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const processedData = errorCounts.map((item, index) => ({
      ...item,
      jobIndex: index + 1,
    }));
    setChartData(processedData);
  }, [errorCounts]);

  const totalErrors = chartData.reduce((sum, item) => sum + item.errorCount, 0);
  const averageErrors = totalErrors / chartData.length || 0;
  const latestErrorCount = chartData[chartData.length - 1]?.errorCount || 0;
  const previousErrorCount = chartData[chartData.length - 2]?.errorCount || 0;
  const errorDifference = latestErrorCount - previousErrorCount;
  const errorPercentageChange = previousErrorCount !== 0
    ? ((latestErrorCount - previousErrorCount) / previousErrorCount) * 100
    : 0;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Error Counts for {selectedUser}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Total Errors</p>
            <p className="text-2xl font-semibold text-gray-700">{totalErrors}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Average Errors</p>
            <p className="text-2xl font-semibold text-gray-700">{averageErrors.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Latest Error Count</p>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-gray-700">{latestErrorCount}</p>
              <span className={`ml-2 ${errorDifference >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                {errorDifference >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                {Math.abs(errorPercentageChange).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="jobIndex" 
              label={{ value: 'Job Number', position: 'insideBottom', offset: -5 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Error Count', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="errorCount" 
              fill="#8884d8" 
              name="Error Count"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.errorCount > averageErrors ? '#ff7675' : '#74b9ff'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ErrorCountChart;