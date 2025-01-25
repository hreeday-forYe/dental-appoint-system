import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import logo from "../../assets/logo.png";
export default function Footer() {
  return (
    <footer className="w-full border-t shadow-sm">
      <div className="container px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-20 w-20">
              {/* Replace with your actual logo */}
              {/* <div className="h-full w-full rounded-full bg-primary" /> */}
              <img src={logo} alt="smile sync logo" className="h-full w-full" />
            </div>
            <span className="text-xl font-bold">Smile Sync</span>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm md:gap-6">
            <Link
              className="hover:text-mainCustomColor transition-colors"
              to="/"
            >
              Home
            </Link>
            <Link
              className="hover:text-mainCustomColor  transition-colors"
              to="/services"
            >
              Service
            </Link>
            <Link
              className="hover:text-mainCustomColor  transition-colors"
              to="/blogs"
            >
              Blogs
            </Link>
            <Link
              className="hover:text-mainCustomColor transition-colors"
              to="/about"
            >
              About
            </Link>
            <Link
              className="hover:text-mainCustomColor transition-colors"
              to="/all-doctors"
            >
              Doctors
            </Link>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            All rights reserved © smilesync.com |{" "}
            <Link
              to="/terms"
              className="hover:text-mainCustomColor transition-colors"
            >
              Terms and conditions apply!
            </Link>
          </p>

          <div className="flex gap-4">
            <Link
              to="#"
              className="hover:text-mainCustomColor  transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              to="#"
              className="hover:text-mainCustomColor hover:shadow-md transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              to="#"
              className="hover:text-mainCustomColor hover:shadow-md transition-colors"
            >
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YoutubeIcon</span>
            </Link>
            <Link
              to="#"
              className="hover:text-mainCustomColor hover:shadow-md transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              to="#"
              className="hover:text-mainCustomColor hover:shadow-md transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
