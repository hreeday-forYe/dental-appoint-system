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
  Users
} from "lucide-react";
import logo from '../../assets/logo.png'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "@/components/Header/LogoutButton";

const Sidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin",
    },
    { icon: Users, label: "Users", href: "/admin/all-users" },
    { icon: CalendarClock, label: "Appointments", href: "/admin/all-appointments" },
    { icon: Stethoscope, label: "Dentists", href: "/admin/all-dentists" },
    { icon: Bell , label: "Notifications", href: "/admin/all-notifications" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

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
            <MountainIcon className="h-16 w-16" />
          <span className="text-lg font-semibold">Smile Sync</span>
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
            <Link to={item.href} key={item.label}>
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
        <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </div>
  );
};

export default Sidebar;


function MountainIcon(props) {
  return <img src={logo} alt="Logo" {...props} />;
}