"use client"; // Mark this file as a client component
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../../utils/apiClient";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);

      // Call the login API
      const response = await apiClient.post("/auth/login", { email, password });

      // Store the token in localStorage
      const { accessToken, role,userId } = response.data;
      localStorage.setItem("role", role); 
      localStorage.setItem("token", accessToken);
      const s=localStorage.getItem("role");
      localStorage.setItem("userId", userId); 

      // Redirect based on user role
      if (s ==='student') {
        router.push("/student/dashboard");
      } else if (s ==='admin') {
        router.push("/adminn/dashboard");
      } else if (s === 'instructor') {
        router.push("/instructor/dashboard");
      } else {
        setError("Unknown role. Please contact support.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-6 rounded shadow-md"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
