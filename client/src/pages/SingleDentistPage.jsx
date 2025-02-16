import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Award,
  Stethoscope,
  CreditCard,
  User,
  Mail,
  Building2,
  GraduationCap,
  Calendar as WorkingDaysIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components";
import { useGetSingleDentistQuery } from "@/app/slices/dentistApiSlice";
import { useParams } from "react-router-dom";

// Mock data
const mockDentist = {
  _id: "1",
  user: {
    _id: "u1",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "dentist",
    avatar: {
      public_id: "avatar1",
      url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop",
    },
  },
  specialization: "Orthodontist",
  experience: 8,
  nmcNumber: "NMC123456",
  qualifications: ["BDS", "MDS - Orthodontics"],
  consultingFee: 1500,
  slotDuration: 30,
  workingHours: {
    startTime: "09:00",
    endTime: "17:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  bio: "Specialized in providing comprehensive orthodontic care with 8+ years of experience in treating complex cases.",
};

export default function SingleDentistPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleDentistQuery(id);
  const mockDentist = data?.dentist;
  if (isLoading) {
    return <>Loading...</>;
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
                      mockDentist.user?.avatar?.url ||
                      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    }
                    alt={mockDentist.user.name}
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/10"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-primary">
                      {mockDentist.user.name}
                    </h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {mockDentist.specialization}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {mockDentist.user.email}
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
                        {mockDentist.nmcNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">
                        {mockDentist.experience} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Consulting Fee</p>
                      <p className="text-sm text-muted-foreground">
                        NPR {mockDentist.consultingFee}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                    <WorkingDaysIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Working Hours</p>
                      <p className="text-sm text-muted-foreground">
                        {mockDentist.workingHours.startTime} -{" "}
                        {mockDentist.workingHours.endTime}
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
                      {mockDentist.qualifications.map((qual, index) => (
                        <Badge key={index} variant="secondary">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Working Days</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockDentist.workingHours.days.map((day, index) => (
                        <Badge key={index} variant="outline">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">
                      {mockDentist.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <BookingForm mockDentist={mockDentist} />
        </div>
      </div>
    </div>
  );
}
