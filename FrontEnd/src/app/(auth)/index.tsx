// src/app/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
const HomePage = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to GIU Bootleg CMS</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigateTo('/(auth)/login')}>
          Login
        </button>
        <button style={styles.button} onClick={() => navigateTo('/(auth)/register')}>
          Register
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

export default HomePage;
