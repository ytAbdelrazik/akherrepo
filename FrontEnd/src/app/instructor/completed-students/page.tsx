"use client";

import React, { useState } from "react";
import apiClient from "../../../utils/apiClient";
import { useRouter } from "next/navigation";

interface CompletedStudent {
  name: string;
  email: string;
  completionDate: string;
  score: number;
}

const CompletedStudents: React.FC = () => {
  const [courseId, setCourseId] = useState("");
  const [completedStudents, setCompletedStudents] = useState<CompletedStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchCompletedStudents = async () => {
    if (!courseId) {
      setError("Please enter a Course ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/courses/${courseId}/completed-students`);
      setCompletedStudents(response.data);
    } catch (err: any) {
      console.error("Error fetching completed students:", err);
      setError("Failed to load completed students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Completed Students</h1>

        {/* Course ID Input */}
        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="Enter Course ID"
            className="flex-grow px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          <button
            onClick={fetchCompletedStudents}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
          >
            Fetch Completed Students
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : completedStudents.length > 0 ? (
          <div className="grid gap-6">
            {completedStudents.map((student, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-blue-600">{student.name}</h2>
                <p className="text-gray-600">Email: {student.email}</p>
                <p className="text-gray-600">
                  Completion Date: {new Date(student.completionDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Score: {student.score}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No students have completed this course yet.</p>
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

export default CompletedStudents;
