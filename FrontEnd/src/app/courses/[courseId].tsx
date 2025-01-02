"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "../../utils/apiClient";

interface Course {
  courseId: string;
  title: string;
  description: string;
  multimedia: string; // URL for multimedia (image or video)
  difficulty: string;
}

const CourseDetails: React.FC = () => {
  const router = useRouter();
  const { courseId } = router.query;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId as string);
    }
  }, [courseId]);

  const fetchCourseDetails = async (id: string) => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (err: any) {
      console.error("Error fetching course details:", err);
      setError("Course not found or failed to load details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{course?.title}</h1>
        <p className="text-gray-600 mb-2">Difficulty: {course?.difficulty}</p>
        <p className="text-gray-600 mb-6">{course?.description}</p>
        {course?.multimedia && (
          <div className="mb-6">
            <video controls className="w-full rounded-md shadow-md" src={course?.multimedia}>
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <button
          onClick={() => router.push("/student/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
