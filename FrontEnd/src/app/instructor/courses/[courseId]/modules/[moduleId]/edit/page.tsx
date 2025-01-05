"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "../../../../../../../utils/apiClient";

const EditModule: React.FC = () => {
  const { moduleId, courseId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resources, setResources] = useState<string[]>([]);
  const [isOutdated, setIsOutdated] = useState<boolean | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdateModule = async () => {
    try {
      setError(null);
      setSuccess(null);

      const updateData: any = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (resources.length > 0) updateData.resources = resources;
      if (isOutdated !== null) updateData.isOutdated = isOutdated;

      if (Object.keys(updateData).length === 0) {
        setError("No changes made. Please update at least one field.");
        return;
      }

      await apiClient.patch(`/modules/${moduleId}`, updateData);

      setSuccess("Module updated successfully!");
      setTimeout(() => router.push(`/instructor/courses/${courseId}/modules`), 2000);
    } catch (err: any) {
      console.error("Error updating module:", err);
      setError("Failed to update module.");
    }
  };

  const handleAddResource = () => {
    setResources([...resources, ""]);
  };

  const handleResourceChange = (index: number, value: string) => {
    const updatedResources = [...resources];
    updatedResources[index] = value;
    setResources(updatedResources);
  };

  const handleRemoveResource = (index: number) => {
    const updatedResources = resources.filter((_, i) => i !== index);
    setResources(updatedResources);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Module</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Leave empty to keep unchanged"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Leave empty to keep unchanged"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Resources</label>
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={resource}
                onChange={(e) => handleResourceChange(index, e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={() => handleRemoveResource(index)}
                className="ml-2 bg-red-600 text-white px-4 py-1 rounded shadow hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddResource}
            className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700"
          >
            Add Resource
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Mark as Outdated
          </label>
          <input
            type="checkbox"
            checked={isOutdated || false}
            onChange={(e) => setIsOutdated(e.target.checked)}
          />
        </div>

        <button
          onClick={handleUpdateModule}
          className="bg-green-600 text-white py-2 px-6 rounded shadow hover:bg-green-700"
        >
          Save Changes
        </button>

        <Link href={`/instructor/courses/${courseId}/modules`} legacyBehavior>
          <button className="ml-4 bg-gray-600 text-white py-2 px-6 rounded shadow hover:bg-gray-700">
            Back to Modules
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EditModule;
