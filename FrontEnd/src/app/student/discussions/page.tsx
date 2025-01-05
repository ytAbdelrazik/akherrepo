"use client";

import React, { useState } from 'react';
import { getForumsByCourseId, deleteForumById, createForum, editForumById } from '../../../utils/apiClient';

interface Forum {
  _id: string;
  title: string;
  content: string;
  courseId: string;
}

const navigateToCommentsPage = (forumId: string) => {
  window.location.href = `/student/discussions/${forumId}/comments`; // Replace with your actual route
};

const StudentPage: React.FC = () => {
  const [courseId, setCourseId] = useState('');
  const [forums, setForums] = useState<Forum[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({ courseId: '', title: '', content: '' });
  const [editingForum, setEditingForum] = useState<Forum | null>(null);

  const handleFetchForums = async () => {
    if (!courseId.trim()) {
      setError('Course ID is required.');
      return;
    }

    try {
      setError(null);
      const data = await getForumsByCourseId(courseId);
      setForums(data);
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError('Failed to fetch forums. Please try again.');
    }
  };

  const handleDeleteForum = async (forumId: string) => {
    try {
      await deleteForumById(courseId, forumId);
      setForums((prevForums) => prevForums.filter((forum) => forum._id !== forumId));
    } catch (err) {
      console.error('Error deleting forum:', err);
      setError('Failed to delete forum. Please try again.');
    }
  };

  const handleCreateNewForum = async () => {
    if (!newForum.courseId || !newForum.title || !newForum.content) {
      setError('All fields are required to create a forum.');
      return;
    }

    try {
      setError(null);
      const createdForum = await createForum(newForum.courseId, newForum.title, newForum.content);
      setForums((prevForums) => [createdForum, ...prevForums]);
      setNewForum({ courseId: '', title: '', content: '' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating forum:', err);
      setError('Failed to create forum. Please try again.');
    }
  };

  const handleEditForum = (forum: Forum) => {
    setEditingForum(forum);
  };

  const handleSaveEdit = async () => {
    if (!editingForum) {
      setError('No forum selected for editing.');
      return;
    }

    try {
      await editForumById(editingForum.courseId, editingForum._id, editingForum.title, editingForum.content);
      setForums((prevForums) =>
        prevForums.map((forum) =>
          forum._id === editingForum._id ? { ...forum, title: editingForum.title, content: editingForum.content } : forum
        )
      );
      setEditingForum(null);
    } catch (err) {
      console.error('Error saving forum edit:', err);
      setError('Failed to save forum edit. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Student Forum Page</h1>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleFetchForums} style={styles.button}>
          Fetch Forums
        </button>
        <button onClick={() => setShowCreateForm((prev) => !prev)} style={styles.button}>
          {showCreateForm ? 'Cancel' : 'Create New Forum'}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {showCreateForm && (
        <div style={styles.createForm}>
          <h3 style={styles.formTitle}>Create New Forum</h3>
          <input
            type="text"
            placeholder="Enter Course ID"
            value={newForum.courseId}
            onChange={(e) => setNewForum({ ...newForum, courseId: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Enter Forum Title"
            value={newForum.title}
            onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
            style={styles.input}
          />
          <textarea
            placeholder="Enter Forum Content"
            value={newForum.content}
            onChange={(e) => setNewForum({ ...newForum, content: e.target.value })}
            style={styles.textarea}
          />
          <button onClick={handleCreateNewForum} style={styles.button}>
            Save Forum
          </button>
        </div>
      )}

      <div style={styles.forumContainer}>
        {forums.length > 0 ? (
          forums.map((forum) => (
            <div key={forum._id} style={styles.forumBox}>
              {editingForum && editingForum._id === forum._id ? (
                <>
                  <input
                    type="text"
                    value={editingForum.title}
                    onChange={(e) => setEditingForum({ ...editingForum, title: e.target.value })}
                    style={styles.input}
                  />
                  <textarea
                    value={editingForum.content}
                    onChange={(e) => setEditingForum({ ...editingForum, content: e.target.value })}
                    style={styles.textarea}
                  />
                  <button onClick={handleSaveEdit} style={styles.button}>
                    Save
                  </button>
                  <button onClick={() => setEditingForum(null)} style={styles.cancelButton}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 style={styles.forumTitle}>{forum.title}</h3>
                  <p style={styles.forumContent}>{forum.content}</p>
                  <p>
                    <strong>Course ID:</strong> {forum.courseId}
                  </p>
                  <button onClick={() => handleEditForum(forum)} style={styles.editButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteForum(forum._id)} style={styles.deleteButton}>
                    Delete
                  </button>
                  <button onClick={() => navigateToCommentsPage(forum._id)} style={styles.commentButton}>
                    Comments
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No forums available. Please enter a valid course ID.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    textAlign: 'center' as const,
  },
  title: {
    marginBottom: '20px',
    color: '#343a40',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '600px',
  },
  input: {
    padding: '10px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#ffffff',
    color: '#212529',
  },
  textarea: {
    padding: '10px',
    width: '100%',
    height: '100px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#ffffff',
    color: '#212529',
    resize: 'none' as const,
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#6c757d',
    color: 'white',
    cursor: 'pointer',
  },
  editButton: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#ffc107',
    color: 'white',
    cursor: 'pointer',
    marginRight: '10px',
  },
  deleteButton: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
  },
  commentButton: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    marginTop: '10px',
  },
  forumContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    width: '100%',
    maxWidth: '600px',
  },
  forumBox: {
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f8f9fa',
    color: '#212529',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  forumTitle: {
    color: '#007bff',
  },
  forumContent: {
    color: '#495057',
  },
  createForm: {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  formTitle: {
    marginBottom: '10px',
    color: '#343a40',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
};

export default StudentPage;