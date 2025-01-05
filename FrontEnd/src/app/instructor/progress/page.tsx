"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    getAllProgress, 
    getUserProgress, 
    getModuleRatings, 
    getQuizPerformance, 
    getStudentQuizPerformance, 
    getAverageInstructorRating,
    exportProgress
} from "../../../utils/apiClient";

const ProgressPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchData = async (action: string) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            let result;
            switch (action) {
                case "allProgress":
                    result = await getAllProgress();
                    break;
                case "userProgress":
                    const userId = prompt("Enter User ID:");
                    if (!userId) throw new Error("User ID is required.");
                    result = await getUserProgress(userId);
                    break;
                case "moduleRatings":
                    const courseId = prompt("Enter Course ID:");
                    if (!courseId) throw new Error("Course ID is required.");
                    result = await getModuleRatings(courseId);
                    break;
                case "quizPerformance":
                    const quizId = prompt("Enter Quiz ID:");
                    if (!quizId) throw new Error("Quiz ID is required.");
                    result = await getQuizPerformance(quizId);
                    break;
                case "studentQuizPerformance":
                    const quizIdStudent = prompt("Enter Quiz ID:");
                    const studentId = prompt("Enter Student ID:");
                    if (!quizIdStudent || !studentId) throw new Error("Both IDs are required.");
                    result = await getStudentQuizPerformance(quizIdStudent, studentId);
                    break;
                case "averageInstructorRating":
                    const instructorId = prompt("Enter Instructor ID:");
                    if (!instructorId) throw new Error("Instructor ID is required.");
                    result = await getAverageInstructorRating(instructorId);
                    break;
                default:
                    throw new Error("Invalid action.");
            }

            setData(result);
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        const courseId = prompt("Enter instructor ID :");
        const userId = prompt("Enter Course ID :");
        if (!courseId || !userId) {
            alert("Both Course ID and User ID are required for export.");
            return;
        }
        try {
            const result = await exportProgress(courseId, userId);
            setData(result);

        } catch (error: any) {
            setError(error.message || "An error occurred while exporting data.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Progress Dashboard</h1>
                    <p className="text-gray-600 mt-4">Fetch and manage progress-related data.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => fetchData("allProgress")}
                        className="bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Get All Progress
                    </button>
                    <button
                        onClick={() => fetchData("userProgress")}
                        className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-700"
                    >
                        Get User Progress
                    </button>
                    <button
                        onClick={() => fetchData("moduleRatings")}
                        className="bg-purple-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-purple-700"
                    >
                        Get Module Ratings
                    </button>
                    <button
                        onClick={() => fetchData("quizPerformance")}
                        className="bg-red-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-red-700"
                    >
                        Get Quiz Performance
                    </button>
                    <button
                        onClick={() => fetchData("studentQuizPerformance")}
                        className="bg-teal-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-teal-700"
                    >
                        
                        Get Average Instructor Rating
                    </button>
                    <button
                        onClick={handleExport}
                        className="bg-yellow-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-yellow-700"
                    >
                        Export Data
                    </button>
                </div>

                {loading && <p className="mt-8 text-center text-gray-600">Loading...</p>}
                {error && <p className="mt-8 text-center text-red-600">{error}</p>}
                {data && (
                    <pre className="mt-8 bg-white p-6 rounded-lg shadow-md text-sm text-gray-800 overflow-auto">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default ProgressPage;
