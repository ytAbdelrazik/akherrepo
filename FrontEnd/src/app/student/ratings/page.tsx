"use client";

import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import apiClient from "../../../utils/apiClient";
import Link from "next/link";

interface TokenPayload {
    userId: string;
    [key: string]: any; // Additional fields in the token
}

const RatingsPage: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);

    // Course/Module Rating
    const [courseRatingCourseId, setCourseRatingCourseId] = useState("");
    const [moduleId, setModuleId] = useState("");
    const [courseRating, setCourseRating] = useState(0);

    // Instructor Rating
    const [instructorId, setInstructorId] = useState("");
    const [instructorRatingCourseId, setInstructorRatingCourseId] = useState("");
    const [instructorRating, setInstructorRating] = useState(0);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Fetch and decode the token to get the userId
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        if (token) {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            setUserId(decoded.userId); // Set userId from the token
        } else {
            setErrorMessage("No token found. Please log in.");
        }
    }, []);

    const handleSubmitRating = async (type: "course" | "instructor") => {
        try {
            setSuccessMessage(null);
            setErrorMessage(null);

            if (!userId) {
                setErrorMessage("User ID not found. Please log in again.");
                return;
            }

            if (type === "course") {
                await apiClient.post("/performance-tracking/rating", {
                    userId,
                    courseId: courseRatingCourseId,
                    moduleId: moduleId || null,
                    rating: courseRating,
                });
            } else if (type === "instructor") {
                await apiClient.post("/performance-tracking/instructor", {
                    userId,
                    instructorId,
                    courseId: instructorRatingCourseId || null,
                    rating: instructorRating,
                });
            }

            setSuccessMessage("Rating submitted successfully!");
        } catch (error: any) {
            console.error("Error submitting rating:", error);
            setErrorMessage(
                error.response?.data?.message || "An error occurred. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Submit Ratings
                </h1>

                {/* Success or Error Messages */}
                {successMessage && (
                    <p className="text-green-600 text-center mb-4">{successMessage}</p>
                )}
                {errorMessage && (
                    <p className="text-red-600 text-center mb-4">{errorMessage}</p>
                )}

                {/* Rating for Courses and Modules */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Rate a Course/Module
                    </h2>
                    <input
                        type="text"
                        placeholder="Course ID"
                        value={courseRatingCourseId}
                        onChange={(e) => setCourseRatingCourseId(e.target.value)}
                        className="w-full p-2 border rounded mb-4 text-black"
                    />
                    <input
                        type="text"
                        placeholder="Module ID (Optional)"
                        value={moduleId}
                        onChange={(e) => setModuleId(e.target.value)}
                        className="w-full p-2 border rounded mb-4 text-black"
                    />
                    <input
                        type="number"
                        placeholder="Rating (1-5)"
                        value={courseRating}
                        onChange={(e) => setCourseRating(parseInt(e.target.value))}
                        className="w-full p-2 border rounded mb-4 text-black"
                        min="1"
                        max="5"
                    />
                    <button
                        onClick={() => handleSubmitRating("course")}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                    >
                        Submit Course/Module Rating
                    </button>
                </div>

                {/* Rating for Instructors */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Rate an Instructor
                    </h2>
                    <input
                        type="text"
                        placeholder="Instructor ID"
                        value={instructorId}
                        onChange={(e) => setInstructorId(e.target.value)}
                        className="w-full p-2 border rounded mb-4 text-black"
                    />
                    <input
                        type="text"
                        placeholder="Course ID (Optional)"
                        value={instructorRatingCourseId}
                        onChange={(e) => setInstructorRatingCourseId(e.target.value)}
                        className="w-full p-2 border rounded mb-4 text-black"
                    />
                    <input
                        type="number"
                        placeholder="Rating (1-5)"
                        value={instructorRating}
                        onChange={(e) => setInstructorRating(parseInt(e.target.value))}
                        className="w-full p-2 border rounded mb-4 text-black"
                        min="1"
                        max="5"
                    />
                    <button
                        onClick={() => handleSubmitRating("instructor")}
                        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                    >
                        Submit Instructor Rating
                    </button>

                    <div className="mt-6 text-center">
                        <Link
                            href="/student/dashboard"
                            className="bg-gray-600 text-white px-6 py-2 rounded-md shadow hover:bg-gray-700"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingsPage;
