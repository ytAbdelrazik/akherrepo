'use client'; // Mark this file as a client component
import React, { useEffect, useState } from "react";
import apiClient from "../../../utils/apiClient";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { deleteself, logout } from "../../../utils/apiClient";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

interface Course {
  courseId: string;
  title: string;
}

interface DecodedToken {
  userId: string;
  role: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

const StudentDashboard: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [newCourses, setNewCourses] = useState<string[]>([]); // For adding new courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // For success messages
  const [deleteStatus, setDeleteStatus] = useState<string>("");
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      // Decode the token to get the studentId
      const decodedToken = jwtDecode<DecodedToken>(token);
      const studentId = decodedToken.userId;

      if (!studentId) {
        throw new Error("Student ID not found in token");
      }

      // Fetch Enrolled Courses API
      const enrolledCoursesResponse = await apiClient.get("/courses/students/enrolled-courses");
      setEnrolledCourses(enrolledCoursesResponse.data);

      // Fetch Completed Courses API
      const completedCoursesResponse = await apiClient.get("/courses/students/completed");
      setCompletedCourses(completedCoursesResponse.data);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    const courseId = prompt("Enter Course ID:");
    if (courseId) {
      setNewCourses([...newCourses, courseId]);
    }
  };

  const handleSubmitCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      const decodedToken = jwtDecode<DecodedToken>(token);
      const studentId = decodedToken.userId;

      if (!studentId) {
        throw new Error("Student ID not found in token");
      }

      await apiClient.patch(`/users/${studentId}/add-courses/student`, {
        courseIds: newCourses,
      });

      setSuccess("Courses added successfully!");
      setNewCourses([]); // Clear the new courses list
      fetchAllData(); // Refresh the data
    } catch (err: any) {
      console.error("Error adding courses:", err);
      setError(err.response?.data?.message || "Failed to add courses.");
    }
  };

  const deleteAccount = async () => {
    try {
      const id = localStorage.getItem("userId");
      if (!id) {
        throw new Error("User ID not found in localStorage");
      }

      await deleteself(id);
      setDeleteStatus("Your account has been deleted");
      router.push("/login"); // Use router.push for navigation
    } catch (error) {
      console.error("Error deleting account:", error);
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Student Dashboard</h1>

        {/* Add Courses Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Add Courses</h2>
          <ul className="list-disc pl-6 mb-4">
            {newCourses.map((courseId, index) => (
              <li key={index} className="text-gray-800">
                {courseId}
              </li>
            ))}
          </ul>
          <button
            onClick={handleAddCourse}
            className="bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700 mr-4"
          >
            Add Course
          </button>
          <button
            onClick={handleSubmitCourses}
            className="bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700"
          >
            Submit Courses
          </button>
        </div>

        {/* Enrolled and Completed Courses Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Enrolled Courses</h2>
            <ul>
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <li
                    key={course.courseId}
                    className="mb-3 text-gray-600 text-base border-b pb-2"
                  >
                    <Link href={`/student/courses/${course.courseId}`} legacyBehavior>
                      <a className="text-blue-600 hover:underline">{course.title}</a>
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No enrolled courses found.</p>
              )}
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Completed Courses</h2>
            <ul>
              {completedCourses.length > 0 ? (
                completedCourses.map((course) => (
                  <li
                    key={course.courseId}
                    className="mb-3 text-gray-600 text-base border-b pb-2"
                  >
                    {course.title}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No completed courses found.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Other Buttons and Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 text-center">
          <Link href="/update-profile" legacyBehavior>
            <button className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700">
              Update Profile
            </button>
          </Link>
          <Link href="/search-courses" legacyBehavior>
            <button className="inline-block bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700">
              Search Courses
            </button>
          </Link>
          <Link href="/student/searchinstructor" legacyBehavior>
            <button className="inline-block bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700">
              Search Instructors
            </button>
          </Link>
          <Link href="/student/ratings" legacyBehavior>
            <button className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700">
              Go to Ratings
            </button>
          </Link>
          <Link href="/student/discussions" legacyBehavior>
            <button className="inline-block bg-orange-600 text-white py-2 px-6 rounded-md shadow hover:bg-orange-700">
              Go to Discussions
            </button>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <Link href="/student/quizzes" legacyBehavior>
            <button className="inline-block bg-purple-600 text-white py-2 px-6 rounded-md shadow hover:bg-purple-700">
              Go to Quizzes
            </button>
          </Link>
          <Link href="/student/notes" legacyBehavior>
            <button className="inline-block bg-purple-600 text-white py-2 px-6 rounded-md shadow hover:bg-purple-700">
              Quick Notes
            </button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/chat" legacyBehavior>
            <button className="inline-block bg-yellow-600 text-white py-2 px-6 rounded-md shadow hover:bg-yellow-700">
              Chats
            </button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={deleteAccount}
            className="inline-block bg-red-600 text-white py-2 px-6 rounded-md shadow hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="inline-block bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;