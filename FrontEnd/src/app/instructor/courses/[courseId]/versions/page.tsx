"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";

interface Version {
  version: string;
  updatedAt: Date;
}

const CourseVersions: React.FC = () => {
  const { courseId } = useParams();
  const router = useRouter();

  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/versions`);
      setVersions(response.data);
    } catch (err: any) {
      console.error("Error fetching versions:", err);
      setError("Failed to load course versions.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (version: string) => {
    try {
      setError(null);
      setSuccess(null);

      await apiClient.post(`/courses/${courseId}/revert`, {},{
        params: { version },
      });

      setSuccess("Course reverted successfully!");
      setTimeout(() => router.push("/instructor/courses"), 2000);
    } catch (err: any) {
      console.error("Error reverting version:", err);
      setError(err.response?.data?.message || "Failed to revert version.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Manage Course Versions</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {loading ? (
          <p className="text-gray-600 text-center">Loading course versions...</p>
        ) : versions.length > 0 ? (
          <div className="grid gap-6">
            {versions.map((version, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Version: {version.version}
                </h2>
                <p className="text-gray-600">
                  Updated At: {new Date(version.updatedAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleRevert(version.version)}
                  className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700"
                >
                  Revert to This Version
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No versions found for this course.</p>
        )}

        <button
          onClick={() => router.push("/instructor/courses")}
          className="mt-8 bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700"
        >
          Back to Courses
        </button>
      </div>
    </div>
  );
};

export default CourseVersions;
