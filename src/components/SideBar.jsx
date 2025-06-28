import { Link } from "react-router-dom";
// If using Bootstrap Icons via npm, import the CSS
// import 'bootstrap-icons/font/bootstrap-icons.css';

const SideBar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '250px', height: '100vh' }}>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">Workasana</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link text-white">
            <i className="bi bi-speedometer2 me-2 "></i>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/project" className="nav-link text-white">
            <i className="bi bi-kanban me-2"></i>
            Project
          </Link>
        </li>
        <li>
          <Link to="/team" className="nav-link text-white">
            <i className="bi bi-people me-2"></i>
            Team
          </Link>
        </li>
        <li>
          <Link to="/report" className="nav-link text-white">
            <i className="bi bi-bar-chart-line me-2"></i>
            Report
          </Link>
        </li>
        <li>
          <Link to="/setting" className="nav-link text-white">
            <i className="bi bi-gear me-2"></i>
            Setting
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;