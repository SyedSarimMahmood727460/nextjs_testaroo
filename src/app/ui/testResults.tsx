'use client'

import { useState, useEffect } from 'react';

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

export default function TestResults() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchResults();
  }, [currentPage]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      {/* <h1 className="text-2xl font-bold mb-4">Test Results</h1> */}
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