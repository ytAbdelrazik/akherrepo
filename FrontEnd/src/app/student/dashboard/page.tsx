"use client"; // Mark this file as a client component
import React, { useEffect, useState } from "react";
import apiClient from "../../../utils/apiClient";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

interface Course {
  courseId: string;
  title: string;
}

interface DecodedToken {
  userId: string;
  role: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

const StudentDashboard: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      // Decode the token to get the studentId
      const decodedToken = jwtDecode<DecodedToken>(token);
      const studentId = decodedToken.userId;

      if (!studentId) {
        throw new Error("Student ID not found in token");
      }

      // Fetch Enrolled Courses API
      const enrolledCoursesResponse = await apiClient.get("/courses/students/enrolled-courses");
      setEnrolledCourses(enrolledCoursesResponse.data);

      // Fetch Completed Courses API
      const completedCoursesResponse = await apiClient.get("/courses/students/completed");
      setCompletedCourses(completedCoursesResponse.data);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Student Dashboard</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Enrolled Courses */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Enrolled Courses</h2>
            <ul>
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <li
                    key={course.courseId}
                    className="mb-3 text-gray-600 text-base border-b pb-2"
                  >
                    <a
                      href={`/courses/${course.courseId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {course.title}
                    </a>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No enrolled courses found.</p>
              )}
            </ul>

          </div>

          {/* Completed Courses */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Completed Courses</h2>
            <ul>
              {completedCourses.length > 0 ? (
                completedCourses.map((course) => (
                  <li
                    key={course.courseId}
                    className="mb-3 text-gray-600 text-base border-b pb-2"
                  >
                    {course.title}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No completed courses found.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Update Profile and Search Button */}
        <div className="mt-8 text-center flex justify-center space-x-4">
          <Link href="/update-profile" legacyBehavior>
            <button className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700">
              Update Profile
            </button>
          </Link>
          <Link href="/search-courses" legacyBehavior>
            <button className="inline-block bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700">
              Search Courses
            </button>
          </Link>
          {/* Search Instructors */}
          <Link href="/student/searchinstructor" legacyBehavior>
            <button className="inline-block bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700">
              Search Instructors
            </button>
          </Link>

        </div>
        <div className="mt-8 text-center">
          <Link href="/student/quizzes" legacyBehavior>
            <button className="inline-block bg-purple-600 text-white py-2 px-6 rounded-md shadow hover:bg-purple-700">
              Go to Quizzes
            </button>
          </Link>
        </div>


      </div>
    </div>
  );
};

export default StudentDashboard;
