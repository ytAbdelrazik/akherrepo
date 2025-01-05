"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";
import Link from "next/link";

interface Quiz {
  quizId: string;
  title: string;
  description: string;
  totalQuestions: number;
  isAttempted: boolean;
  moduleId: string;
  courseId: string;
}

const QuizzesForCourse: React.FC = () => {
  const { courseId } = useParams(); // Retrieve courseId from URL
  const router = useRouter();


const { moduleId } = useParams();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setError(null);
      setSuccess(null);

      const response = await apiClient.get(`/quizzes/course/${courseId}`);
      setQuizzes(response.data);
    } catch (err: any) {
      console.error("Error fetching quizzes:", err);
      setError("Failed to load quizzes for this course.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      setError(null);
      setSuccess(null);

      await apiClient.delete(`/quizzes/${quizId}`);
      setSuccess(`Quiz with ID '${quizId}' has been successfully deleted.`);
      setQuizzes(quizzes.filter((quiz) => quiz.quizId !== quizId)); // Remove quiz from state
    } catch (err: any) {
      console.error("Error deleting quiz:", err);
      setError(
        err.response?.data?.message || `Failed to delete quiz with ID '${quizId}'.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Quizzes for Course</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <div className="flex justify-end mb-6 space-x-4">
        <Link href={`/instructor/modules/${moduleId}/create-question-bank`} legacyBehavior>
  <button className="bg-yellow-600 text-white py-2 px-4 rounded-md shadow hover:bg-yellow-700">
    Create Question Bank
  </button>
</Link>

          <Link href={`/instructor/courses/${courseId}/create-quiz`} legacyBehavior>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700">
              Create Quiz
            </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading quizzes...</p>
        ) : quizzes.length > 0 ? (
          <div className="grid gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.quizId}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-blue-600">{quiz.title}</h2>
                <p className="text-gray-600">{quiz.description}</p>
                <p className="text-gray-600">
                  <strong>Total Questions:</strong> {quiz.totalQuestions}
                </p>
                <p className="text-gray-600">
                  <strong>Quiz ID:</strong> {quiz.quizId}
                </p>
                <p className="text-gray-600">
                  <strong>Module ID:</strong> {quiz.moduleId}
                </p>
                <p className="text-gray-600">
                  <strong>Course ID:</strong> {quiz.courseId}
                </p>
                <p
                  className={`${
                    quiz.isAttempted ? "text-red-600" : "text-green-600"
                  } font-semibold`}
                >
                  {quiz.isAttempted ? "Already Attempted" : "Not Attempted"}
                </p>
                <div className="flex space-x-4 mt-4">
                  {!quiz.isAttempted && (
                    <>
                      <Link href={`/instructor/quizzes/${quiz.quizId}/edit`} legacyBehavior>
                        <button className="bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700">
                          Edit Quiz
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.quizId)}
                        className="bg-red-600 text-white py-2 px-6 rounded-md shadow hover:bg-red-700"
                      >
                        Delete Quiz
                      </button>
                    </>
                  )}
                  <Link href={`/instructor/modules/${quiz.moduleId}/questionbank`} legacyBehavior>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700">
                      View Question Bank
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No quizzes found for this course.</p>
        )}

        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700"
          >
            Back to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizzesForCourse;



