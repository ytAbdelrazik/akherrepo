"use client";

import React, { useEffect, useState } from "react";
import apiClient from "../../../utils/apiClient";
import Link from "next/link";

interface Note {
  title: string;
  content: string;
  moduleId: string;
  userId: string; // User who created the note
}

const QuickNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<Note>({
    title: "",
    content: "",
    moduleId: "",
    userId: "",
  });
  const [userId, setUserId] = useState<string>(""); // Store the user's ID
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      const response = await apiClient.get("/notes");
      setNotes(response.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes.");
    }
  };

  const handleCreateNote = async () => {
    try {
      await apiClient.post("/notes", { ...newNote, createdBy: userId });
      setNewNote({ title: "", content: "", moduleId: "", userId: "" });
      fetchNotes();
    } catch (err) {
      console.error("Error creating note:", err);
      setError("Failed to create note.");
    }
  };

  const handleUpdateNote = async (noteId: string, title: string, content: string) => {
    try {
      await apiClient.patch(`/notes/${noteId}`, { title, content });
      fetchNotes();
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to update note.");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await apiClient.delete(`/notes/${noteId}`);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note.");
    }
  };

  useEffect(() => {
    // Fetch the user's ID from the token
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the JWT
      setUserId(decoded.userId);
    }
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Quick Notes
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Create a New Note</h2>
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-md mb-4 text-black"
          />
          <textarea
            placeholder="Content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full px-4 py-2 border rounded-md mb-4 text-black"
          />
          <input
            type="text"
            placeholder="Module ID"
            value={newNote.moduleId}
            onChange={(e) => setNewNote({ ...newNote, moduleId: e.target.value })}
            className="w-full px-4 py-2 border rounded-md mb-4 text-black"
          />
          <button
            onClick={handleCreateNote}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
          >
            Create Note
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Notes</h2>
          {notes.map((note) =>
            note.userId === userId ? ( // Only allow editing/deleting for the current user's notes
              <div key={note.title} className="bg-white shadow-md rounded-lg p-6 mb-4">
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => handleUpdateNote(note.title, e.target.value, note.content)}
                  className="w-full px-4 py-2 border rounded-md mb-2 text-black"
                />
                <textarea
                  value={note.content}
                  onChange={(e) => handleUpdateNote(note.title, note.title, e.target.value)}
                  className="w-full px-4 py-2 border rounded-md mt-2 text-black"
                />
                <button
                  onClick={() => handleDeleteNote(note.title)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ) : null
          )}
        </div>
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
  );
};

export default QuickNotes;
