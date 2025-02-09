import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

function CallToActionDentist() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Join Our Network of Elite Dental Professionals
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
          Transform smiles and build your career with the most advanced dental
          practices. We're looking for passionate dentists to join our growing
          team.
        </p>
        <Link to={'/register-as-dentist'}>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 transition-colors px-8 py-6 text-lg group"
          >
            <Stethoscope className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Apply as Dentist
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CallToActionDentist;
