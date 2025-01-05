"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../../utils/apiClient";
import Link from "next/link";

interface Multimedia {
  _id: string;
  resourceType: "video" | "pdf" | "image";
  url: string;
  title: string;
  description?: string;
  uploadedAt: string;
}

const ManageMultimedia: React.FC = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const [multimedia, setMultimedia] = useState<Multimedia[]>([]);
  const [newMedia, setNewMedia] = useState({
    resourceType: "video",
    url: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMultimedia();
  }, [courseId]);

  const fetchMultimedia = async () => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/multimedia`);
      setMultimedia(response.data);
    } catch (err: any) {
      console.error("Error fetching multimedia:", err);
      setError("Failed to load multimedia.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async () => {
    try {
      await apiClient.post(`/courses/${courseId}/multimedia`, newMedia);
      setNewMedia({ resourceType: "video", url: "", title: "", description: "" });
      fetchMultimedia(); // Refresh the multimedia list
    } catch (err: any) {
      console.error("Error adding multimedia:", err);
      setError("Failed to add multimedia. Please try again.");
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await apiClient.delete(`/courses/${courseId}/multimedia/${mediaId}`);
      fetchMultimedia(); // Refresh the multimedia list
    } catch (err: any) {
      console.error("Error deleting multimedia:", err);
      setError("Failed to delete multimedia. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/instructor/dashboard")}
            className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Manage Multimedia for Course: {courseId}
        </h1>

        {/* Add Multimedia */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Add New Multimedia</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Resource Type</label>
            <select
              value={newMedia.resourceType}
              onChange={(e) =>
                setNewMedia({ ...newMedia, resourceType: e.target.value as "video" | "pdf" | "image" })
              }
              className="w-full p-2 border rounded"
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">URL</label>
            <input
              type="text"
              value={newMedia.url}
              onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={newMedia.title}
              onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={newMedia.description}
              onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddMedia}
            className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700"
          >
            Add Multimedia
          </button>
          <Link href="/instructor/courses" legacyBehavior>
            <button className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700">
              Back to Courses
            </button>
          </Link>
        </div>

        {/* Multimedia List */}
        <div>
          <h2 className="text-xl font-semibold text-green-600 mb-4">Existing Multimedia</h2>
          {multimedia.length > 0 ? (
            multimedia.map((media) => (
              <div key={media._id} className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{media.title}</h3>
                <p className="text-gray-600">{media.description}</p>
                <p className="text-sm text-gray-500">
                  <strong>Type:</strong> {media.resourceType}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>URL:</strong> <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{media.url}</a>
                </p>
                <button
                  onClick={() => handleDeleteMedia(media._id)}
                  className="mt-4 bg-red-600 text-white py-2 px-4 rounded shadow hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No multimedia resources found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMultimedia
