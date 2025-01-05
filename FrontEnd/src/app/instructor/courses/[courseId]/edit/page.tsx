"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "../../../../../utils/apiClient";

const EditCourse: React.FC = () => {
  const { courseId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [isOutdated, setIsOutdated] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const response = await apiClient.get(`/courses/${courseId}`);
      const { title, description, keywords, isOutdated } = response.data;
      setTitle(title || "");
      setDescription(description || "");
      setKeywords(keywords || []);
      setIsOutdated(isOutdated || false);
    } catch (err: any) {
      console.error("Error fetching course details:", err);
      setError("Failed to load course details.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      setError(null);
      setSuccess(null);

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      updateData.isOutdated = isOutdated;

      if (Object.keys(updateData).length === 0) {
        setError("No changes made. Please update at least one field.");
        return;
      }

      await apiClient.post(`/courses/${courseId}`, updateData);

      setSuccess("Course updated successfully!");
    } catch (err: any) {
      console.error("Error updating course:", err);
      setError(err.response?.data?.message || "Failed to update course.");
    }
  };

  const handleAddKeyword = async () => {
    try {
      if (!newKeyword.trim()) {
        setError("Keyword cannot be empty.");
        return;
      }

      await apiClient.post(`/courses/${courseId}/keywords`, {
        keywords: [newKeyword.trim()],
      });

      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
      setSuccess("Keyword added successfully!");
    } catch (err: any) {
      console.error("Error adding keyword:", err);
      setError(err.response?.data?.message || "Failed to add keyword.");
    }
  };

  const handleRemoveKeyword = async (keywordToRemove: string) => {
    try {
      const updatedKeywords = keywords.filter((keyword) => keyword !== keywordToRemove);
      await apiClient.post(`/courses/${courseId}/keywords`, { keywords: updatedKeywords });

      setKeywords(updatedKeywords);
      setSuccess("Keyword removed successfully!");
    } catch (err: any) {
      console.error("Error removing keyword:", err);
      setError(err.response?.data?.message || "Failed to remove keyword.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Course</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Leave empty to keep unchanged"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Leave empty to keep unchanged"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Mark as Outdated</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isOutdated}
              onChange={(e) => setIsOutdated(e.target.checked)}
              className="mr-2"
            />
            <span>{isOutdated ? "Outdated" : "Not Outdated"}</span>
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700"
        >
          Save Changes
        </button>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Keywords</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Add Keyword</label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Enter a new keyword"
              />
              <button
                onClick={handleAddKeyword}
                className="bg-green-600 text-white py-2 px-4 rounded shadow hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Current Keywords:</h3>
            <ul className="list-disc list-inside mt-2">
              {keywords.map((keyword, index) => (
                <li key={index} className="text-gray-700 flex justify-between">
                  <span>{keyword}</span>
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link href="/instructor/courses" legacyBehavior>
            <button className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700">
              Back to Courses
            </button>
          </Link>
      </div>
    </div>
  );
};

export default EditCourse;
