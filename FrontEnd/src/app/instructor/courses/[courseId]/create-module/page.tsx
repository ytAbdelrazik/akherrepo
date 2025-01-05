"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";
import Link from "next/link";

const CreateModule: React.FC = () => {
  const { courseId } = useParams();
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setError(null);
      setSuccess(null);

      await apiClient.post("/modules/create", {
        moduleId,
        courseId,
        title,
        content,
      });

      setSuccess("Module created successfully!");
      setTimeout(() => router.push(`/instructor/courses/${courseId}`), 2000);
    } catch (err: any) {
      console.error("Error creating module:", err);
      setError(err.response?.data?.message || "Failed to create module.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Module</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Module ID</label>
          <input
            type="text"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
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
          <label className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700"
        >
          Create Module
        </button>
        <Link href="/instructor/courses" legacyBehavior>
            <button className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700">
              Back to Courses
            </button>
          </Link>
      </div>
    </div>
  );
};

export default CreateModule;
