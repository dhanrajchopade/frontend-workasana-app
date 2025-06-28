import React, { useState, useEffect } from "react";

const CreateNewTeamModal = ({ show, onClose, onTeamCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberNames, setMemberNames] = useState(""); // comma-separated names
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
 
  useEffect(() => {
    if (!show) return;
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://carbon-taskmanager-backend.vercel.app/users", {
          headers: { Authorization: token }
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [show]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);
    try {
      // Split names and trim whitespace
      const namesArray = memberNames
        .split(",")
        .map(n => n.trim())
        .filter(n => n.length > 0);

      // Map names to user IDs
      const memberIds = users
        .filter(user => namesArray.includes(user.name))
        .map(user => user._id);

      if (memberIds.length !== namesArray.length) {
        setErrorMsg("Some member names do not match any user.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch("https://carbon-taskmanager-backend.vercel.app/teams", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          members: memberIds, // Array of user ObjectIds
        }),
      });
      if (!res.ok) throw new Error("Failed to create team");
      setSuccessMsg("Team added successfully!");
      setName("");
      setDescription("");
      setMemberNames("");
      if (onTeamCreated) onTeamCreated();
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || "Failed to add Team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create New Team</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Member Names (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={memberNames}
                  onChange={e => setMemberNames(e.target.value)}
                  placeholder="e.g. Alice, Bob, Charlie"
                />
                <div className="form-text">
                  Enter user names as shown in the users list, separated by commas.
                </div>
              </div>
              {successMsg && <div className="alert alert-success">{successMsg}</div>}
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewTeamModal;