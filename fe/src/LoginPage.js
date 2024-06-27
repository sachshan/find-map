// LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css//LoginPage.css'; // Import your Sass file

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [group_key, setGroupKey] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // For simplicity, just navigate to the map page with parameters
    navigate(`/map/${username}/${group_key}`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/map/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          group_key,
        }),
      });
      if (response.ok) {
        // User deleted successfully, navigate to some confirmation page or handle accordingly
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Pigeon Hangout App</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Group Key:
          <input
            type="text"
            value={group_key}
            onChange={(e) => setGroupKey(e.target.value)}
          />
        </label>
        <br />
        <div className='loginButtons'>
          <button type="submit">Login</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
