'use client'

import { useState } from 'react';
import { insertTestData } from '../lib/fetchDataQueries';

export default function UrlForm() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Submitting...');
    try {
      const response = await fetch('/api/create-testaro-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (response.ok) {
        setMessage('Job created successfully!');
        

        setTimeout(async () => {
          try {
            const res = await fetch('/api/callRun');
            if (!res.ok) {
              throw new Error('Failed to execute call file');
            }
            const data = await res.json();
            console.log(data.message);
          } catch (error) {
            console.error('Error:', error);
          }
        }, 4000);
        insertTestData("umaid");
      }
      else {
        setMessage('Error creating job');
      }
    } catch (error) {
      setMessage('Error submitting job');
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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