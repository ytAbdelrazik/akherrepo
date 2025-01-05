"use client";

import React, { useState } from "react";
import { createGroupChat } from "../ChatService";

const CreateStudyGroupChatPage: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddParticipant = () => {
    const participantId = prompt("Enter Participant ID:");
    if (participantId) setParticipantIds([...participantIds, participantId]);
  };

  const handleCreateGroupChat = async () => {
    try {
      // Ensure all inputs are provided
      if (!groupName || !courseId || participantIds.length === 0) {
        setError("Please provide all required fields: Group Name, Course ID, and Participants.");
        return;
      }
  
      // Call the API to create the group chat
      await createGroupChat(groupName, participantIds, courseId);
  
      // Success message
      setSuccess("Study group chat created successfully!");
      setGroupName("");
      setParticipantIds([]);
      setCourseId("");
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Failed to create study group chat.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Study Group Chat
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter Group Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Course ID</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter Course ID"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Participants</label>
          <ul className="list-disc pl-6 mb-2 text-gray-700">
            {participantIds.length > 0 ? (
              participantIds.map((id, idx) => (
                <li key={idx} className="text-sm">
                  {id}
                </li>
              ))
            ) : (
              <p className="text-sm italic">No participants added yet.</p>
            )}
          </ul>
          <button
            onClick={handleAddParticipant}
            className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700"
          >
            Add Participant
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCreateGroupChat}
            className="bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700"
          >
            Create Study Group
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default CreateStudyGroupChatPage;