import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Dashboard/Sidebar";

const AdminDashboardPage = () => {
  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default AdminDashboardPage;
