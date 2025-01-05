"use client";

import React, { useState, useEffect } from "react";
import apiClient from "../../../utils/apiClient";
import { useRouter } from "next/navigation";

const UpdateInstructor: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState("");

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setExpertise(expertise.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setSuccess(null);

      const updateData: any = { name, email, password, expertise };
      if (!name) delete updateData.name;
      if (!email) delete updateData.email;
      if (!password) delete updateData.password;
      if (expertise.length === 0) delete updateData.expertise;

      await apiClient.patch("/users/profile/update", updateData);

      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/instructor/dashboard"), 2000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Profile</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Leave empty to keep unchanged"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Leave empty to keep unchanged"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave empty to keep unchanged"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Expertise</label>
          <div>
            {expertise.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="text-gray-700">{item}</span>
                <button
                  onClick={() => handleRemoveExpertise(index)}
                  className="ml-2 bg-red-600 text-white px-4 py-1 rounded shadow hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Add expertise"
            />
            <button
              onClick={handleAddExpertise}
              className="bg-green-600 text-white py-2 px-4 rounded shadow hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UpdateInstructor;
