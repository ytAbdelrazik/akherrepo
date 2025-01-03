"use client"; // Mark this file as a client component

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateProfile,
  getAllStudents,
  getAllInstructors,
  searchStudents,
  deleteSelf,
} from "../../../../utils/apiClient"; // Import the API functions

type UserProfileProps = {
  userId: string;
};

export default function UserProfile({ userId }: UserProfileProps) {
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for the search input
  const [deleteStatus, setDeleteStatus] = useState<string>("");
  const [updatedProfile, setUpdatedProfile] = useState<any | null>(null); // New state for updated profile data

  const router = useRouter();

  const handleUpdateProfile = async () => {
    try {
      const updateData = { name: "Updated Name" }; // Example data, replace with actual input
      const updatedData = await updateProfile(updateData);
      setUpdatedProfile(updatedData);
    } catch (error) {
      setError("Failed to update profile");
    }
  };

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
      const data = await searchStudents(searchQuery); // Use the searchQuery for the search
      setSearchResults(data);
    } catch (error) {
      setError("Failed to search students");
    }
  };

  const handleDeleteSelf = async () => {
    try {
      const result = await deleteSelf();
      setDeleteStatus("Account deleted successfully");
      router.push("/login"); // Redirect user after deleting account
    } catch (error) {
      setError("Failed to delete account");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Update Profile Button */}
      <button onClick={handleUpdateProfile}>Update Profile</button>
      {updatedProfile && <div>Profile updated: {updatedProfile.name}</div>}

      {/* Get All Students Button */}
      <button onClick={handleGetAllStudents}>Get All Students</button>
      {students.length > 0 && (
        <div>
          <h2>Students:</h2>
          <ul>
            {students.map((student: any) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Get All Instructors Button */}
      <button onClick={handleGetAllInstructors}>Get All Instructors</button>
      {instructors.length > 0 && (
        <div>
          <h2>Instructors:</h2>
          <ul>
            {instructors.map((instructor: any) => (
              <li key={instructor.id}>{instructor.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Search Students */}
      <div>
        <input
          type="text"
          placeholder="Enter student name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearchStudents}>Search</button>

        {searchResults.length > 0 && (
          <div>
            <h2>Search Results:</h2>
            <ul>
              {searchResults.map((result: any) => (
                <li key={result.id}>{result.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Delete Self Button */}
      <button onClick={handleDeleteSelf}>Delete Account</button>
      {deleteStatus && <div>{deleteStatus}</div>}
    </div>
  );
}
