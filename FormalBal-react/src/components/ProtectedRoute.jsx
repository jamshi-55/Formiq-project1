
import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user || user.role !== 'admin') {
    toast.error(' Only admin access required');
    return <Navigate to="/user"/>;
  }
  if (user.isBlocked) {
    toast.error(' Your account is blocked');
    return <Navigate to="/user"/>;
  }
  return children;
};

export default ProtectedRoute;