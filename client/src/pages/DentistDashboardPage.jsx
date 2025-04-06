import React from "react";
import { Outlet } from "react-router-dom";
import DentistSidebar from "@/components/Dentist/DentistSidebar";

const DentistDashboardPage = () => {
  return (
    <>
      <div className="flex min-h-screen bg-background">
        <DentistSidebar />
        <Outlet />
      </div>
    </>
  );
};

export default DentistDashboardPage;
