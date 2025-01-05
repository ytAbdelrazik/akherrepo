"use client"; // Mark this file as a client component
import React, { useState } from "react";
import apiClient from "../../utils/apiClient";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

interface Course {
  courseId: string;
  title: string;
  category: string;
  createdBy: string;
}

const SearchCourses: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
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
      const response = await apiClient.get(`/courses/search/courses`, {
        params: { query },
      });
      setCourses(response.data);
    } catch (err: any) {
      console.error("Error searching courses:", err);
      setError("Failed to fetch courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPreviousPage = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Search Courses
        </h1>

        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, category, id, or creator"
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
          <p className="text-gray-600 text-center">Loading courses...</p>
        ) : (
          <ul className="space-y-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <li
                  key={course.courseId}
                  className="p-4 bg-white shadow rounded-lg border border-gray-200"
                >
                  <a
                    href={`/courses/${course.courseId}`}
                    className="text-xl font-semibold text-blue-600 hover:underline"
                  >
                    {course.title}
                  </a>
                  <p className="text-gray-500">Category: {course.category}</p>
                  <p className="text-gray-500">Created By: {course.createdBy}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center">No courses found.</p>
            )}
          </ul>
        )}

        {/* Back to Previous Page Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToPreviousPage}
            className="px-6 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchCourses;
