'use client';

import React, { useEffect, useState } from 'react';
import { getFailedLogins } from '../../../../utils/apiClient';

interface FailedLogin {
  id: string;
  email: string;
  timestamp: string;
  reason: string;
}

const FailedLoginsPage: React.FC = () => {
  const [logs, setLogs] = useState<FailedLogin[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getFailedLogins();
        setLogs(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLogs();
  }, []);

  if (error) {
    return <p className="text-red-500 font-semibold">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back button */}
      <button
        onClick={() => window.history.back()} // Use the browser's back functionality
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back
      </button>
      
      <h1 className="text-2xl font-bold mb-4">Failed Logins</h1>
      {logs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={
                    index % 2 === 0
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{log.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No failed login attempts found.</p>
      )}
    </div>
  );
};

export default FailedLoginsPage;
