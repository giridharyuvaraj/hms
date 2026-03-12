import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import HomePage from './pages/HomePage.js';
import PatientDashboard from './pages/PatientDashboard.js';
import DoctorDashboard from './pages/DoctorDashboard.js';
import AdminDashboard from './pages/AdminDashboard.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-logo">
                <span className="logo">🏥</span>
                <span className="logo-text gradient-text">SmartHMS</span>
            </NavLink>

            <div className="nav-center">
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    Home
                </NavLink>
                <NavLink to="/doctor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Doctor
                </NavLink>
                {/* Portals requested by user */}
                <NavLink to="/patient" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Patient
                </NavLink>
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Admin
                </NavLink>
            </div>

            <div className="nav-right">
                {user ? (
                    <div className="nav-user">
                        <div className="nav-user-info">
                            <span className="nav-user-avatar">
                                {user.role === 'ADMIN' ? '👨‍💼' : user.role === 'DOCTOR' ? '👨‍⚕️' : '🧑'}
                            </span>
                            <div className="nav-user-details">
                                <span className="nav-user-name">{user.name}</span>
                                <span className="nav-user-role">{user.role}</span>
                            </div>
                        </div>
                        <button className="btn-hero-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="nav-right">
                        <NavLink to="/login" className="nav-link">
                            Login
                        </NavLink>
                        <NavLink to="/signup" className="btn-hero-primary" style={{ padding: '0.6rem 1.5rem', textDecoration: 'none' }}>
                            Sign Up
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/patient"
                            element={
                                <ProtectedRoute allowedRoles={['PATIENT']}>
                                    <PatientDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/doctor"
                            element={
                                <ProtectedRoute allowedRoles={['DOCTOR']}>
                                    <DoctorDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
}

export default App;
