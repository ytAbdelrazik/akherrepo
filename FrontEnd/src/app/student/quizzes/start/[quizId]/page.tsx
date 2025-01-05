"use client"; // Mark as a client component
import React, { useEffect, useState } from "react";
import apiClient from "../../../../../utils/apiClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  question: string;
  options: string[];
}

interface Quiz {
  quizId: string;
  questions: Question[];
}

const StartQuizPage: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { quizId } = useParams(); // Get dynamic route parameter
  const router = useRouter();

  useEffect(() => {
    if (quizId) {
      setLoading(true); // Ensure loading state is active
      fetchQuiz();
    } else {
      setError("Quiz ID not found.");
      setLoading(false);
    }
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const response = await apiClient.post(`/quizzes/${quizId}/start`);
      setQuiz(response.data);
      setAnswers({}); // Reset answers for the new quiz
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert("You already took this quiz. Redirecting to the dashboard...");
        router.push("/student/dashboard"); // Redirect to dashboard
      } else {
        console.error("Error fetching quiz:", err);
        setError(
          err.response?.data?.message || "Failed to load quiz. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (question: string, selectedOption: string) => {
    setAnswers((prev) => ({ ...prev, [question]: selectedOption }));
  };

  const handleSubmit = async () => {
    try {
      // Submit answers using the question text as the ID
      const response = await apiClient.post(`/responses/${quizId}/submit`, {
        answers: Object.entries(answers).map(([question, selectedOption]) => ({
          questionId: question, // Use question text as the ID
          selectedOption,
        })),
      });
      alert("Quiz submitted successfully!");
      router.push("/student/dashboard");
    } catch (err: any) {
      if (err.response?.status === 409) {
        console.error("Conflict Error:", err.response.data);
        alert("You already took this quiz. Redirecting to the dashboard...");
        router.push("/student/dashboard");
      } else {
        console.error("Error submitting quiz:", err);
        alert("Failed to submit quiz. Please try again.");
      }
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
    <div className="max-w-4xl mx-auto">
        
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Start Quiz
      </h1>
      
  
      {quiz ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-6">
            {quiz.questions.map((questionData) => (
              <div
                key={questionData.question}
                className="bg-white shadow-md rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {questionData.question}
                </h2>
                <div className="space-y-2">
                  {questionData.options.map((option, index) => (
                    <label
                      key={`${questionData.question}-${index}`}
                      className="block text-gray-600 font-medium"
                    >
                      <input
                        type="radio"
                        name={questionData.question} // Use question text as name
                        value={option}
                        checked={answers[questionData.question] === option} // Bind answer to specific question
                        onChange={() =>
                          handleOptionChange(questionData.question, option)
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
  
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-500">No quiz data available.</p>
      )}
  
      {/* Add the View Feedback Button */}
      <div className="mt-6 flex justify-center gap-4">
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

export default StartQuizPage;
