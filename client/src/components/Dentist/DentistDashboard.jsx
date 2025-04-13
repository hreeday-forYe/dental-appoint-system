import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  Clock,
  Activity,
  Bell,
  Calendar,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetDentistAppointmentsQuery } from "@/app/slices/appointmentApiSlice";
import { useGetPatientsDataQuery } from "@/app/slices/dentistApiSlice";
import { useSelector } from "react-redux";
import { useMemo } from "react";

// // Mock data
// const mockAppointments = [
//   {
//     id: 1,
//     patientName: "John Doe",
//     date: "2024-03-27",
//     time: "09:00",
//     type: "Regular Checkup",
//     status: "confirmed",
//   },
//   {
//     id: 2,
//     patientName: "Jane Smith",
//     date: "2024-03-27",
//     time: "10:30",
//     type: "Root Canal",
//     status: "confirmed",
//   },
//   {
//     id: 3,
//     patientName: "Mike Johnson",
//     date: "2024-03-28",
//     time: "14:00",
//     type: "Cleaning",
//     status: "pending",
//   },
//   {
//     id: 4,
//     patientName: "Sarah Williams",
//     date: "2024-03-29",
//     time: "11:00",
//     type: "Consultation",
//     status: "confirmed",
//   },
//   {
//     id: 5,
//     patientName: "Robert Brown",
//     date: "2024-03-27",
//     time: "15:30",
//     type: "Filling",
//     status: "confirmed",
//   },
// ];

// StatsCard Component
function StatsCard({
  title,
  value,
  icon,
  description,
  className,
  iconClassName,
}) {
  return (
    <Card className={cn("transition-all hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", iconClassName)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="text-xs mt-1 opacity-70">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// AppointmentList Component
function AppointmentList({ appointments, title }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No appointments in {title}
                </p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between space-x-4 rounded-xl border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2">
                    <p className="font-semibold">{appointment.user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(appointment.date)} at {appointment.timeSlot}
                      </div>
                      <span className="text-muted-foreground/50">Reason:</span>
                      <span>{appointment.reasonForVisit}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Main App Component
function App() {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const { data, isLoading } = useGetDentistAppointmentsQuery();
  const { data: patientsData, isLoading: patientsLoading } = useGetPatientsDataQuery();
  const userData = useSelector((state) => state.auth.user);

  // Memoize the appointments array to prevent unnecessary recalculations
  const mockAppointments = useMemo(() => {
    return Array.isArray(data?.appointments) ? [...data.appointments].reverse() : [];
  }, [data?.appointments]);

  useEffect(() => {
    if (!mockAppointments.length) return;

    const today = new Date().toISOString().split("T")[0];

    const todaysAppts = mockAppointments.filter(
      (appointment) => appointment.date === today
    );

    const upcomingAppts = mockAppointments.filter(
      (appointment) => appointment.date > today
    );

    setTodayAppointments(todaysAppts);
    setUpcomingAppointments(upcomingAppts);
  }, [mockAppointments]); // Now depends on the memoized value

  // console.log(upcomingAppointments);

  return (
    <ScrollArea className="flex-1 h-[100vh]">
      <div className="flex-1 min-h-screen bg-background">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back, Dr. {userData?.name?.split(' ').pop() || ''}
              </h2>
              <p className="text-muted-foreground">
                Here's what's happening today
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Total Appointments"
              value={mockAppointments.length}
              icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
              description="All scheduled appointments"
              className="bg-blue-50 dark:bg-blue-950/50"
              iconClassName="bg-blue-100 dark:bg-blue-900"
            />
            <StatsCard
              title="Today's Appointments"
              value={todayAppointments?.length}
              icon={<Clock className="h-5 w-5 text-green-600" />}
              description="Appointments for today"
              className="bg-green-50 dark:bg-green-950/50"
              iconClassName="bg-green-100 dark:bg-green-900"
            />
            <StatsCard
              title="Active Patients"
              value={patientsData?.count}
              icon={<Users className="h-5 w-5 text-purple-600" />}
              description="Registered patients"
              className="bg-purple-50 dark:bg-purple-950/50"
              iconClassName="bg-purple-100 dark:bg-purple-900"
            />
            {/* <StatsCard
              title="Treatment Success Rate"
              value="98%"
              icon={<Activity className="h-5 w-5 text-orange-600" />}
              description="Based on patient feedback"
              className="bg-orange-50 dark:bg-orange-950/50"
              iconClassName="bg-orange-100 dark:bg-orange-900"
            /> */}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <AppointmentList
              title="Today's Schedule"
              appointments={todayAppointments}
            />
            <AppointmentList
              title="Upcoming Appointments"
              appointments={upcomingAppointments}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default App;
