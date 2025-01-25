import {
  Bluetooth as Tooth,
  Smile,
  Syringe,
  Timer,
  Shield,
  Sparkles,
} from "lucide-react";
import { FAQ, Contact } from "@/components";
import React from "react";
function ServiceCard({ icon: Icon, title, description, className = "" }) {
  return (
    <div
      className={`bg-white opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-teal-500/50 transition-all duration-300 flex flex-col items-center text-center ${className}`}
    >
      <div className="bg-blue-100 p-4 rounded-full mb-6">
        <Icon className="w-8 h-8 text-teal-500" />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <button className="mt-auto text-teal-500 hover:text-teal-700 font-medium flex items-center gap-2 group">
        Learn More
        <span className="group-hover:translate-x-1 transition-transform duration-200">
          →
        </span>
      </button>
    </div>
  );
}

function App() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: Tooth,
      title: "Root Canal Treatment",
      description:
        "Root canal treatment (endodontics) is a dental procedure used to treat infection at the centre of a tooth.",
    },
    {
      icon: Smile,
      title: "Cosmetic Dentist",
      description:
        "Cosmetic dentistry is the branch of dentistry that focuses on improving the appearance of your smile.",
    },
    {
      icon: Syringe,
      title: "Dental Implants",
      description:
        "A dental implant is an artificial tooth root that's placed into your jaw to hold a prosthetic tooth or bridge.",
    },
    {
      icon: Sparkles,
      title: "Teeth Whitening",
      description:
        "It's never been easier to brighten your smile at home. There are all kinds of products you can try.",
    },
    {
      icon: Timer,
      title: "Emergency Dentistry",
      description:
        "In general, any dental problem that needs immediate treatment to stop bleeding, alleviate severe pain.",
    },
    {
      icon: Shield,
      title: "Prevention",
      description:
        "Preventive dentistry is dental care that helps maintain good oral health. It's a combination of regular dental.",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Services Section with Background */}
      <div className="relative">
        {/* Background Image and Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=3174&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* Services Content */}
        <div className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Services</h2>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                We use only the best quality materials on the market in order to
                provide the best products to our patients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  className={
                    index === services.length - 1
                      ? "md:col-span-2 lg:col-span-1"
                      : ""
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION - Outside the Background Wrapper */}
      <div className=" px-4 sm:px-6 lg:px-8">
        <FAQ />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <Contact />
      </div>
    </div>
  );
}

export default App;
