import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoginPage from './pages/LoginScreen';  
import Dashboard from './pages/DashboardScreen';
import ProjectManagementScreen from './pages/ProjectManagementScreen';
import TeamCards from './pages/TeamManagementScreen';
import Reports from './pages/ReportsScreen';
 
import SideBar from './components/SideBar';

// Layout wrapper for all pages except login
const Layout = ({ children }) => (
  <div className="d-flex">
    <SideBar />    
    <div className="flex-grow-1">{children}</div>
  </div>
);

function App() {
  return (
 


 


    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/project" element={<Layout><ProjectManagementScreen /></Layout>} />
        <Route path="/team" element={<Layout><TeamCards /></Layout>} />
        <Route path="/report" element={<Layout><Reports/></Layout>} />
        {/* <Route path="/setting" element={<Layout><Setting /></Layout>} /> */}
      </Routes>
    </Router>
          
 

  );
}

export default App;
