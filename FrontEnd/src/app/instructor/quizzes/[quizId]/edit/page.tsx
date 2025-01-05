"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";
import Link from "next/link";

interface Question {
  question: string;
  options: string[];
  answer: string;
  type: "MCQ" | "TF";
  difficulty: "easy" | "medium" | "hard";
}

const EditQuiz: React.FC = () => {
  const { quizId } = useParams();
  const { courseId } = useParams(); // Retrieve courseId from URL
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionType, setQuestionType] = useState<"MCQ" | "TF" | "both">("MCQ");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {

  }, []);





  const handleUpdateQuiz = async () => {
    try {
      setError(null);
      setSuccess(null);

      const updatedData = {
        selectedQuestions,
        questionType,
        difficulty,
        numberOfQuestions,
      };

      await apiClient.patch(`/quizzes/${quizId}`, updatedData);

      setSuccess("Quiz updated successfully!");
      setTimeout(() => router.push(`/instructor/courses`), 2000);
    } catch (err: any) {
      console.error("Error updating quiz:", err);
      setError("Failed to update quiz. Please try again.");
    }
  };

  const handleToggleQuestionSelection = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Quiz</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Question Type</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="MCQ">MCQ</option>
            <option value="TF">True/False</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Number of Questions</label>
          <input
            type="number"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Question Bank</h2>
        {questionBank.map((q, index) => (
          <div
            key={index}
            className={`p-4 border rounded mb-2 ${
              selectedQuestions.includes(q.question) ? "bg-blue-100" : "bg-white"
            }`}
          >
            <p>{q.question}</p>
            <button
              onClick={() => handleToggleQuestionSelection(q.question)}
              className={`mt-2 ${
                selectedQuestions.includes(q.question)
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              } text-white py-1 px-4 rounded shadow`}
            >
              {selectedQuestions.includes(q.question) ? "Remove" : "Add"}
            </button>
          </div>
        ))}

        <button
          onClick={handleUpdateQuiz}
          className="bg-green-600 text-white py-2 px-6 rounded shadow hover:bg-green-700 mt-4"
        >
          Save Changes
        </button>
        <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700"
          >
            Back to Quizzes
          </button>
      </div>
    </div>
  );
};

export default EditQuiz;
