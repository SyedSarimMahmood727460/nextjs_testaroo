'use client'

import { useState, useEffect } from 'react';
import { getTestResults, TestResult } from "../lib/DatabaseQueries";

export default function TestResults() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20; // Increased from 10 to 20

  useEffect(() => {
    fetchResults();
  }, [currentPage]);

  const fetchResults = async () => {
    const data = await getTestResults(currentPage, pageSize);
    setResults(data.results);
    setTotalPages(data.totalPages);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-full px-4">
      <div className="flex justify-between items-center py-4">
        <h2 className="text-xl font-bold">Test Results</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Tested</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule ID</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag Name</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Type</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Spec</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr key={result.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{result.job_id}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{result.url_tested}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{result.rule_id}</td>
                <td className="px-3 py-2 text-sm text-gray-500 max-w-xs truncate">{result.description}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{result.severity}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{result.tag_name || 'N/A'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{result.location_type || 'N/A'}</td>
                <td className="px-3 py-2 text-sm text-gray-500 max-w-xs truncate">{result.location_spec || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}