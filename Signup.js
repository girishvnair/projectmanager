import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resource');
  const [skills, setSkills] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    const data = { username, password, role, skills };
    axios.post('/signup', data).then((res) => {
      alert('Signup successful');
      navigate('/login');
    });
  };

  return (
    <div>
      <h2>Signup</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="resource">Resource</option>
        <option value="project_manager">Project Manager</option>
      </select>
      {role === 'resource' && (
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma-separated)" />
      )}
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;
