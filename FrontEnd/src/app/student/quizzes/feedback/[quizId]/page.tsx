"use client"; // Mark as a client component
import React, { useEffect, useState } from "react";
import apiClient from "../../../../../utils/apiClient";
import { useParams, useRouter } from "next/navigation";

interface Feedback {
  question: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
}

interface FeedbackResponse {
  score: number;
  feedback: Feedback[];
  message: string;
}

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { quizId } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (quizId) {
      fetchFeedback();
    }
  }, [quizId]);

  const fetchFeedback = async () => {
    try {
      const response = await apiClient.get(`/responses/${quizId}/feedback`);
      setFeedback(response.data);
    } catch (err: any) {
      console.error("Error fetching feedback:", err);
      setError("Failed to load feedback. Please refresh or try again later.");
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
          Quiz Feedback
        </h1>

        {feedback ? (
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Score: {feedback.score}/{feedback.feedback.length}
            </p>
            <p className="text-lg font-semibold text-gray-600 mb-6">
              {feedback.message}
            </p>
            {feedback.feedback.length > 0 ? (
              <ul className="space-y-4">
                {feedback.feedback.map((fb, index) => (
                  <li
                    key={index}
                    className={`p-4 bg-white shadow rounded-lg border ${
                      fb.isCorrect ? "border-green-300" : "border-red-300"
                    }`}
                  >
                    <p className="text-gray-800 font-bold text-lg">
                      <strong>Question:</strong> {fb.question || "Question text not available"}
                    </p>
                    <p
                      className={`text-gray-700 ${
                        fb.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <strong>Your Answer:</strong> {fb.selectedOption}
                    </p>
                    {!fb.isCorrect && (
                      <p className="text-gray-700">
                        <strong>Correct Answer:</strong> {fb.correctOption}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                No feedback available for this quiz.
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No feedback available.</p>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white px-6 py-2 rounded-md shadow hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
