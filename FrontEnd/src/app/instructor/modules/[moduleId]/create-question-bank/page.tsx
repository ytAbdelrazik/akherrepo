"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";

interface Question {
  question: string;
  options: string[];
  answer: string;
  type: "MCQ" | "TF";
  difficulty: "easy" | "medium" | "hard";
}

const CreateQuestionBank: React.FC = () => {
  const { courseId } = useParams(); // Retrieve courseId from URL
  const router = useRouter();

  const [moduleId, setModuleId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: [],
    answer: "",
    type: "MCQ",
    difficulty: "easy",
  });

  const handleAddQuestion = () => {
    if (!newQuestion.question || !newQuestion.answer) {
      setError("Please fill in all required fields for the question.");
      return;
    }

    setQuestions([...questions, newQuestion]);
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      answer: "",
      type: "MCQ",
      difficulty: "easy",
    });
    setError(null);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuestionBank = async () => {
    if (!moduleId || questions.length === 0) {
      setError("Please provide a module ID and add at least one question.");
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      await apiClient.post(`/question-bank/add`, {
        moduleId,
        questions,
      });

      setSuccess("Question bank created successfully!");
      setTimeout(() => router.push(`/instructor/courses/${courseId}/quizzes`), 2000);
    } catch (err: any) {
      console.error("Error creating question bank:", err);
      setError(err.response?.data?.message || "Failed to create question bank.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Question Bank</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 ">Module ID</label>
          <input
            type="text"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="w-full p-2 border rounded mb-2 text-black "
            placeholder="Enter Module ID"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Add New Question</h2>
          <textarea
            placeholder="Question"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            className="w-full p-2 border rounded mb-2 text-black"
          />
          <textarea
            placeholder="Options (comma-separated)"
            value={newQuestion.options.join(", ")}
            onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split(",") })}
            className="w-full p-2 border rounded mb-2 text-black"
          />
          <input
            placeholder="Answer"
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
            className="w-full p-2 border rounded mb-2 text-black"
          />
          <select
            value={newQuestion.type}
            onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as "MCQ" | "TF" })}
            className="w-full p-2 border rounded mb-2 text-black"
          >
            <option value="MCQ">MCQ</option>
            <option value="TF">True/False</option>
          </select>
          <select
            value={newQuestion.difficulty}
            onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as "easy" | "medium" | "hard" })}
            className="w-full p-2 border rounded mb-2 text-black"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={handleAddQuestion}
            className="bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700"
          >
            Add Question
          </button>
        
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Questions</h2>

          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-md bg-white mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  {question.question}
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {question.options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600">Answer: {question.answer}</p>
                <p className="text-sm text-gray-600">
                  Type: {question.type}, Difficulty: {question.difficulty}
                </p>
                <button
                  onClick={() => handleRemoveQuestion(index)}
                  className="mt-2 bg-red-600 text-white py-1 px-4 rounded shadow hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No questions added yet.</p>
          )}
        </div>

        <button
          onClick={handleCreateQuestionBank}
          className="bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700"
        >
          Create Question Bank
        </button>

        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionBank;
