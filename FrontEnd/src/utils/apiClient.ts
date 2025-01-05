import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000', // Correct backend port
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Correct way to set the Authorization header
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Sign up function
export async function signUp(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
    const response = await apiClient.post('/auth/sign-up', userData);
    return response.data;
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error;
  }
}

// Get user by ID
export const getUserById = async (userId: string) => {
  const response = await apiClient.get('users/getUser/byId', {
    params: { userId },
  });
  return response.data;
};

// Get all students
export const getAllStudents = async () => {
  const response = await apiClient.get('users/students');
  return response.data;
};

// Get all instructors
export const getAllInstructors = async () => {
  const response = await apiClient.get('users/instructors');
  return response.data;
};

// Search students
export const searchStudents = async (name: string, limit = 10, offset = 0) => {
  const response = await apiClient.get('users/search', {
    params: { name, limit, offset },
  });
  return response.data;
};

// Deleting user by admin
export const deleteUserByAdmin = async (userId: string) => {
  try {
    const response = await apiClient.delete(`users/deleteus/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user by admin:', error);
    throw error;
  }
};

// Get failed logins
export const getFailedLogins = async () => {
  const response = await apiClient.get('users/failed-logins');
  return response.data;
};




export const deleteself = async (userId: string) => {
  try {
    const response = await apiClient.delete(`users/users/self/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};



export async function scheduleBackup(intervalDays: number): Promise<string> {
  try {
    const response = await apiClient.post('/backup/schedule', { intervalDays });
    return response.data; // Assuming the response contains the success message
  } catch (error) {
    console.error('Error scheduling backup:', error);
    throw error;
  }
}

// Stop the backup schedule
export async function stopBackupSchedule(): Promise<string> {
  try {
    const response = await apiClient.delete('/backup/schedule');
    return response.data; 
  } catch (error) {
    console.error('Error stopping backup schedule:', error);
    throw error;
  }
}

export const toggleCourseAvailability = async (courseId: string, isAvailable: boolean) => {
  try {
    // Ensure the URL is correct
    const response = await apiClient.patch(`/users/courses/${courseId}/availability`, {
      isAvailable: !isAvailable, // Toggle the availability
    });
    return response.data;
  } catch (error) {
    console.error('Error in toggleCourseAvailability:', error);
    throw error; // Re-throw error to be caught in the frontend
  }
};






export const getAllCourses = async () => {
  const response = await apiClient.get('/courses');
  return response.data;
};



export const getAllProgress = async () => {
  try {
    const response = await apiClient.get('/performance-tracking/allprog');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all progress:', error);
    throw error;
  }
};

// Get progress for a specific user
export const getUserProgress = async (userId: string) => {
  try {
    const response = await apiClient.get(`/performance-tracking/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch progress for user ${userId}:`, error);
    throw error;
  }
};

// Get module ratings for a specific course
export const getModuleRatings = async (courseId: string) => {
  try {
    const response = await apiClient.get(`/performance-tracking/module-ratings/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch module ratings for course ${courseId}:`, error);
    throw error;
  }
};

// Get quiz performance for a specific quiz
export const getQuizPerformance = async (quizId: string) => {
  try {
    const response = await apiClient.get(`/performance-tracking/quiz-performance/${quizId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch quiz performance for quiz ${quizId}:`, error);
    throw error;
  }
};

// Get student-specific quiz performance
export const getStudentQuizPerformance = async (quizId: string, userId: string) => {
  try {//quiz-performance/student/:quizId/:userId'
    const url = `/performance-tracking/quiz-performance/student/${quizId}/${userId}`;
   
    console.log(`Fetching URL: ${apiClient.defaults.baseURL}${url}`);
    const response = await apiClient.get(`/performance-tracking/quiz-performance/student/${quizId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch quiz performance for quiz ${quizId} and user ${userId}:`, error);
    throw error;
  }
};

// Get the average rating for a specific course
export const getAverageCourseRating = async (courseId: string) => {
  try {
    const response = await apiClient.get(`/performance-tracking/courserating/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch average rating for course ${courseId}:`, error);
    throw error;
  }
};

// Get the average rating for an instructor
export const getAverageInstructorRating = async (instructorId: string) => {
  try {
    const response = await apiClient.get(`/performance-tracking/instructor/${instructorId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch average rating for instructor ${instructorId}:`, error);
    throw error;
  }
};

// Export course analytics
export const exportAnalytics = async (courseId: string, userId: string, format = 'csv') => {
  try {
    const response = await apiClient.get(`/performance-tracking/${userId}/${courseId}/export`, {
      params: { format },
      responseType: 'blob', // To handle CSV or other binary data
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to export analytics for course ${courseId} and user ${userId}:`, error);
    throw error;
  }
};
export const exportProgress = async (userId: string, courseId: string, format: string = "csv") => {
  try {
      const response = await apiClient.get(
          `/performance-tracking/${userId}/${courseId}/export?format=${format}`
      );
      
      // Log the exported data and show a preview on the frontend
      console.log("Exported successfully in performance-tracking dtos:", response.data);
      
      // Display a preview of the data (this can be customized as needed)
      alert(`Exported successfully. Here's a preview of the data:\n\n${JSON.stringify(response.data, null, 2)}`);
      
      return response.data;
  } catch (error) {
      console.error(`Failed to export progress for user ${userId} and course ${courseId}:`, error);
      throw error;
  }
};

// Fetch forums for a specific course
export const getForumsByCourseId = async (courseId: string) => {
  try {
    const response = await apiClient.get(`/courses/${courseId}/forums`);
    return response.data; // Assuming the backend returns an array of forums
  } catch (error) {
    console.error('Error fetching forums:', error);
    throw error;
  }
};

// Delete a forum by course ID and forum ID
export const deleteForumById = async (courseId: string, forumId: string): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/forums/${forumId}`);
  } catch (error) {
    console.error('Error deleting forum:', error);
    throw error;
  }
};
export const editForumById = async (courseId: string, forumId: string, title: string, newContent: string) => {
  try {
    const response = await apiClient.patch(`/courses/${courseId}/forums/${forumId}`, {
      title,
      newContent,
    });
    return response.data;
  } catch (error) {
    console.error('Error editing forum:', error);
    throw error;
  }
};

// Create a new forum
export const createForum = async (courseId: string, title: string, content: string) => {
  try {
    const response = await apiClient.post(`/courses/${courseId}/forums`, { title, content });
    return response.data;
  } catch (error) {
    console.error('Error creating forum:', error);
    throw error;
  }
};


// Fetch comments for a specific forum
export const getCommentsByForumId = async (forumId: string) => {
  try {
    const response = await apiClient.get(`/courses/forums/${forumId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Create a new comment for a forum
export const createComment = async (forumId: string, content: string) => {
  try {
    const response = await apiClient.post(`/courses/forums/${forumId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteCommentById = async (forumId: string, commentId: string) => {
  try {
    await apiClient.delete(`/courses/forums/${forumId}/comments/${commentId}`);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
 
export const logout = async (userId:string, token:string) => {
  try {
    const response = await apiClient.post('/auth/logout', {
      userId,
      token,
    });

    // Handle the response (e.g., success message or return data)
    console.log('Logout successful:', response.data);
    return response.data;
  } catch (error) {
    // Handle errors (e.g., log or display error message)
    console.error('Logout failed')
    throw error;
  }
};

export default apiClient;
