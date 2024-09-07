import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resource');
  const [skills, setSkills] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/admin/users').then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleCreateUser = () => {
    const data = { username, password, role, skills };
    axios.post('/admin/create_user', data).then((res) => {
      alert('User created successfully');
      setUsers([...users, res.data]);
    });
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`/admin/delete_user/${userId}`).then(() => {
      setUsers(users.filter((user) => user.id !== userId));
    });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Create User</h3>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="resource">Resource</option>
        <option value="project_manager">Project Manager</option>
      </select>
      {role === 'resource' && (
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma-separated)" />
      )}
      <button onClick={handleCreateUser}>Create User</button>

      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.role}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
