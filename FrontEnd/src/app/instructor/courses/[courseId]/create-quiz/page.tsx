"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";

const CreateQuiz: React.FC = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const router = useRouter();

  const [moduleId, setModuleId] = useState("");
  const [modules, setModules] = useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [questionType, setQuestionType] = useState("MCQ");
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await apiClient.get(`/modules/${courseId}/modules`);
      setModules(response.data.map((module: any) => module.moduleId));
    } catch (err: any) {
      console.error("Error fetching modules:", err);
      setError("Failed to fetch modules for the course.");
    }
  };

  const handleCreateQuiz = async () => {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      const data = {
        moduleId,
        numberOfQuestions,
        questionType,
        difficulty,
        courseId,
      };

      await apiClient.post(`/quizzes/create/${moduleId}`, data);

      setSuccess("Quiz created successfully!");
      setTimeout(() => router.push(`/instructor/courses/${courseId}/quizzes`), 2000);
    } catch (err: any) {
      console.error("Error creating quiz:", err);
      setError(err.response?.data?.message || "Failed to create quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Create Quiz</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Module</label>
          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="">Select a Module</option>
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Number of Questions</label>
          <input
            type="number"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            className="w-full p-2 border rounded text-black"
            min={1}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Question Type</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full p-2 border rounded text-black"
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
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={handleCreateQuiz}
          disabled={loading}
          className={`w-full py-2 px-4 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} shadow`}
        >
          {loading ? "Creating Quiz..." : "Create Quiz"}
        </button>

        <div className="mt-6 text-center">
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

export default CreateQuiz;
