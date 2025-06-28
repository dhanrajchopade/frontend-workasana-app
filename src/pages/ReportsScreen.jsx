// Reports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [lastWeekTasks, setLastWeekTasks] = useState([]);
  const [pendingDays, setPendingDays] = useState(0);
  const [closedByTeam, setClosedByTeam] = useState([]);
  const [closedByOwner, setClosedByOwner] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const headers = { Authorization: token };

      const [lastWeekRes, pendingRes, closedRes] = await Promise.all([
  axios.get("https://carbon-taskmanager-backend.vercel.app/report/last-week", { headers }),
  axios.get("https://carbon-taskmanager-backend.vercel.app/report/pending", { headers }),
  axios.get("https://carbon-taskmanager-backend.vercel.app/report/closed-tasks", { headers }),
]);


        setLastWeekTasks(lastWeekRes.data);
        setPendingDays(pendingRes.data.totalPendingDays);

        // Process closed tasks for charts
        const teamMap = new Map();
        const ownerMap = new Map();

        for (let item of closedRes.data) {
          const team = item._id.team || "Unknown";
          const owner = item._id.owner || "Unknown";

          teamMap.set(team, (teamMap.get(team) || 0) + item.closedTasks);
          ownerMap.set(owner, (ownerMap.get(owner) || 0) + item.closedTasks);
        }

        setClosedByTeam(Array.from(teamMap.entries()));
        setClosedByOwner(Array.from(ownerMap.entries()));
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, [token]);

  const lastWeekChart = {
    labels: lastWeekTasks.map((_, i) => `Task ${i + 1}`),
    datasets: [
      {
        label: "Completed Tasks",
        data: lastWeekTasks.map(() => 1),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const pendingDaysChart = {
    labels: ["Pending Work (in days)", "Remaining"],
    datasets: [
      {
        data: [pendingDays, 100 - pendingDays],
        backgroundColor: ["#ffcd56", "#e0e0e0"],
      },
    ],
  };

  const teamChart = {
    labels: closedByTeam.map(([team]) => team),
    datasets: [
      {
        label: "Tasks Closed",
        data: closedByTeam.map(([_, count]) => count),
        backgroundColor: "#36a2eb",
      },
    ],
  };

  const ownerChart = {
    labels: closedByOwner.map(([owner]) => owner),
    datasets: [
      {
        label: "Tasks Closed",
        data: closedByOwner.map(([_, count]) => count),
        backgroundColor: "#9966ff",
      },
    ],
  };

  return (
    <>
    <div className="py-6 container">
      <h1 className="text-2xl font-bold mb-4">Workasana Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 row">
        <div className=" col-md-6">
          <h2 className="text-lg font-semibold">Total Work Done Last Week</h2>
          <Bar data={lastWeekChart} />
        </div>
        <div className=" col-md-6">
          <h2 className="text-lg font-semibold">Total Days of Work Pending</h2>
          <Pie data={pendingDaysChart} />
        </div>
          <div className=" col-md-6">
          <h2 className="text-lg font-semibold">Tasks Closed by Team</h2>
          <Bar data={teamChart} />
        </div>
         <div className=" col-md-6">
          <h2 className="text-lg font-semibold">Tasks Closed by Owner</h2>
          <Bar data={ownerChart} />
        </div>
      </div>
    </div>
    </>
  );
};

export default Reports;