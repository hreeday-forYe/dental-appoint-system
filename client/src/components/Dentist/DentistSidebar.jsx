import { useState } from "react";
import {
  LayoutDashboard,
  PieChart,
  Settings,
  Wallet,
  Menu,
  CalendarClock,
  Stethoscope,
  Bell,
  Users,
  Wallet2Icon,
  User,
  Home,
  Calendar,
  ClipboardList,
  DollarSign,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "@/components/Header/LogoutButton";
import { useSelector } from "react-redux";

const DentistSidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dentist" },
    { icon: Users, label: "My Patients", path: "/dentist/patients" },
    { icon: Calendar, label: "Appointments", path: "/dentist/appointments" },
    { icon: User, label: "Profile", path: "/dentist/profile" },
  ];

  const userData  = useSelector((state) =>state.auth.user)

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        isSidebarCollapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isSidebarCollapsed && (
          <>
            <div className="p-1">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop"
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">
                    Dr. {userData.name}
                  </h3>
                  <p className="text-sm text-gray-500">Dentist</p>
                </div>
              </div>
            </div>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-2 px-2">
          {navigationItems.map((item) => (
            <Link to={item.path} key={item.label}>
              <Button
                variant={
                  location.pathname === item.href ? "secondary" : "ghost"
                }
                className={cn(
                  "w-full justify-start",
                  isSidebarCollapsed ? "px-3" : "px-4"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!isSidebarCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <LogoutButton
          className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </div>
  );
};

export default DentistSidebar;
