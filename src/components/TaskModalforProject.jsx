import React, { useState } from 'react';

const TaskModalforProject = ({ project, onClose, onTaskAdded, teams = [] }) => {
  const [task, setTask] = useState({
    title: '',
    team: '',
    dueDate: '',
    estimatedTime: '',
  });

  const handleCreate = async () => {
    if (!task.title) {
      alert("Task title is required");
      return;
    }

    try {
      const response = await fetch(`https://carbon-taskmanager-backend.vercel.app/projects/${project._id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: task.title,
          team: task.team,
          dueDate: task.dueDate,
          estimatedTime: task.estimatedTime,
          status: "To Do",
          owner: "",  // you can add owner if needed
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");
      
      onTaskAdded();  // notify parent to refresh task list
    } catch (err) {
      console.error("Error creating task:", err.message);
       
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Create New Task for {project.name}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              className="form-control mb-2"
              placeholder="Enter Task Title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
            <select
              className="form-select mb-2"
              value={task.team}
              onChange={(e) => setTask({ ...task, team: e.target.value })}
            >
              <option value="">Select Team (optional)</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="form-control mb-2"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="Estimated Time (days)"
              value={task.estimatedTime}
              onChange={(e) => setTask({ ...task, estimatedTime: e.target.value })}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModalforProject;
