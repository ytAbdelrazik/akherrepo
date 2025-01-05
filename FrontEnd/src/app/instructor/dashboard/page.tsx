"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use from next/navigation for the App Router
import { deleteself, logout } from "@/utils/apiClient";

const InstructorDashboard: React.FC = () => {
  const router = useRouter(); // Initialize the router
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  const deleteAccount = async () => {
    try {
      // Retrieve the userId from localStorage
      const id = localStorage.getItem("userId");
      if (!id) {
        throw new Error("User ID not found in localStorage");
      }

      // Assume deleteself is an API call to delete the user
      const result = await deleteself(id);

      setDeleteStatus("Your account has been deleted");
      router.push("/login"); // Redirect after self-deletion
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  };

  const userId = localStorage.getItem('userId'); // Use consistent variable name
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      if (userId && token) { // Ensure both userId and token are non-empty
        await logout(userId, token); // Call the logout function from apiClient
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // Redirect to login page after successful logout
        router.push('/login');
      } else {
        alert('User is not logged in');
      }
    } catch (error) {
      alert('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Instructor Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Existing buttons */}
          <Link href="/instructor/courses" legacyBehavior>
            <button className="bg-blue-600 text-white py-4 px-6 rounded-md shadow hover:bg-blue-700">
              View Courses
            </button>
          </Link>
          <Link href="/instructor/create-course" legacyBehavior>
            <button className="bg-green-600 text-white py-4 px-6 rounded-md shadow hover:bg-green-700">
              Create Course
            </button>
          </Link>
          <Link href="/instructor/update-profile" legacyBehavior>
            <button className="bg-purple-600 text-white py-4 px-6 rounded-md shadow hover:bg-purple-700">
              Update Profile
            </button>
          </Link>
          <Link href="/search-courses" legacyBehavior>
            <button className="inline-block bg-red-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700">
              Search Courses
            </button>
          </Link>
          <Link href="/instructor/enrolled-students" legacyBehavior>
            <button className="bg-orange-600 text-white py-4 px-6 rounded-md shadow hover:bg-orange-700">
              View Enrolled Students
            </button>
          </Link>
          <Link href="/instructor/completed-students" legacyBehavior>
            <button className="bg-teal-600 text-white py-4 px-6 rounded-md shadow hover:bg-teal-700">
              View Completed Students
            </button>
          </Link>
          <Link href="/instructor/search-students" legacyBehavior>
            <button className="bg-gray-600 text-white py-4 px-6 rounded-md shadow hover:bg-gray-700">
              Search Students
            </button>
          </Link>
          <Link href="/instructor/progress" legacyBehavior>
            <button className="bg-yellow-600 text-white py-4 px-6 rounded-md shadow hover:bg-yellow-700">
              Progress
            </button>
          </Link>
          {/* New Go to Discussions Button */}
          <Link href="/instructor/discussions" legacyBehavior>
            <button className="bg-indigo-600 text-white py-4 px-6 rounded-md shadow hover:bg-indigo-700">
              Go to Discussions
            </button>
          </Link>
        </div>

        {/* New Delete Account Button */}
        <div className="mt-8">
          <button
            className="bg-red-600 text-white py-2 px-6 rounded-md shadow hover:bg-red-700"
            onClick={deleteAccount}
          >
            Delete Account
          </button>
          {deleteStatus && (
            <p className="mt-4 text-red-700">{deleteStatus}</p>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
