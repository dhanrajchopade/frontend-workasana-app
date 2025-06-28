import React, { useState } from "react";
import axios from "axios";

const AddMemberModal = ({ onClose, teamId, onAdd }) => {
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // JWT
      const response = await axios.post(
        `https://carbon-taskmanager-backend.vercel.app/teams/${teamId}/members`,
        { name: memberName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onAdd(response.data.member); // Optionally update parent state
      setMemberName("");
      onClose();
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Failed to add member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white w-80 p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Add New Member</h2>
          <button onClick={onClose} className="text-gray-500">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="text-xs text-gray-600 mb-1 block">Member Name</label>
          <input
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="w-full border px-2 py-1 text-sm rounded mb-4"
            placeholder="Enter Member Name"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 text-sm bg-gray-200 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 text-sm bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
