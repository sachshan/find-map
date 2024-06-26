import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [group_key, setGroupKey] = useState(''); // Changed state variable name
  const navigate = useNavigate();

  const handleLogin = () => {
    // Handle login logic (e.g., validation, authentication)
    // For simplicity, just navigate to the map page with parameters
    navigate(`/map/${username}/${group_key}`); // Changed parameter name here as well
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Group Key:
          <input type="text" value={group_key} onChange={(e) => setGroupKey(e.target.value)} /> {/* Changed label text */}
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
