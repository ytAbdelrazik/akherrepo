"use client"; // Mark this file as a client component

import { useState } from "react";
import { useRouter } from "next/navigation";
import {

  getAllStudents,
  getAllInstructors,
  searchStudents,

  deleteUserByAdmin, // Imported function for admin
} from "../../../../utils/apiClient";

type UserProfileProps = {
  userId: string;
};

export default function UserProfile({ userId }: UserProfileProps) {
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteStatus, setDeleteStatus] = useState<string>("");
  const [updatedProfile, setUpdatedProfile] = useState<any | null>(null);
  const [adminDeleteUserId, setAdminDeleteUserId] = useState<string>("");

  const router = useRouter();

  const handleGetAllStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      setError("Failed to fetch students");
    }
  };

  const handleGetAllInstructors = async () => {
    try {
      const data = await getAllInstructors();
      setInstructors(data);
    } catch (error) {
      setError("Failed to fetch instructors");
    }
  };

  const handleSearchStudents = async () => {
    try {
      if (!searchQuery) {
        setError("Search query cannot be empty.");
        return;
      }

      const data = await searchStudents(searchQuery);
      setSearchResults(data);

      if (data.length === 0) {
        setError("No students found for the given search.");
      }
    } catch (error) {
      setError("Failed to search students");
    }
  };

  const handleDeleteSelf = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User ID is missing");
        return;
      }

      // User deleting themselves
      const result = await deleteUserByAdmin(userId);
      if (result) {
        setDeleteStatus("Your account has been deleted");
        router.push("/login"); // Redirect after self-deletion
      } else {
        setError("Failed to delete your account.");
      }
    } catch (error) {
      setError("Failed to delete account");
    }
  };

  const handleDeleteUserByAdmin = async () => {
    try {
      if (!adminDeleteUserId) {
        setError("Please provide a user ID.");
        return;
      }

      const result = await deleteUserByAdmin(adminDeleteUserId);
      if (result) {
        setDeleteStatus(`User with ID ${adminDeleteUserId} deleted successfully`);
      } else {
        setError(`User with ID ${adminDeleteUserId} not found.`);
      }
    } catch (error) {
      setError("Failed to delete user as admin");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Admin{localStorage.getItem("userId")}</h1>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      {/* Students Section */}
      <div className="mb-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleGetAllStudents}
        >
          Get All Students
        </button>
        {students.length === 0 ? (
          <div>Loading students...</div>
        ) : (
          <ul className="list-disc pl-5 space-y-1 mt-4">
            {students.map((student: any) => (
              <li key={student.userId}>
                {student.name} (ID: {student.userId})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Instructors Section */}
      <div className="mb-6">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleGetAllInstructors}
        >
          Get All Instructors
        </button>
        {instructors.length === 0 ? (
          <div>Loading instructors...</div>
        ) : (
          <ul className="list-disc pl-5 space-y-1 mt-4">
            {instructors.map((instructor: any) => (
              <li key={instructor.userId}>
                {instructor.name} (ID: {instructor.userId})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Students */}
      <div className="mb-6">
        <input
          className="px-4 py-2 border rounded mt-2"
          type="text"
          placeholder="Search for a student"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-2"
          onClick={handleSearchStudents}
        >
          Search Students
        </button>
        {searchResults.length === 0 && searchQuery && (
          <div>No results found for the given query.</div>
        )}
        {searchResults.length > 0 && (
          <ul className="list-disc pl-5 space-y-1 mt-4">
            {searchResults.map((student: any) => (
              <li key={student.userId}>
                {student.name} (ID: {student.userId})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Admin Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-bold">Admin Actions</h2>
        <input
          className="px-4 py-2 border rounded mt-2"
          type="text"
          placeholder="Enter user ID to delete"
          value={adminDeleteUserId}
          onChange={(e) => setAdminDeleteUserId(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-2"
          onClick={handleDeleteUserByAdmin}
        >
          Delete User by Admin
        </button>
      </div>

      {/* Delete Self */}
      <div className="mb-6">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleDeleteSelf}
        >
          Delete Account
        </button>
        {deleteStatus && (
          <div className="mt-2 text-red-600">{deleteStatus}</div>
        )}
      </div>
    </div>
  );
}
