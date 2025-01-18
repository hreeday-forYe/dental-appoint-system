import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state?.auth?.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Redirect based on authentication status
      if (authentication && !authStatus) {
        navigate("/login"); // Redirect unauthenticated users
      } else if (!authentication && authStatus) {
        navigate("/"); // Redirect authenticated users from public pages
      }
      setLoading(false); // Loading completes after redirection check
    };

    checkAuth();
  }, [authStatus, navigate, authentication]);

  return loading ? <h1>Loading...</h1> : <>{children}</>;
}
