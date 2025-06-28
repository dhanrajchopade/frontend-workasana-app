import React, { useEffect, useState } from "react";
import useFetch from "../useFetch";
import TaskModalforProject from "../components/TaskModalforProject";

const ProjectManagementScreen = () => {
  const { data, loading: loadingProjects, error: errorProjects } = useFetch("https://carbon-taskmanager-backend.vercel.app/projects");
  const projects = data?.projects || [];
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [errorTasks, setErrorTasks] = useState(null);

  const [sortOption, setSortOption] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Set selected project once projects data loads
  useEffect(() => {
    if (projects.length > 0) setSelectedProject(projects[0]);
  }, [projects]);

  // Fetch tasks for selected project
  useEffect(() => {
    if (!selectedProject) return;
    const fetchTasks = async () => {
      setLoadingTasks(true);
      setErrorTasks(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://carbon-taskmanager-backend.vercel.app/tasks?project=${selectedProject._id}`,
          {
            headers: {
              Authorization:token,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setErrorTasks(err.message);
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  // Apply sorting & filtering
  useEffect(() => {
    let updated = [...tasks];
    if (ownerFilter) updated = updated.filter(task => task.owner === ownerFilter);
    if (tagFilter) updated = updated.filter(task => task.tags && task.tags.includes(tagFilter));
    switch (sortOption) {
      case "priorityLowHigh":
        updated.sort((a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority));
        break;
      case "priorityHighLow":
        updated.sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority));
        break;
      case "newestFirst":
        updated.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        break;
      case "oldestFirst":
        updated.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      default:
        break;
    }
    setFilteredTasks(updated);
  }, [tasks, sortOption, ownerFilter, tagFilter]);

  const getPriorityValue = (priority) => {
    if (!priority) return 0;
    switch (priority.toLowerCase()) {
      case "high": return 3;
      case "medium": return 2;
      case "low": return 1;
      default: return 0;
    }
  };

  const openAddTaskModal = () => setIsAddTaskOpen(true);
  const closeAddTaskModal = () => setIsAddTaskOpen(false);

  // After adding a task, refresh tasks list for selected project
  const onTaskAdded = async () => {
    if (selectedProject) {
      try {
        setLoadingTasks(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://carbon-taskmanager-backend.vercel.app/tasks?project=${selectedProject._id}`,
          {
            headers: {
              Authorization:token,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setErrorTasks(err.message);
        setTasks([]);
      } finally {
        setLoadingTasks(false);
        closeAddTaskModal();
      }
    }
  };

  const uniqueOwners = [...new Set(tasks.map(task => task.owner))];
  const uniqueTags = [...new Set(tasks.flatMap(task => task.tags || []))];

  return (
    <div className="container py-3">
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
        <button
          className="mb-4 text-blue-600 hover:underline text-left border px-4 py-2 rounded"
          onClick={() => window.location.href = "/dashboard"}
        >
          ← Back to Dashboard
        </button>
      </aside>
      <main className="flex-1 p-8">
        <div>
          <label className="mb-4 block">
            <span className="font-semibold">Select Project: </span>
            <select
              value={selectedProject?._id || ""}
              onChange={e => {
                const proj = projects.find(p => p._id === e.target.value);
                setSelectedProject(proj);
                setOwnerFilter("");
                setTagFilter("");
                setSortOption("");
              }}
              className="border rounded p-1 ml-2"
              disabled={loadingProjects || projects.length === 0}
            >
              {loadingProjects && <option>Loading...</option>}
              {!loadingProjects && projects.length > 0 ? (
                projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))
              ) : (
                !loadingProjects && <option>No projects found</option>
              )}
            </select>
          </label>
        </div>
        {loadingProjects ? (
          <p>Loading projects...</p>
        ) : errorProjects ? (
          <p className="text-red-600">Error loading projects: {errorProjects}</p>
        ) : selectedProject ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{selectedProject.name}</h1>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <div className="flex gap-2 items-center">
                <span className="font-semibold">Sort by:</span>
                <button onClick={() => setSortOption("priorityLowHigh")} className={`px-3 py-1 rounded hover:bg-gray-300 ${sortOption === "priorityLowHigh" ? "bg-gray-400" : "bg-gray-200"}`}>Priority Low-High</button>
                <button onClick={() => setSortOption("priorityHighLow")} className={`px-3 py-1 rounded hover:bg-gray-300 ${sortOption === "priorityHighLow" ? "bg-gray-400" : "bg-gray-200"}`}>Priority High-Low</button>
                <button onClick={() => setSortOption("newestFirst")} className={`px-3 py-1 rounded hover:bg-gray-300 ${sortOption === "newestFirst" ? "bg-gray-400" : "bg-gray-200"}`}>Newest First</button>
                <button onClick={() => setSortOption("oldestFirst")} className={`px-3 py-1 rounded hover:bg-gray-300 ${sortOption === "oldestFirst" ? "bg-gray-400" : "bg-gray-200"}`}>Oldest First</button>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-semibold">Filter:</span>
                <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} className="border px-2 py-1 rounded">
                  <option value="">By Owner</option>
                  {uniqueOwners.map(owner => (
                    <option key={owner} value={owner}>{owner}</option>
                  ))}
                </select>
                <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="border px-2 py-1 rounded">
                  <option value="">By Tag</option>
                  {uniqueTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
              <button onClick={openAddTaskModal} className="ml-auto px-4 py-1 bg-blue-600 text-white btn btn-primary rounded hover:bg-blue-700">
                + New Task
              </button>
            </div>
            {loadingTasks ? (
              <p>Loading tasks...</p>
            ) : errorTasks ? (
              <p className="text-red-600">Error loading tasks: {errorTasks}</p>
            ) : (
              <table className="w-full border-collapse bg-white shadow rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">TASKS</th>
                    <th className="p-2 border">OWNER</th>
                    <th className="p-2 border">PRIORITY</th>
                    <th className="p-2 border">DUE ON</th>
                    <th className="p-2 border">STATUS</th>
                    <th className="p-2 border"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4">No tasks found.</td>
                    </tr>
                  ) : (
                    filteredTasks.map(task => (
                      <tr key={task._id}>
                        <td className="p-2 border">{task.title || task.name}</td>
                        <td className="p-2 border">{task.owner}</td>
                        <td className="p-2 border">
                          <span className={`px-2 py-1 rounded text-xs font-semibold
                            ${task.priority === "High" ? "bg-red-100 text-red-700" :
                              task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-blue-100 text-blue-700"}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-2 border">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ""}</td>
                        <td className="p-2 border">
                          <span className={`px-2 py-1 rounded text-xs font-semibold
                            ${task.status === "Completed" ? "bg-green-100 text-green-700" :
                              task.status === "In Progress" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="p-2 border text-blue-600 cursor-pointer">→</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
            {isAddTaskOpen && selectedProject && (
              <TaskModalforProject
                project={selectedProject}
                onClose={closeAddTaskModal}
                onTaskAdded={onTaskAdded}
              />
            )}
          </>
        ) : (
          <p>No project selected</p>
        )}
      </main>
    </div>
    </div>
  );
};

export default ProjectManagementScreen;