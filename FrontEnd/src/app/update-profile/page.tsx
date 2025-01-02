"use client"; // Mark this file as a client component
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import apiClient from "../../utils/apiClient";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  role: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

const UpdateProfile: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter(); // Initialize useRouter

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      const decodedToken = jwtDecode<DecodedToken>(token);

      // Initialize the update data object
      const updateData: any = { name };

      // Include email only if it's provided
      if (email) {
        updateData.email = email;
      } else {
        updateData.email = decodedToken.email; // Retain the current email if not provided
      }

      // Include password only if it's provided
      if (password) {
        updateData.password = password;
      }

      await apiClient.patch("/users/profile/update", updateData);
      setSuccessMessage("Profile updated successfully!");

      // Redirect back to the previous page after a short delay
      setTimeout(() => {
        router.back(); // Navigate to the previous page
      }, 2000); // Delay for 2 seconds to show the success message
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setErrorMessage("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Update Profile
        </h1>

        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Leave empty to keep current email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Leave empty to keep current password"
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
