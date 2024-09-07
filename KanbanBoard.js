import React, { useState, useEffect } from 'react';
import axios from 'axios';

function KanbanBoard() {
  const [kanbanData, setKanbanData] = useState([]);

  useEffect(() => {
    axios.get(`/projects/1/kanban?phase=Phase 1`).then((res) => {
      setKanbanData(res.data);
    });
  }, []);

  return (
    <div className="kanban-board">
      <h3>Kanban Board</h3>
      {kanbanData.map((task, index) => (
        <div key={index} className="kanban-task">
          <h4>{task.assignee}</h4>
          <p>{task.task}</p>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
