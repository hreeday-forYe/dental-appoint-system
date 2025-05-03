import React from "react";
import {
  Award,
  Stethoscope,
  CreditCard,
  Building2,
  Mail,
  GraduationCap,
  Calendar as WorkingDaysIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components";
import { useGetSingleDentistQuery } from "@/app/slices/dentistApiSlice";
import { useParams } from "react-router-dom";

export default function SingleDentistPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetSingleDentistQuery(id);
  const dentist = data?.dentist;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Loading dentist information...</p>
      </div>
    );
  }

  // Handle error state
  if (error || !dentist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-700">
            We couldn't load the dentist information. Please try again later.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {error
              ? `Error: ${error.message || "Unknown error"}`
              : "Dentist not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dentist Information */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={
                      dentist?.user?.avatar?.url ||
                      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    }
                    alt={dentist?.user?.name || "Dentist"}
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/10"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-primary">
                      {dentist?.user?.name || "Dentist Name"}
                    </h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {dentist?.specialization ||
                          "Specialization not specified"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {dentist?.user?.email || "Email not available"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">NMC Number</p>
                      <p className="text-sm text-muted-foreground">
                        {dentist?.nmcNumber || "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">
                        {dentist?.experience
                          ? `${dentist.experience} years`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Consulting Fee</p>
                      <p className="text-sm text-muted-foreground">
                        {dentist?.consultingFee
                          ? `NPR ${dentist.consultingFee}`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                    <WorkingDaysIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Working Hours</p>
                      <p className="text-sm text-muted-foreground">
                        {dentist?.workingHours?.startTime &&
                        dentist?.workingHours?.endTime
                          ? `${dentist.workingHours.startTime} - ${dentist.workingHours.endTime}`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Qualifications & Experience</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Qualifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {dentist?.qualifications?.length > 0 ? (
                        dentist.qualifications.map((qual, index) => (
                          <Badge key={index} variant="secondary">
                            {qual}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No qualifications listed
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Working Days</h3>
                    <div className="flex flex-wrap gap-2">
                      {dentist?.workingHours?.days?.length > 0 ? (
                        dentist.workingHours.days.map((day, index) => (
                          <Badge key={index} variant="outline">
                            {day}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No working days specified
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">
                      {dentist?.bio || "No bio information available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          {dentist && <BookingForm mockDentist={dentist} />}
        </div>
      </div>
    </div>
  );
}
