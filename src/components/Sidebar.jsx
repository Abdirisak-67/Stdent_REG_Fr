import React from 'react';
import { FaUserGraduate, FaUserPlus, FaSearch, FaChartBar, FaSignOutAlt, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import alImraLogo from '../assets/Al\'imra.jpeg';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };
  return (
    <div className="fixed top-0 left-0 h-full w-56 bg-[#004583] shadow-lg flex flex-col py-8 px-4 z-20">
      <img src={alImraLogo} alt="Al'imra Logo" className="w-20 h-20 mx-auto mb-4 rounded-full object-cover" />
      <h2 className="text-xl font-bold mb-8 text-white text-center">Student Reg</h2>
      <nav className="flex-1">
        <ul className="space-y-4">
          <li><Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-blue-200"><FaChartBar /> Dashboard</Link></li>
          <li><Link to="/student-register" className="flex items-center gap-2 text-white hover:text-blue-200"><FaUserPlus /> Register Student</Link></li>
          <li><Link to="/students" className="flex items-center gap-2 text-white hover:text-blue-200"><FaUserGraduate /> Students</Link></li>
          <li><Link to="/called-students" className="flex items-center gap-2 text-white hover:text-blue-200"><FaCheckCircle /> Called Students</Link></li>
          <li><Link to="/search" className="flex items-center gap-2 text-white hover:text-blue-200"><FaSearch /> Search</Link></li>
        </ul>
      </nav>
      <button onClick={handleLogout} className="flex items-center gap-2 text-red-200 mt-8 hover:text-white"><FaSignOutAlt /> Logout</button>
    </div>
  );
};

export default Sidebar;
