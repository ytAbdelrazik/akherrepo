"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";

interface Question {
  question: string;
  options: string[];
  answer: string;
  type: "MCQ" | "TF";
  difficulty: "easy" | "medium" | "hard";
}

const ManageQuestionBank: React.FC = () => {
  const { moduleId } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: [],
    answer: "",
    type: "MCQ",
    difficulty: "easy",
  });

  useEffect(() => {
    if (moduleId) {
      fetchQuestionBank();
    }
  }, [moduleId]);

  const fetchQuestionBank = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/question-bank/${moduleId}`);
      setQuestions(response.data.questions);
    } catch (err: any) {
      console.error("Error fetching question bank:", err);
      setError(err.response?.data?.message || "Failed to load question bank.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    try {
      setError(null);
      setSuccess(null);

      await apiClient.patch(`/question-bank/${moduleId}/add-questions`, {
        questions: [newQuestion],
      });

      setQuestions([...questions, newQuestion]);
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        answer: "",
        type: "MCQ",
        difficulty: "easy",
      });
      setSuccess("Question added successfully!");
    } catch (err: any) {
      console.error("Error adding question:", err);
      setError(err.response?.data?.message || "Failed to add question.");
    }
  };

  const handleEditClick = (index: number) => {
    setEditingQuestionIndex(index);
    setEditingQuestion(questions[index]);
  };

  const handleEditChange = (field: keyof Question, value: any) => {
    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, [field]: value });
    }
  };

  const handleSaveEdit = async () => {
    if (editingQuestionIndex === null || !editingQuestion) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      await apiClient.patch(
        `/question-bank/${moduleId}/edit-question/${editingQuestionIndex}`,
        editingQuestion
      );

      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = editingQuestion;
      setQuestions(updatedQuestions);

      setEditingQuestionIndex(null);
      setEditingQuestion(null);
      setSuccess("Question updated successfully!");
    } catch (err: any) {
      console.error("Error editing question:", err);
      setError(err.response?.data?.message || "Failed to edit question.");
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    try {
      setError(null);
      setSuccess(null);

      await apiClient.delete(`/question-bank/${moduleId}/delete-question/${index}`);

      setQuestions(questions.filter((_, i) => i !== index));
      setSuccess("Question deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting question:", err);
      setError(err.response?.data?.message || "Failed to delete question.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6">Manage Question Bank</h1>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

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

        <div className="grid gap-4 mb-6">
          {questions.map((question, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-lg font-semibold text-black">{question.question}</h2>
              <ul className="mt-2 list-disc pl-6 text-black">
                {question.options.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-green-600">Answer: {question.answer}</p>
              <p className="text-sm text-blue-600">
                Type: {question.type}, Difficulty: {question.difficulty}
              </p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEditClick(index)}
                  className="bg-yellow-600 text-white py-2 px-4 rounded shadow hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(index)}
                  className="bg-red-600 text-white py-2 px-4 rounded shadow hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-1/2">
              <h2 className="text-xl font-semibold text-black mb-4">Edit Question</h2>
              <textarea
                className="w-full p-2 border rounded mb-2 text-black"
                value={editingQuestion.question}
                onChange={(e) => handleEditChange("question", e.target.value)}
              />
              <textarea
                className="w-full p-2 border rounded mb-2 text-black"
                value={editingQuestion.options.join(", ")}
                onChange={(e) =>
                  handleEditChange("options", e.target.value.split(",").map((opt) => opt.trim()))
                }
              />
              <input
                className="w-full p-2 border rounded mb-2 text-black"
                value={editingQuestion.answer}
                onChange={(e) => handleEditChange("answer", e.target.value)}
              />
              <select
                className="w-full p-2 border rounded mb-2 text-black"
                value={editingQuestion.type}
                onChange={(e) => handleEditChange("type", e.target.value as "MCQ" | "TF")}
              >
                <option value="MCQ">MCQ</option>
                <option value="TF">True/False</option>
              </select>
              <select
                className="w-full p-2 border rounded mb-2 text-black"
                value={editingQuestion.difficulty}
                onChange={(e) => handleEditChange("difficulty", e.target.value as "easy" | "medium" | "hard")}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setEditingQuestionIndex(null);
                    setEditingQuestion(null);
                  }}
                  className="bg-gray-600 text-white py-2 px-4 rounded shadow hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
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

export default ManageQuestionBank;
