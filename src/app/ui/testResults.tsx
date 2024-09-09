'use client'

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

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
        <label htmlFor="user-select" className="sr-only">Select User</label>
          <select
            id="user-select"

            onChange={handleUserChange}
            className="px-3 py-1 border rounded text-xs font-medium text-gray-700 bg-white"
          >
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
            <option value="user3">User 3</option>
          </select>
        <Dialog>
          <DialogTrigger asChild>
            <button className="px-3 py-1 border rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
              Show Graph
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Error Counts for {selectedUser}</DialogTitle>
            </DialogHeader>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jobId" tickFormatter={() => ""} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="errorCount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
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
    </div>
  );
}