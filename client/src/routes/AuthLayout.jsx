import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state?.auth?.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const sp = new URLSearchParams(location.search);
  // const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    const checkAuth = () => {
      // Redirect based on authentication status
      if (authentication && !authStatus) {
        navigate(`/login`); // Redirect unauthenticated users
      } else if (!authentication && authStatus) {
        navigate("/"); // Redirect authenticated users from public pages
      }
      setLoading(false); // Loading completes after redirection check
    };

    checkAuth();
  }, [authStatus, navigate, authentication]);

  return loading ? <h1>Loading...</h1> : <>{children}</>;
}
