'use client';

import { logout } from '@/utils/apiClient';
import React from 'react';
import { useRouter } from 'next/navigation';

const admingpage = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const userId = localStorage.getItem('userId'); // Use consistent variable name
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      if (userId && token) { // Ensure both userId and token are non-empty
        await logout(userId, token); // Call the logout function from apiClient
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // Redirect to login page after successful logout
        router.push('/login');
      } else {
        alert('User is not logged in');
      }
    } catch (error) {
      alert('Logout failed');
    }
  };


  return (
    <div style={styles.container}>
      <h1>ADMIN</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => router.push('dashboard/user')}>
          Users
        </button>
        <button style={styles.button} onClick={() => navigateTo('dashboard/logss')}>
          Logs
        </button>
        <button style={styles.button} onClick={() => navigateTo('dashboard/courses')}>
          Courses
        </button>
        <button style={styles.button} onClick={() => navigateTo('dashboard/schedule-backup')}>
          Schedule Backup
        </button>
        {/* Add Logout Button */}
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  container: {
    textAlign: 'center',
    marginTop: '20vh',
  },
  buttonContainer: {
    marginTop: '20px',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
};

export default admingpage;
