"use client";

import React, { useState } from "react";
import apiClient from "../../../utils/apiClient";
import { useRouter } from "next/navigation";

interface Student {
  name: string;
  email: string;
  userId: string;
}

const SearchStudents: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSearch = async () => {
    if (!name.trim()) {
      setError("Please enter a student name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/users/search", {
        params: { name },
      });
      setStudents(response.data);
    } catch (err: any) {
      console.error("Error searching students:", err);
      setError("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Search Students</h1>

        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            className="flex-grow px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-600 text-center">Loading students...</p>
        ) : (
          <ul className="space-y-4">
            {students.length > 0 ? (
              students.map((student) => (
                <li
                  key={student.userId}
                  className="p-4 bg-white shadow rounded-lg border border-gray-200"
                >
                  <p className="text-xl font-semibold text-gray-800">{student.name}</p>
                  <p className="text-gray-600">Email: {student.email}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center">No students found.</p>
            )}
          </ul>
        )}

        <button
          onClick={() => router.push("/instructor/dashboard")}
          className="mt-8 bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SearchStudents;
