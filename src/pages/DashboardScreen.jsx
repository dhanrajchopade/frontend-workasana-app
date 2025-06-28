import React, { useState, useEffect } from "react";
import ProjectModal from "../components/ProjectModal";
import TaskModal from "../components/TaskModal";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");
  const [taskFilter, setTaskFilter] = useState("All");

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://carbon-taskmanager-backend.vercel.app/projects", {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Project API error: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://carbon-taskmanager-backend.vercel.app/tasks", {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Task API error: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // Helper to get a project's status (latest task's status, or "No tasks")
  const getProjectStatus = (project) => {
    const projectTasks = tasks.filter(task => task.project === project._id);
    if (projectTasks.length === 0) return "No tasks";
    return projectTasks[projectTasks.length - 1].status;
  };

  // Filter projects by status of their tasks
  const filterProjectsByStatus = (projects, status) => {
    if (status === "All") return projects;
    return projects.filter(project => getProjectStatus(project) === status);
  };

  // Filter tasks by their own status
  const filterByStatus = (items, status) => {
    return status === "All" ? items : items.filter((item) => item.status === status);
  };

  const filteredProjects = filterProjectsByStatus(projects, projectFilter);

  return (
    <div className="container py-4">
      {/* Projects Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Projects</h2>
        <div>
          <select
            className="form-select d-inline w-auto me-2"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowProjectModal(true)}>
            + New Project
          </button>
        </div>
      </div>

      <div className="row mb-5">
        {Array.isArray(filteredProjects) &&
          filteredProjects.map((project) => (
            <div key={project._id} className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <ul className="list-unstyled mb-0">
                    {tasks
                      .filter(task => task.project === project._id)
                      .map(task => (
                        <li key={task._id}>
                          <span
                            className={`badge bg-${
                              task.status === "Completed"
                                ? "success"
                                : task.status === "In Progress"
                                ? "warning"
                                : "secondary"
                            }`}
                          >
                            {task.status}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Tasks Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Tasks</h2>
        <div>
          <select
            className="form-select d-inline w-auto me-2"
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            + New Task
          </button>
        </div>
      </div>

      <div className="row">
        {Array.isArray(tasks) &&
          filterByStatus(tasks, taskFilter).map((task) => (
            <div key={task._id} className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{task.name}</h5>
                  <p className="card-text">
                    <strong>Due on:</strong>{" "}
                    {task.createdAt && task.timeToComplete !== undefined
                      ? new Date(
                          new Date(task.createdAt).getTime() +
                            task.timeToComplete * 24 * 60 * 60 * 1000
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <span
                    className={`badge bg-${
                      task.status === "Completed"
                        ? "success"
                        : task.status === "In Progress"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modals */}
      <ProjectModal
        show={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          fetchProjects();
        }}
      />
      <TaskModal
        show={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          fetchTasks();
        }}
        projects={projects}
        teams={[]}
      />
    </div>
  );
};

export default Dashboard