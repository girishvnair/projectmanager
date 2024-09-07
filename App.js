import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDrop } from 'react-dnd';
import LoginPage from './LoginPage';
import KanbanBoard from './KanbanBoard';
import Signup from './Signup';
import AdminPage from './AdminPage';

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState('');
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  const navigate = useNavigate();

  const handleCreateProject = () => {
    axios.post('/projects', { name: 'New Project' }).then(() => {
      loadProjects();
    });
  };

  const searchUsers = () => {
    axios.get(`/users?skill=${skills}`).then((res) => {
      setUsers(res.data);
    });
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'USER',
    drop: (item) => assignUser(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const assignUser = (userId) => {
    setAssignedUsers([...assignedUsers, users.find((u) => u.id === userId)]);
  };

  const startKanban = () => {
    navigate('/kanban');
  };

  return (
    <div className="project-container">
      <div>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Search skills..." />
        <button onClick={searchUsers}>Search</button>
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <h4>{user.username}</h4>
              <p>{user.skills}</p>
            </div>
          ))}
        </div>
      </div>
      <div ref={drop} className="assigned-users" style={{ backgroundColor: isOver ? 'lightgray' : 'white' }}>
        <h3>Assigned Users</h3>
        {assignedUsers.map((user) => (
          <div key={user.id}>
            <h4>{user.username}</h4>
          </div>
        ))}
      </div>
      <button onClick={startKanban}>Start Kanban</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/kanban" element={<KanbanBoard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
