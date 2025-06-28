import React, { useState } from 'react';

const ProjectModal = ({ show, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    try {
          const token = localStorage.getItem("adminToken");
      const response = await fetch("https://carbon-taskmanager-backend.vercel.app/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json",  Authorization: token, },
        body: JSON.stringify({ name, description, status: "To Do" }),
      });
      if (!response.ok) throw new Error("Failed to create project");
      onClose();  
    } catch (err) {
    console.error("Error fetching projects:", err.message);
    }
  };

  if (!show) return null;
  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Create New Project</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input className="form-control mb-2" placeholder="Enter Project Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea className="form-control" placeholder="Enter Project Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
