import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../app/slices/userApiSlice";
import { logout as logoutStore } from "../../app/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {LogOut} from 'lucide-react';

const LogoutButton = ({className=""}, isSidebarCollapsed=false) => {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutStore());
      navigate("/");
      toast.success("Logout successfull");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading} // Disable the button if isSidebarCollapsed is true
      className={`${className}`}
    >
      
      <LogOut/> {isLoading ? "Logging Out..." : "logout"}
    </Button>
  );
};

export default LogoutButton;
