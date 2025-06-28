import React, { useState, useEffect } from 'react';

const TaskModal = ({ show, onClose, projects = [], project = null }) => {
  const [task, setTask] = useState({
    name: '',
    project: project?._id || '',
    team: '',
    dueDate: '',
    timeToComplete: '',
    owners: [],
  });

  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);

  // Fetch users (requires JWT)
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    fetch('https://carbon-taskmanager-backend.vercel.app/users', {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, []);

  // Fetch teams (requires JWT)
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    fetch('https://carbon-taskmanager-backend.vercel.app/teams', {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => setTeams(Array.isArray(data) ? data : []))
      .catch(() => setTeams([]));
  }, []);

  const handleCreate = async () => {
    if (!task.owners.length) {
      alert("Please select at least one owner.");
      return;
    }
    if (!task.team) {
      alert("Please select a team.");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://carbon-taskmanager-backend.vercel.app/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name: task.name,
          project: task.project,
          team: task.team,
          dueDate: task.dueDate,
          timeToComplete: Number(task.timeToComplete),
          status: "To Do",
          owners: task.owners,
        }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      onClose();
    } catch (err) {
      console.error("Error creating task:", err.message);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Create New Task | Create Moodboard</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <label className="form-label fw-semibold">Select Project</label>
            <select
              className="form-select mb-3"
              value={task.project}
              onChange={(e) => setTask({ ...task, project: e.target.value })}
            >
              <option value="">{projects.length ? "Dropdown" : "No Projects"}</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>
                  {p.title || p.name}
                </option>
              ))}
            </select>

            <label className="form-label fw-semibold">Task Name</label>
            <input
              className="form-control mb-3"
              placeholder="Enter Task Name"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
            />

            <label className="form-label fw-semibold">Select Team</label>
            <select
              className="form-select mb-3"
              value={task.team}
              onChange={(e) => setTask({ ...task, team: e.target.value })}
            >
              <option value="">Dropdown</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>

            <label className="form-label fw-semibold">Select Owners</label>
            <select
              className="form-select mb-3"
              multiple
              value={task.owners}
              onChange={e =>
                setTask({
                  ...task,
                  owners: Array.from(e.target.selectedOptions, option => option.value),
                })
              }
            >
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label fw-semibold">Select Due date</label>
                <input
                  type="date"
                  className="form-control"
                  value={task.dueDate}
                  onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                />
              </div>
              <div className="col">
                <label className="form-label fw-semibold">Estimated Time</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Enter Time in Days"
                  value={task.timeToComplete}
                  onChange={(e) => setTask({ ...task, timeToComplete: e.target.value })}
                />
              </div>
            </div>
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

export default TaskModal;