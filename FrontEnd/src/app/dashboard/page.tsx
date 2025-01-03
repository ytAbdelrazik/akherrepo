'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const admingpage = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div style={styles.container}>
      <h1>ADMIN</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => router.push('dashboard/user')}>
          Users
        </button>
        <button style={styles.button} onClick={() => navigateTo('/logs')}>
          Logs
        </button>
        <button style={styles.button} onClick={() => navigateTo('dashboard/courses')}>
          Courses
        </button>
        <button style={styles.button} onClick={() => navigateTo('dashboard/schedule-backup')}>
          Schedule Backup
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
