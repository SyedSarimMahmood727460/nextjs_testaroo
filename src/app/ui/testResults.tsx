'use client'

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface TestResult {
  id: number;
  job_id: string;
  rule_id: string;
  description: string;
  severity: number;
  tag_name: string | null;
  location_type: string | null;
  location_spec: string | null;
}

interface ErrorCount {
  jobId: string;
  errorCount: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
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

const ErrorCountChart = ({ errorCounts, selectedUser }: { errorCounts: ErrorCount[], selectedUser: string }) => {
  const [chartData, setChartData] = useState<(ErrorCount & { jobIndex: number })[]>([]);

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

export default function TestResults() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorCounts, setErrorCounts] = useState<ErrorCount[]>([]);
  const [selectedUser, setSelectedUser] = useState('user1');
  const pageSize = 10;

  useEffect(() => {
    fetchResults();
  }, [currentPage]);
  
  useEffect(() => {
    fetchErrorCount();
  }, [selectedUser]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/get-test-results?page=${currentPage}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }
      const data = await response.json();
      setResults(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const fetchErrorCount = async () => {
    try {
      const response = await fetch(`/api/get-user-error-count?userId=${selectedUser}`);
      if (!response.ok) {
        throw new Error('Failed to fetch error counts');
      }
      const data = await response.json();
      setErrorCounts(data);
    } catch (error) {
      console.error('Error fetching error counts:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg mb-8">
        <table className="w-full min-w-max divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule ID</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Description</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag Name</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Type</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Location Spec</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{result.job_id}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{result.rule_id}</td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  <div className="max-w-xs truncate" title={result.description || 'No description available'}>
                    {result.description || 'N/A'}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{result.severity}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{result.tag_name || 'N/A'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{result.location_type || 'N/A'}</td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  <div className="max-w-xs truncate" title={result.location_spec || 'No location spec available'}>
                    {result.location_spec || 'N/A'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="user-select" className="text-sm font-medium text-gray-600">
            Select User:
          </label>
          <select
            id="user-select"
            onChange={handleUserChange}
            value={selectedUser}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
          >
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
            <option value="user3">User 3</option>
          </select>
        </div>
      </div>

      <ErrorCountChart errorCounts={errorCounts} selectedUser={selectedUser} />
    </div>
  );
}