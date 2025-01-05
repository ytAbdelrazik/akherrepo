"use client"; // Mark as a client component
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../utils/apiClient";

interface CourseDetails {
  courseId: string;
  title: string;
  description: string;
  difficultyLevel: string;
  multimedia: string[]; // Assuming multimedia is an array of URLs
  createdBy: string;
  category: string;
}

interface Module {
  moduleId: string;
  title: string;
  content: string;
  resources?: string[];
}

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams(); // Extract courseId from the URL
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!courseId) {
          throw new Error("Course ID not found.");
        }
        const [courseResponse, modulesResponse] = await Promise.all([
          apiClient.get(`/courses/${courseId}`),
          apiClient.get(`/modules/${courseId}/modules`),
        ]);

        setCourse(courseResponse.data);
        setModules(modulesResponse.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{course?.title}</h1>
        <p className="text-gray-700 mb-4">
          <strong>Description:</strong> {course?.description}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Difficulty Level:</strong> {course?.difficultyLevel}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Category:</strong> {course?.category}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Created by:</strong> {course?.createdBy}
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Multimedia</h2>
          <ul>
            {course?.multimedia && course.multimedia.length > 0 ? (
              course.multimedia.map((media, index) => (
                <li key={index} className="mb-3">
                  <a
                    href={media}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Multimedia {index + 1}
                  </a>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No multimedia available.</p>
            )}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Modules</h2>
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            {modules.length > 0 ? (
              <ul className="space-y-4">
                {modules.map((module) => (
                  <li key={module.moduleId} className="bg-gray-100 p-4 rounded-md shadow">
                    <h2 className="text-lg font-semibold text-gray-700">{module.title}</h2>
                    <p className="text-sm text-gray-500 mb-4">{module.content}</p>
                    {module.resources && module.resources.length > 0 && (
                      <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Resources:</h3>
                        <ul className="list-disc pl-5">
                          {module.resources.map((resource, index) => (
                            <li key={index}>
                              <a
                                href={resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Resource {index + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No modules available.</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
