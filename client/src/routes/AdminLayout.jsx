import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLayout = ({ children }) => {
  const userInfo = useSelector((state) => state?.auth?.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAdmin = () => {
      if (!userInfo) {
        // If userInfo is not available, redirect to login
        console.log("User not logged in, redirecting to login...");
        navigate("/login");
        toast.error("Please log in to access this page");
        return;
      }

      // If userInfo is available, check the role
      if (userInfo?.role !== "admin") {
        console.log("User is not an admin, redirecting to home...");
        navigate("/");
        toast.error("You are not authorized to access this page");
        return;
      }

      // If user is an admin, allow access
      setLoading(false);
    };
    checkAdmin();
  }, [userInfo, navigate]);

  if (loading) {
    return <h1>Loading...</h1>; // Show loading while checking user data
  }

  return <>{children}</>;
};

export default AdminLayout;
