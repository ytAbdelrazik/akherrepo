'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllCourses, toggleCourseAvailability } from '../../../../utils/apiClient';
import { FaHome } from 'react-icons/fa'; // Import the home icon from react-icons

interface Course {
  _id: string;
  courseId: string;
  title: string;
  instructor: string;
  isAvailable: boolean;
  description?: string;
  category?: string;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setError(null);
      const data = await getAllCourses();
      setCourses(data);
      console.log('Fetched courses:', data); 
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError('Failed to fetch courses. Please try again later.');
    }
  };

  const handleToggleCourseAvailability = async (courseId: string | null, isAvailable: boolean) => {
    if (!courseId) {
      console.error('Invalid course ID');
      setError('Invalid course ID');
      return;
    }
    try {
      setError(null);
      await toggleCourseAvailability(courseId, isAvailable);
      fetchCourses();
    } catch (error) {
      console.error('Failed to update course availability:', error);
      setError('Failed to update course availability. Please try again later.');
    }
  };

  const sendMessage = (courseId: string) => {
    router.push(`/courses/${courseId}/send-message`);
  };

  const navigateHome = () => {
    router.push('/adminn/dashboard'); // Redirect to the admin home page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Courses Management</h1>
      <button style={styles.homeButton} onClick={navigateHome}>
        <FaHome style={styles.homeIcon} /> Home
      </button>
      {error && <p style={styles.errorText}>{error}</p>}
      <div style={styles.cardContainer}>
        {courses.map((course) => (
          <div key={course.courseId} style={styles.card}>
            <h2 style={styles.cardTitle}>{course.title}</h2>
            <p style={styles.cardDetail}>Instructor: {course.instructor}</p>
            <p style={styles.cardDetail}>
              Status: 
              <span style={course.isAvailable ? styles.active : styles.inactive}>
                {course.isAvailable ? 'Active' : 'Inactive'}
              </span>
            </p>
            <div style={styles.buttonContainer}>
              <button
                style={styles.button}
                onClick={() => handleToggleCourseAvailability(course.courseId, course.isAvailable)}
              >
                {course.isAvailable ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  homeButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '16px',
  },
  homeIcon: {
    marginRight: '10px',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    width: '300px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#007bff',
    marginBottom: '10px',
  },
  cardDetail: {
    color: '#666',
    marginBottom: '10px',
  },
  active: {
    color: 'green',
    fontWeight: 'bold',
  },
  inactive: {
    color: 'red',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
};

export default CoursesPage;
