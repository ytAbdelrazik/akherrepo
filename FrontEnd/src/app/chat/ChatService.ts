import apiClient from "../../utils/apiClient";

// Fetch chats for the user
export const fetchChats = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not authenticated.");

  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
  const userId = decodedToken.userId;

  const response = await apiClient.get(`/chat/getchat?userId=${userId}`);
  return response.data;
};

// Fetch messages for a specific chat
export const fetchMessages = async (chatId: string, lastMessageId?: string) => {
    const response = await apiClient.get(`/chat/${chatId}/messages`, {
      params: lastMessageId ? { lastMessageId } : {},
    });
    return response.data; // Ensure this data includes `messageId`
  };
  

// Send a message to a chat
export const sendMessage = async (
  chatId: string,
  content: string,
  role: "student" | "instructor"
) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not authenticated.");

  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
  const senderId = decodedToken.userId;

  const response = await apiClient.post(`/chat/message/${chatId}`, {
    senderId,
    content,
    role,
  });
  return response.data;
};

// Create a study group chat
export const createGroupChat = async (
    groupName: string,
    participantIds: string[],
    courseId: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated.");
  
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
    const creatorId = decodedToken.userId;
  
    // Include `courseId` in the request payload
    const response = await apiClient.post(`/chat/course/${courseId}/study-group`, {
      creatorId,
      groupName,
      participantIds,
      courseId,
    });
    return response.data;
  };
  
  

// Create a one-to-one chat
export const createOneToOneChat = async (
  userId2: string,
  courseId: string
) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not authenticated.");

  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
  const userId1 = decodedToken.userId;

  const response = await apiClient.post(`/chat/course/${courseId}/one-to-one`, {
    userId1,
    userId2,
  });
  return response.data;
};

// Join a chat
export const joinChat = async (chatId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not authenticated.");

  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
  const userId = decodedToken.userId;

  const response = await apiClient.post(`/chat/join`, {
    chatId,
    userId,
  });
  return response.data;
};

// Delete a specific message
export const deleteMessage = async (messageId: string, userId: string) => {
    const response = await apiClient.delete(`/chat/message/${messageId}`, {
      data: { userId }, // Pass userId in the request body
    });
    return response.data;
  };
  
  export const deleteChat = async (chatId: string, userId: string) => {
    const response = await apiClient.delete(`/chat/${chatId}`, {
      data: { userId }, // Pass userId in the request body
    });
    return response.data;
  };
  
