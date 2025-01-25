import React from "react";
import { format, isBefore, isAfter } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    date: "2023-10-15T10:00:00",
    dentist: "Dr. Sarah Johnson",
    type: "Teeth Cleaning",
    status: "Upcoming",
    image: "https://source.unsplash.com/100x100/?portrait,dentist,1", // Random Unsplash image
  },
  {
    id: 2,
    date: "2023-09-20T14:30:00",
    dentist: "Dr. Michael Chen",
    type: "Root Canal",
    status: "Completed",
    image: "https://source.unsplash.com/100x100/?portrait,dentist,2", // Random Unsplash image
  },
  {
    id: 3,
    date: "2023-11-05T09:00:00",
    dentist: "Dr. Emily Williams",
    type: "Dental Checkup",
    status: "Upcoming",
    image: "https://source.unsplash.com/100x100/?portrait,dentist,3", // Random Unsplash image
  },
  {
    id: 4,
    date: "2023-08-10T11:00:00",
    dentist: "Dr. James Wilson",
    type: "Tooth Extraction",
    status: "Completed",
    image: "https://source.unsplash.com/100x100/?portrait,dentist,4", // Random Unsplash image
  },
];

// Helper function to categorize appointments
const categorizeAppointments = (appointments) => {
  const now = new Date();
  return appointments.reduce(
    (acc, appointment) => {
      const appointmentDate = new Date(appointment.date);
      if (isAfter(appointmentDate, now)) {
        acc.upcoming.push(appointment);
      } else {
        acc.past.push(appointment);
      }
      return acc;
    },
    { upcoming: [], past: [] }
  );
};

const MyAppointmentsPage = () => {
  const { upcoming, past } = categorizeAppointments(mockAppointments);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

        {/* Upcoming Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length > 0 ? (
              upcoming.map((appointment) => (
                <div key={appointment.id} className="mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Dentist Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={appointment.image} alt={appointment.dentist} />
                      <AvatarFallback>
                        {appointment.dentist.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Appointment Details */}
                    <div className="flex-1">
                      <p className="font-medium">
                        {format(new Date(appointment.date), "MMMM d, yyyy h:mm a")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.dentist} - {appointment.type}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <Badge variant="secondary">{appointment.status}</Badge>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Past Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {past.length > 0 ? (
              past.map((appointment) => (
                <div key={appointment.id} className="mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Dentist Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={appointment.image} alt={appointment.dentist} />
                      <AvatarFallback>
                        {appointment.dentist.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Appointment Details */}
                    <div className="flex-1">
                      <p className="font-medium">
                        {format(new Date(appointment.date), "MMMM d, yyyy h:mm a")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.dentist} - {appointment.type}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <Badge variant="outline">{appointment.status}</Badge>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No past appointments.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;