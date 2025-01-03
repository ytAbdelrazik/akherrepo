import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000', // Correct backend port
});

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
  }}
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
// Add a request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);



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




export const getUserById = async (userId: string) => {
  const response = await apiClient.get('users/getUser/byId', {
    params: { userId },
  });
  return response.data;
};

export const updateProfile = async (updateData: any) => {
  const response = await apiClient.patch('/profile/update', updateData);
  return response.data;
};

export const getAllStudents = async () => {
  const response = await apiClient.get('/students');
  return response.data;
};

export const getAllInstructors = async () => {
  const response = await apiClient.get('/instructors');
  return response.data;
};

export const searchStudents = async (name: string, limit = 10, offset = 0) => {
  const response = await apiClient.get('/search', {
    params: { name, limit, offset },
  });
  return response.data;
};

export const deleteSelf = async () => {
  const response = await apiClient.delete('/users/self');
  return response.data;
};



export default apiClient;
