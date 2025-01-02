"use client"; // Mark this file as a client component
import React, { useState } from "react";
import apiClient from "../../../utils/apiClient";
import { useRouter } from "next/navigation"; // For navigation

interface Instructor {
  userId: string;
  name: string;
  email: string;
}

const SearchInstructors: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Initialize useRouter for navigation

  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search query.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.get(`/courses/instructors/search`, {
        params: { query },
      });
      setInstructors(response.data);
    } catch (err: any) {
      console.error("Error searching instructors:", err);
      setError("Failed to fetch instructors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/student/dashboard"); // Navigate back to the dashboard
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Search Instructors
        </h1>

        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or ID"
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
          <p className="text-gray-600 text-center">Loading instructors...</p>
        ) : (
          <ul className="space-y-4">
            {instructors.length > 0 ? (
              instructors.map((instructor) => (
                <li
                  key={instructor.userId}
                  className="p-4 bg-white shadow rounded-lg border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-700">
                    {instructor.name}
                  </h3>
                  <p className="text-gray-500">Email: {instructor.email}</p>
                  <p className="text-gray-500">ID: {instructor.userId}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center">No instructors found.</p>
            )}
          </ul>
        )}

        {/* Back to Dashboard Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInstructors;
