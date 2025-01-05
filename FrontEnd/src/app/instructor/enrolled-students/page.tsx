"use client";

import React, { useState, useEffect } from "react";
import apiClient from "../../../utils/apiClient";
import { useRouter } from "next/navigation";

interface Course {
  courseId: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
}

const EnrolledCourses: React.FC = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchEnrolledCourses = async () => {
    if (!studentId) {
      setError("Please provide a Student ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/courses/students/${studentId}/enrolled-courses`);
      setCourses(response.data);
    } catch (err: any) {
      console.error("Error fetching enrolled courses:", err);
      setError("Failed to load enrolled courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Enrolled Courses</h1>

        {/* Student ID Input */}
        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
            className="flex-grow px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          <button
            onClick={fetchEnrolledCourses}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
          >
            Fetch Enrolled Courses
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : courses.length > 0 ? (
          <div className="grid gap-6">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-blue-600">{course.title}</h2>
                <p className="text-gray-600">Category: {course.category}</p>
                <p className="text-gray-600">Created By: {course.createdBy}</p>
                <p className="text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No enrolled courses found for this student.</p>
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

export default EnrolledCourses;
