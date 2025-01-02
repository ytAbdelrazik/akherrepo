"use client"; // Mark as a client component
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";

const QuizResultsPage: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");

  useEffect(() => {
    if (quizId) {
      fetchResults();
    } else {
      setError("Quiz ID not found.");
      setLoading(false);
    }
  }, [quizId]);

  const fetchResults = async () => {
    try {
      const response = await apiClient.get(`/responses/feedback/${quizId}`);
      setResults(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching quiz results:", err);
      setError("Failed to load quiz results.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Quiz Results
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Answers</h2>
          <ul>
            {results.answers.map((answer: any) => (
              <li key={answer.questionId} className="mb-4">
                <p className="font-semibold">Question: {answer.question}</p>
                <p className="text-gray-600">Your Answer: {answer.selectedOption}</p>
                <p className="text-gray-600">
                  Correct Answer: {answer.correctOption}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;
