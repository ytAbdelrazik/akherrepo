"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../../utils/apiClient";

const CreateCourse: React.FC = () => {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Beginner");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setError(null);
      setSuccess(null);

      // Fetch the token from local storage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }

      // Decode the token to extract the instructor ID (insID)
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
      const insID = decodedToken.userId; // Assuming `userId` is the field in the token for the instructor ID

      if (!insID) {
        setError("Instructor ID not found in the token.");
        return;
      }

      // Make the API call to create a course
      await apiClient.post("/courses", {
        insID, // Include the instructor ID
        courseId,
        title,
        description,
        category,
        difficultyLevel,
      });

      setSuccess("Course created successfully!");
      setTimeout(() => router.push("/instructor/dashboard"), 2000);
    } catch (err: any) {
      console.error("Error creating course:", err);
      setError(err.response?.data?.message || "Failed to create course.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Course</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Course ID</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Difficulty Level</label>
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700"
        >
          Create Course
        </button>
        <button
          onClick={() => router.push("/instructor/dashboard")}
          className="bg-gray-600 text-white py-2 px-6 rounded shadow hover:bg-gray-700 transition-colors duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CreateCourse;
