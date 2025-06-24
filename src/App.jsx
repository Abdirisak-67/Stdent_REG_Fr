import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StudentRegister from './pages/StudentRegister';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import Search from './pages/Search';
import StudentSearchDetails from './pages/StudentSearchDetails';
import CalledStudents from './pages/CalledStudents';
import CalledStudentDetails from './pages/CalledStudentDetails';
import AllStudents from './pages/AllStudents';

// Auth wrapper to check user existence
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));

  React.useEffect(() => {
    const handleStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Listen for manual logout (localStorage change) and navigation
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <Sidebar onLogout={handleLogout} />}
      <div className={isAuthenticated ? 'ml-56' : ''}>
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/student-register" element={<ProtectedRoute><StudentRegister /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/students/:id" element={<ProtectedRoute><StudentDetails /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/search/:id" element={<ProtectedRoute><StudentSearchDetails /></ProtectedRoute>} />
          <Route path="/called-students" element={<ProtectedRoute><CalledStudents /></ProtectedRoute>} />
          <Route path="/called-students/:id" element={<ProtectedRoute><CalledStudentDetails /></ProtectedRoute>} />
          <Route path="/all-students" element={<ProtectedRoute><AllStudents /></ProtectedRoute>} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  );
}

export default App;