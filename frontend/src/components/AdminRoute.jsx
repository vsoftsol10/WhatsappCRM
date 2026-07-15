import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AccessDenied from '../pages/AccessDenied';

const AdminRoute = () => {
  const { user } = useAuthStore();

  return user && user.role === 'ADMIN' ? <Outlet /> : <AccessDenied />;
};

export default AdminRoute;
