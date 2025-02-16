import { format } from "date-fns";
import { useGetUserAppointmentsQuery } from "@/app/slices/appointmentApiSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Stethoscope,
  User2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const AppointmentCard = ({ appointment }) => {
  const statusColors = {
    Pending:
      "bg-yellow-100 text-yellow-800 hover:text-yellow-800 hover:bg-yellow-100 text-sm",
    Confirmed:
      "bg-green-100 text-green-800 hover:text-green-800 hover:bg-green-100 text-sm",
    Completed:
      "bg-emerald-100 text-emerald-800 hover:text-emerald-800 hover:bg-emerald-100 text-sm",
    Cancelled:
      "bg-red-100 text-red-800 hover:text-cancelled-800 hover:bg-cancelled-100 text-sm",
  };

  const paymentStatusColors = {
    Pending: "bg-orange-100 text-orange-800",
    Completed: "bg-emerald-100 text-emerald-800",
    Failed: "bg-red-100 text-red-800",
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage
              src={
                appointment.dentist.user.avatar?.url ||
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              }
              alt={appointment.dentist.user.name}
            />
            <AvatarFallback>
              {appointment.dentist.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Dr. {appointment.dentist.user.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {appointment.dentist.specialization} •{" "}
                  {appointment.dentist.qualifications.join(", ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  className={`${statusColors[appointment.status]} hover:none`}
                >
                  {appointment.status}
                </Badge>
                {/* <Badge className={paymentStatusColors[appointment.paymentStatus]}>
                  {appointment.paymentStatus}
                </Badge> */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">
                  {format(new Date(appointment.date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {appointment.timeSlot} ({appointment.duration} mins)
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span className="text-md text-green-800">
                  Rs. {appointment.fees} • {appointment.paymentMethod}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Stethoscope className="h-4 w-4" />
                <span
                  className="text-sm line-clamp-1"
                  title={appointment.reasonForVisit}
                >
                  {appointment.reasonForVisit}
                </span>
              </div>
            </div>
            {appointment.paymentStatus === "Pending" && (
              <button
                // onClick={}
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MyAppointmentsPage = () => {
  const { data, isLoading } = useGetUserAppointmentsQuery();
  console.log(data);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading appointments...</div>
      </div>
    );
  }

  const appointments = data?.appointments || [];
  const upcoming = appointments.filter(
    (apt) => new Date(apt.date) >= new Date()
  );
  const past = appointments.filter((apt) => new Date(apt.date) < new Date());

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <User2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="upcoming" className="text-base">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="text-base">
              Past ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <ScrollArea className="h-[calc(100vh-250px)] pr-4">
              {upcoming.length > 0 ? (
                upcoming.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Schedule your next visit with one of our dentists.
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="past">
            <ScrollArea className="h-[calc(100vh-250px)] pr-4">
              {past.length > 0 ? (
                past.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No past appointments
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Your appointment history will appear here.
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
