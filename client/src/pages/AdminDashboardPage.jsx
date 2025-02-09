import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Dashboard/Sidebar";
const AdminDashboardPage = () => {
  // console.log("Iam here in the admin dashboard page");
  return (
    <>
      <div className="flex min-h-screen bg-background">
        <div>
          <Sidebar />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default AdminDashboardPage;
