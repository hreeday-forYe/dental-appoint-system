import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import heroImage from "../../assets/images/heroImage.jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HeroSectionSimpleCentred() {
  const userData = useSelector((state) =>state.auth.isAuthenticated)
  // alert(userData)
  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute bg-no-repeat inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`, // Replace with your image path
            filter: "brightness(0.3)", // Darkens the image for better contrast
          }}
        ></div>


        {/* Content */}
        <div className="relative z-[2] flex flex-col items-center justify-center h-full text-center text-white px-4">
          {/* Announcement Banner */}
          <div className="mb-4">
            <a
              className="inline-flex items-center gap-x-2 border text-sm p-1 ps-3 rounded-full transition bg-transparent text-white hover:bg-gray-200 hover:text-teal-700"
              href="#"
            >
              Join No.1 dental facility
              <span className="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-muted-foreground/15 font-semibold text-sm">
                <svg
                  className="flex-shrink-0 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </a>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Let&apos;s Uplift Your Smile Together
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Smile brighter with tailored dental solutions crafted for your
            comfort and confidence
          </p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <Link to={userData? "/new-appointment": "/register"}>
            <Button size={"lg"} className="bg-teal-500 hover:bg-teal-600">
              Book Now
            </Button>
            </Link>
            <Link to={'/about'}>
            <Button
              size={"lg"}
              variant={"outline"}
              className="transition-all duration-150 bg-transparent text-white hover:border-white"
              >
              Learn more
            </Button>
              </Link>
          </div>

          {/* Customer Reviews */}
          <div className="mt-5 flex justify-center items-center gap-x-1 sm:gap-x-3">
            <span className="text-sm">Customers Served:</span>
            <span className="text-sm font-bold text-teal-500">10000+</span>
            <svg
              className="h-5 w-5 text-muted-foreground"
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 13L10 3"
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
            <a
              className="inline-flex items-center gap-x-1 text-sm decoration-2 hover:underline font-medium hover:text-teal-500"
              href="#"
            >
              View Reviews
              <ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
