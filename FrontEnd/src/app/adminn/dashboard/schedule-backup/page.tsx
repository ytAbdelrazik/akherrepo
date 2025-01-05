'use client';


import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { scheduleBackup, stopBackupSchedule } from '../../../../utils/apiClient'; // Import the API functions
import DatePicker from 'react-datepicker'; // To use the date picker component
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for the date picker

const BackupPage: React.FC = () => {
  const [intervalDays, setIntervalDays] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null); // For calendar pop-up
  const router = useRouter();

  const handleScheduleBackup = async () => {
    if (!intervalDays || intervalDays <= 0) {
      setError('Please enter a valid number of days for the interval.');
      return;
    }

    try {
      setError(null); // Clear any previous errors
      const message = await scheduleBackup(intervalDays); // Call the scheduleBackup API function
      setSuccessMessage(message); // Show success message
    } catch (error) {
      console.error('Failed to schedule backup:', error);
      setError('Failed to schedule backup. Please try again later.');
    }
  };

  const handleStopBackupSchedule = async () => {
    try {
      setError(null);
      const message = await stopBackupSchedule(); // Call the stopBackupSchedule API function
      setSuccessMessage(message); // Show success message
    } catch (error) {
      console.error('Failed to stop backup schedule:', error);
      setError('Failed to stop backup schedule. Please try again later.');
    }
  };

  const navigateHome = () => {
    router.push('/adminn/dashboard'); // Redirect to the admin home page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Schedule Backup</h1>
      <button style={styles.homeButton} onClick={navigateHome}>
        <FaHome style={styles.homeIcon} /> Home
      </button>
      {error && <p style={styles.errorText}>{error}</p>}
      {successMessage && <p style={styles.successText}>{successMessage}</p>}

      <div style={styles.inputContainer}>
        <label style={styles.label}>Choose Backup Interval (in Days):</label>
        <input
          type="number"
          value={intervalDays || ''}
          onChange={(e) => setIntervalDays(Number(e.target.value))}
          style={styles.input}
        />

        <label style={styles.label}>Choose Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)} // Updated to accept Date | null
          dateFormat="yyyy/MM/dd"
          className="datepicker-input" // Use className instead of style for custom styling
        />
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleScheduleBackup}>
          Schedule Backup
        </button>
        <button style={styles.button} onClick={handleStopBackupSchedule}>
          Stop Backup Schedule
        </button>
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
  inputContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  label: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '250px',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
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
  successText: {
    color: 'green',
    textAlign: 'center',
  },
};

export default BackupPage;