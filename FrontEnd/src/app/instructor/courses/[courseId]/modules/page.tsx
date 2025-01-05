"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "../../../../../utils/apiClient";

interface Module {
    moduleId: string;
    title: string;
    content: string;
}

const ViewModules: React.FC = () => {
    const { courseId } = useParams();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await apiClient.get(`/modules/${courseId}/modules`);
            setModules(response.data);
        } catch (err: any) {
            console.error("Error fetching modules:", err);
            setError("Failed to load modules.");
        } finally {
            setLoading(false);
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
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Modules</h1>

                <div className="grid gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.moduleId}
                            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
                        >
                            <h2 className="text-2xl font-semibold text-blue-600">{module.title}</h2>
                            <p className="text-gray-600 mb-4">{module.content}</p>
                            <Link href={`/instructor/courses/${courseId}/modules/${module.moduleId}/edit`} legacyBehavior>
                                <button className="bg-purple-600 text-white py-2 px-6 rounded-md shadow hover:bg-purple-700">
                                    Edit Module
                                </button>
                            </Link>


                        </div>
                    ))}
                </div>
                <Link href="/instructor/courses" legacyBehavior>
            <button className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700">
              Back to Courses
            </button>
          </Link>
            </div>
        </div>
    );
};

export default ViewModules;
