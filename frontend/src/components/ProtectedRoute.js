import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on actual role
        if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
        return <Navigate to="/patient" replace />;
    }

    return children;
};

export default ProtectedRoute;
