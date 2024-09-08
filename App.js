import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";
import { useDrop } from 'react-dnd';
import LoginPage from './LoginPage';
import KanbanBoard from './KanbanBoard';
import Signup from './Signup';
import AdminPage from './AdminPage';
import './Chat.css';

const socket = io("http://localhost:5000");  // Connect to Flask backend

function ProjectPage() {
  const [project, setProject] = useState(null);
  const [skills, setSkills] = useState('');
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const { projectId } = useParams();  // Fetch project ID from URL
  const username = "ProjectManager";  // Replace with actual logged-in user info
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch project details dynamically based on the projectId
    axios.get(`/projects/${projectId}`).then((res) => {
      setProject(res.data);
      setAssignedUsers(res.data.users);  // Pre-fill with assigned users from the project
    }).catch((err) => console.error(err));

    // Join the chat room for the project
    socket.emit("join", { username, project_id: projectId });

    // Receive messages
    socket.on("message", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      // Leave the room when the component unmounts
      socket.emit("leave", { username, project_id: projectId });
    };
  }, [projectId]);

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
    const user = users.find((u) => u.id === userId);
    setAssignedUsers([...assignedUsers, user]);
    // Optionally, save this user assignment to the project in the backend
    axios.post(`/projects/${projectId}/assign`, { userId });
  };

  const startKanban = () => {
    navigate(`/kanban/${projectId}`);  // Pass the project ID to the Kanban board
  };

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("message", {
        message: message,
        username: username,
        project_id: projectId,
      });
      setMessage("");
    }
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

      {/* Drag-and-Drop for assigning users */}
      <div ref={drop} className="assigned-users" style={{ backgroundColor: isOver ? 'lightgray' : 'white' }}>
        <h3>Assigned Users</h3>
        {assignedUsers.map((user) => (
          <div key={user.id}>
            <h4>{user.username}</h4>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="chat-container">
        <div className="chat-box">
          {chat.map((chatMsg, index) => (
            <div key={index}>
              <strong>{chatMsg.username}:</strong> {chatMsg.message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      {/* Start Kanban button */}
      <button onClick={startKanban}>Start Kanban</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/kanban/:projectId" element={<KanbanBoard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
