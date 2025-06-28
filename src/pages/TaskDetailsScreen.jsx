import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../useFetch";

const TaskDetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(`https://carbon-taskmanager-backend.vercel.app/tasks/${_id}`);
  const [status, setStatus] = useState("");

  const handleComplete = () => {
   
    setStatus("Completed");
  };

  const handleCancel = () => navigate(-1); // Go back

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={styles.modal}>
      <h2 style={styles.heading}>Task Details | {data?.name}</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Project</label>
        <p style={styles.text}>{data?.project?.title || "N/A"}</p>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Team</label>
        <p style={styles.text}>{data?.team?.name || "N/A"}</p>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Owners</label>
        <p style={styles.text}>{data?.owners?.map(o => o.name).join(", ") || "N/A"}</p>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Tags</label>
        <p style={styles.text}>{data?.tags?.join(", ") || "None"}</p>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Due Date</label>
        <p style={styles.text}>{new Date(data?.dueDate).toLocaleDateString() || "N/A"}</p>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Estimated Time</label>
        <p style={styles.text}>{data?.timeToComplete} days</p>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Status</label>
        <p style={styles.text}>{status || data?.status}</p>
      </div>

      <div style={styles.actions}>
        <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
        <button style={styles.createBtn} onClick={handleComplete}>Mark as Complete</button>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    width: "400px",
    margin: "2rem auto",
    padding: "20px",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px"
  },
  fieldGroup: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#555"
  },
  text: {
    fontSize: "15px",
    padding: "6px 0",
    color: "#333"
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px"
  },
  cancelBtn: {
    backgroundColor: "#e0e0e0",
    color: "#000",
    border: "none",
    padding: "8px 16px",
    marginRight: "10px",
    borderRadius: "4px",
    cursor: "pointer"
  },
  createBtn: {
    backgroundColor: "#3b82f6", // blue-500
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default TaskDetails;
