'use client'

import React, { useState } from 'react';

export default function UrlForm() {
  const [url, setUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  // Hardcoded list of users for the dropdown
  const users = [
    { id: 'user1', name: 'User 1' },
    { id: 'user2', name: 'User 2' },
    { id: 'user3', name: 'User 3' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Submitting...');
    try {
      // Create Testaro job
      const jobResponse = await fetch('/api/create-testaro-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!jobResponse.ok) {
        throw new Error('Failed to create job');
      }

      const jobData = await jobResponse.json();
      const jobId = jobData.jobId; // Assuming the API returns the jobId

      // Insert user error count record
      const errorCountResponse = await fetch('/api/insert-user-error-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, jobId, errorCount: 30 }) // Initial error count is 0
      });

      if (!errorCountResponse.ok) {
        throw new Error('Failed to insert user error count');
      }

      setMessage('Job created and user record inserted successfully!');

      // Run the job
      setTimeout(async () => {
        try {
          const res = await fetch('/api/callRun');
          if (!res.ok) {
            throw new Error('Failed to execute call file');
          }
          const data = await res.json();
          console.log(data.message);
        } catch (error) {
          console.error('Error executing call file:', error instanceof Error ? error.message : String(error));
        }
      }, 2000);
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : 'An unknown error occurred'));
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
          Select User
        </label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Enter URL to test
        </label>
        <div className="flex rounded-md shadow-sm">
          <input
            type="url"
            name="url"
            id="url"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </div>
      {message && (
        <p className="mt-2 text-sm text-gray-600">
          {message}
        </p>
      )}
    </form>
  );
}