import { Calendar, Clock, Phone } from "lucide-react";
import featureImage from "../assets/images/features.jpg";
export default function FeaturesSection() {
  const features = [
    {
      title: "Easy Online Booking",
      description:
        "Schedule your dental appointments anytime, anywhere with our user-friendly online booking system.",
      icon: (
        <Calendar className="h-8 w-8 text-white transition-all duration-1000 animate-pulse" />
      ),
    },
    {
      title: "Instant Confirmations",
      description:
        "Receive immediate appointment confirmations and reminders via email or SMS.",
      icon: (
        <Clock className="h-8 w-8 text-white transition-all duration-1000 animate-spin" />
      ),
    },
    {
      title: "24/7 Support",
      description:
        "Get assistance round the clock with our dedicated customer support team for any queries or emergencies.",
      icon: (
        <Phone className="h-8 w-8 text-white transition-all duration-1000 animate-pulse" />
      ),
    },
  ];

  return (
    <section>
      <h2 className="text-center text-4xl font-bold text-black py-12">
        Our Features
      </h2>
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg bg-black relative overflow-hidden">
          <img
            alt="feature"
            className="object-cover object-center h-full w-full filter contrast-75"
            src={featureImage}
          />
          <div className="absolute inset-0 bg-black opacity-50">
          </div>
        </div>
        <div className="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
          
          {features &&
            features.map((item, index) => (
              <div className="flex flex-col mb-10 lg:items-start items-center" key={index}>
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-teal-500 mb-5">
                  {item.icon}
                </div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                    {item.title}
                  </h2>
                  <p className="leading-relaxed text-base">
                    {item.description}
                  </p>
                  <a className="mt-3 cursor-pointer text-teal-500 inline-flex items-center">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
