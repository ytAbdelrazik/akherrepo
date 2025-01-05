"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "../../../utils/apiClient";

interface Course {
  courseId: string;
  title: string;
  description: string;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreatedCourses();
  }, []);

  const fetchCreatedCourses = async () => {
    try {
      const response = await apiClient.get("/courses/inst/courses");
      setCourses(response.data);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses.");
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Courses</h1>

        <div className="grid gap-6">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-blue-600">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex space-x-4">
                <Link href={`/instructor/courses/${course.courseId}/edit`} legacyBehavior>
                  <button className="bg-purple-600 text-white py-2 px-6 rounded-md shadow hover:bg-purple-700">
                    Edit Course
                  </button>
                </Link>
                <Link href={`/instructor/courses/${course.courseId}/multimedia`} legacyBehavior>
                  <button className="bg-yellow-600 text-white py-2 px-6 rounded-md shadow hover:bg-yellow-700">
                    Manage Multimedia
                  </button>
                </Link>
                <Link href={`/instructor/courses/${course.courseId}/create-module`} legacyBehavior>
                  <button className="bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700">
                    Create Module
                  </button>
                </Link>
                <Link href={`/instructor/courses/${course.courseId}/modules`} legacyBehavior>
                  <button className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700">
                    View Modules
                  </button>
                </Link>
                <Link href={`/instructor/courses/${course.courseId}/versions`} legacyBehavior>
                  <button className="bg-teal-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700">
                    Manage Versions
                  </button>
                </Link>
                <Link href={`/instructor/courses/${course.courseId}/quizzes`} legacyBehavior>
                  <button className="bg-orange-600 text-white py-2 px-6 rounded-md shadow hover:bg-orange-700">
                    View Quizzes
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link href="/instructor/dashboard" legacyBehavior>
            <button className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
