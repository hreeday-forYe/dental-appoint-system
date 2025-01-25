import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import React from "react";
import { LogoutButton } from "../index";
import HeaderDropdown from "./HeaderDropdown";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSelector } from "react-redux";


export default function Component() {
  const location = useLocation();
  // const authStatus = false;
  const [headerBg, setHeaderBg] = React.useState("bg-transparent");
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHeaderBg("bg-white"); // Solid background after scrolling
      } else if (location.pathname === "/") {
        setHeaderBg("bg-transparent"); // Transparent only on home page
      } else {
        setHeaderBg("bg-white"); // Solid background for other pages
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set the background immediately on page load

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]); // Re-run when the path changes
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "About",
      slug: "/about",
      active: true,
    },
    {
      name: "Services",
      slug: "/services",
      active: !authStatus,
    },
    {
      name: "Find Doctors",
      slug: "/all-doctors",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "My appointments",
      slug: "/all-appointments",
      active: authStatus,
    },
  ];

  return (
    <header
      className={`flex top-0 z-20 left-0 h-20 w-full shrink-0 items-center px-4 transition-colors duration-300  md:px-6   ${
        headerBg === "bg-transparent"
          ? "absolute bg-transparent"
          : "sticky bg-white shadow-md"
      }`}
    >
      <NavLink to="/" className="mr-6 lg:flex">
        <MountainIcon className="lg:h-24 lg:w-24 h-14 w-14" />
        <span className="sr-only">Smile Sync</span>
      </NavLink>
      <Sheet>
        <DialogTitle className="sr-only">Navigation Menu</DialogTitle>{" "}
        {/* Add a visually hidden title */}
        <DialogDescription className="sr-only">
          Use the navigation menu to access different sections of the website.
        </DialogDescription>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden ml-auto">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <NavLink to="/" className="flex justify-center">
            <MountainIcon className="h-32 w-32" />
            <span className="sr-only">Smile Sync</span>
          </NavLink>
          <div className="grid gap-2 py-6">
            {navItems.map((item) =>
              item.active ? (
                <NavLink
                  key={item.name}
                  to={item.slug}
                  className="flex w-full hover:text-teal-700 justify-center py-2 text-lg font-semibold"
                >
                  {item.name}
                </NavLink>
              ) : null
            )}

            <Link
              to={authStatus ? "/book-appointment" : "/register"}
              className="mx-auto"
            >
              <Button className="bg-mainCustomColor hover:bg-teal-700 border">
                Book Appointment
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <nav className="ml-auto hidden lg:flex gap-6">
        {navItems.map((item) =>
          item.active ? (
            <NavLink
              key={item.name}
              to={item.slug}
              className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors hover:text-teal-700 focus:text-teal-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                headerBg === "bg-transparent"
                  ? "text-white"
                  : "sticky bg-white hover:bg-gray-50"
              }`}
            >
              {item.name}
            </NavLink>
          ) : null
        )}
        {authStatus && (
          <HeaderDropdown/>
        )}
        <div className="ml-10">
          <Link to={authStatus ? "book-appointment" : "register"}>
            <Button className="bg-mainCustomColor hover:bg-teal-700">
              Book Appointment
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
  return <img src={logo} alt="Logo" {...props} />;
}
