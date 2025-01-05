"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    fetchChats,
    fetchMessages,
    sendMessage,
    deleteMessage,
    deleteChat,
} from "./ChatService";

const ChatPage: React.FC = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User is not authenticated. Please log in.");
                return;
            }
            const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
            const userID = decodedToken.userId;

            setUserId(userID);
            loadChats();
        } catch (err) {
            setError("Failed to decode token. Please log in again.");
        }
    }, []);

    const loadChats = async () => {
        try {
            const data = await fetchChats();
            setChats(data);
        } catch (err) {
            setError("Failed to load chats.");
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (chatId: string) => {
        try {
            const data = await fetchMessages(chatId);
            setMessages(data);
        } catch (err) {
            setError("Failed to load messages.");
        }
    };

    const handleSendMessage = async () => {
        if (!selectedChat || !newMessage) return;

        try {
            await sendMessage(selectedChat, newMessage, "student");
            setNewMessage("");
            loadMessages(selectedChat);
        } catch (err) {
            setError("Failed to send message.");
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
          if (!userId) {
            setError("User is not authenticated.");
            return;
          }
          await deleteMessage(messageId, userId); // No error, as the userId is passed in the body
          loadMessages(selectedChat!); // Reload messages
        } catch (err) {
          setError("Failed to delete message.");
        }
      };
      
      const handleDeleteChat = async (chatId: string) => {
        try {
          if (!userId) {
            setError("User is not authenticated.");
            return;
          }
          await deleteChat(chatId, userId); // No error, as the userId is passed in the body
          loadChats(); // Reload chats
          setSelectedChat(null);
        } catch (err) {
          setError("Failed to delete chat.");
        }
      };
      

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Chat</h1>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <div className="mb-8">
                    <button
                        onClick={() => router.push("/chat/create")}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700"
                    >
                        Create Study Group Chat
                    </button>
                </div>

                <div className="mb-8">
                    <button
                        onClick={() => router.push("/chat/create-group")}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700"
                    >
                        Create Course Group Chat
                    </button>

                    <button
                        onClick={() => router.push("/chat/create-one-to-one")}
                        className="bg-purple-600 text-white py-2 px-6 rounded-md shadow hover:bg-purple-700 ml-4"
                    >
                        Create One-to-One Chat
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Chats</h2>
                    {loading ? (
                        <p>Loading chats...</p>
                    ) : (
                        <ul className="list-disc pl-6">
                            {chats.map((chat: any) => (
                                <li key={chat.chatId}>
                                    <p className="text-gray-800">
                                        <strong>{chat.groupName || chat.chatId}</strong>
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedChat(chat.chatId);
                                            loadMessages(chat.chatId);
                                        }}
                                        className="bg-green-600 text-white py-2 px-4 rounded-md shadow hover:bg-green-700 mt-2"
                                    >
                                        View Messages
                                    </button>
                                    <button
                                        onClick={() => handleDeleteChat(chat.chatId)}
                                        className="bg-red-600 text-white py-2 px-4 rounded-md shadow hover:bg-red-700 mt-2 ml-2"
                                    >
                                        Delete Chat
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedChat && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
                        <ul className="list-disc pl-6">
  {messages.map((msg: any, idx) => (
    <li key={idx} className="text-gray-800">
      <strong>{msg.senderId}:</strong> {msg.content}
      <button
        onClick={() => handleDeleteMessage(msg._id)} // Use `msg._id` to pass the MongoDB-generated message ID
        className="bg-red-600 text-white py-1 px-3 rounded-md shadow hover:bg-red-700 ml-4"
      >
        Delete
      </button>
    </li>
  ))}
</ul>


                        <div className="mt-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                                placeholder="Type your message..."
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-600 text-white py-2 px-6 rounded-md shadow hover:bg-gray-700"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
