import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
    </div>
  );
};

export default AuthLayout;