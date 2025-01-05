"use client"; // Mark as client component
import React, { useEffect, useState } from "react";
import apiClient from "../../../utils/apiClient";
import Link from "next/link";

interface Quiz {
  quizId: string;
  courseId: string;
  moduleId: string;
}

const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await apiClient.get("/quizzes/student/quizzes");
      setQuizzes(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching quizzes:", err);
      setError("Failed to fetch quizzes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
  <div className="max-w-5xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
      Available Quizzes
    </h1>

    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      {quizzes.length > 0 ? (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz.quizId}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-md"
            >
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  Quiz ID: {quiz.quizId}
                </p>
                <p className="text-sm text-gray-500">Course ID: {quiz.courseId}</p>
                <p className="text-sm text-gray-500">Module ID: {quiz.moduleId}</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href={`/student/quizzes/start/${quiz.quizId}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                >
                  Start Quiz
                </Link>
                <Link
                  href={`/student/quizzes/feedback/${quiz.quizId}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
                >
                  View Feedback
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No quizzes available.</p>
      )}
    </div>

    <div className="mt-6 text-center">
      <Link
        href="/student/dashboard"
        className="bg-gray-600 text-white px-6 py-2 rounded-md shadow hover:bg-gray-700"
      >
        Back to Dashboard
      </Link>
    </div>
  </div>
</div>

);
};


export default QuizzesPage;
