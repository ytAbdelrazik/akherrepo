"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../../utils/apiClient";

const CreateOneToOneChatPage: React.FC = () => {
  const [userId2, setUserId2] = useState("");
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateOneToOneChat = async () => {
    try {
      if (!userId2 || !courseId) {
        setError("Please provide both User ID and Course ID.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
      const userId1 = decodedToken.userId;

      await apiClient.post(
        `/chat/course/${courseId}/one-to-one`,
        { userId1, userId2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("One-to-one chat created successfully!");
      setUserId2("");
      setCourseId("");
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create one-to-one chat.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Create One-to-One Chat</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">User ID (Recipient)</label>
          <input
            type="text"
            value={userId2}
            onChange={(e) => setUserId2(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Course ID</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleCreateOneToOneChat}
          className="bg-green-600 text-white py-2 px-6 rounded shadow hover:bg-green-700"
        >
          Create Chat
        </button>

        <div className="mt-8">
          <button
            onClick={() => router.push("/chat")} // Redirect back to Chat page
            className="bg-gray-600 text-white py-2 px-6 rounded shadow hover:bg-gray-700"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOneToOneChatPage;
