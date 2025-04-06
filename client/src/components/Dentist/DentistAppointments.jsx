import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Calendar as CalendarIcon,
  Clock3,
  Mail,
  MessageSquare,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useFetchDentistAppointmentsQuery } from "@/app/slices/dentistApiSlice";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import {
  useCancelAppointmentMutation,
  useChangeAppointmentStatusMutation,
} from "@/app/slices/appointmentApiSlice";

function DentistAppointments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");

  // TODO: Replace with your actual API hook
  const { data, isLoading, refetch } = useFetchDentistAppointmentsQuery();
  const appointments = Array.isArray(data?.appointments)
    ? data.appointments
    : [];
  const recentPayments = [...appointments].reverse().slice(0, 4);
  const [changeAppointment, { isLoading: changeLoading }] =
    useChangeAppointmentStatusMutation();

  const onConfirm = async (id) => {
    try {
      const response = await changeAppointment(id).unwrap();
      if (response.success) {
        toast.success("Appointment Confirmed");
        refetch();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [cancelAppointment] = useCancelAppointmentMutation();

  const onReject = async (id) => {
    try {
      const response = await cancelAppointment({
        appointmentId: id,
        reason: "Dentist cancelled the appointment",
      }).unwrap();
      if (response.success) {
        toast.success({
          title: "Appointment Cancelled",
          description: "Your appointment has been successfully cancelled.",
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filterAppointments = (status) => {
    return appointments.filter((appointment) => appointment.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[100vh] flex-1">
      <div className="min-h-screen bg-gray-50">
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    My Appointments
                  </h1>
                  <p className="text-gray-500 mt-2">
                    Manage and track your patient appointments
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search appointments..."
                    className="pl-10 w-full md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-blue-600 font-semibold">
                    Booked Appointments
                  </h3>
                  <p className="text-2xl font-bold">
                    {filterAppointments("Pending").length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-green-600 font-semibold">Confirmed</h3>
                  <p className="text-2xl font-bold">
                    {filterAppointments("Confirmed").length}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-red-600 font-semibold">Cancelled</h3>
                  <p className="text-2xl font-bold">
                    {filterAppointments("Cancelled").length}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointments Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Tabs defaultValue="upcoming" className="space-y-6">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex-1 sm:flex-none">
                    Past
                  </TabsTrigger>
                  <TabsTrigger
                    value="cancelled"
                    className="flex-1 sm:flex-none"
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                    {appointments
                      .filter(
                        (appointment) =>
                          new Date(appointment.date) >= new Date() &&
                          appointment.status !== "Cancelled"
                      )
                      .map((appointment) => (
                        <AppointmentCard
                          onConfirm={onConfirm}
                          onReject={onReject}
                          key={appointment._id}
                          appointment={appointment}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="past">
                  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {appointments
                      .filter(
                        (appointment) =>
                          new Date(appointment.date) < new Date() &&
                          appointment.status !== "Cancelled"
                      )
                      .map((appointment) => (
                        <AppointmentCard
                          onConfirm={onConfirm}
                          onReject={onReject}
                          key={appointment._id}
                          appointment={appointment}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="cancelled">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {appointments
                      .filter(
                        (appointment) => appointment.status === "Cancelled"
                      )
                      .map((appointment) => (
                        <AppointmentCard
                          onConfirm={onConfirm}
                          onReject={onReject}
                          key={appointment._id}
                          appointment={appointment}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

// Appointment Card Component
function AppointmentCard({
  appointment,
  onConfirm,
  changeLoading,
  onReject,
  rejectLoading,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-teal-100 text-teal-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const statusVariants = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Confirmed: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Completed: "bg-blue-100 text-blue-800 border-blue-200",
  };
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Patient Information Section */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={appointment.user?.avatar?.url}
                alt={appointment.user.name}
              />
              <AvatarFallback>
                {appointment.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Badge
              variant="outline"
              className={`${statusVariants[appointment.status]} px-3 py-1`}
            >
              {appointment.status}
            </Badge>
          </div>

          {/* Appointment Details Section */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.user.name}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {appointment.user.email}
                  </div>
                  {appointment.user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {appointment.user.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {formatDate(new Date(appointment.date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {appointment.timeSlot} ({appointment.duration} mins)
                </span>
              </div>
            </div>

            {appointment.cancellationReason ? (
              <div className="flex items-start gap-2 bg-red-100/50 rounded-lg p-3">
                <MessageSquare className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium">Cancellation Reason</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {appointment.cancellationReason}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                <MessageSquare className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium">Reason for Visit</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {appointment.reasonForVisit}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {/* <Pill className="h-4 w-4 text-primary" /> */}
            <span className="text-sm font-medium">Appointment ID: </span>
            <code className="text-sm text-muted-foreground">
              {appointment._id}
            </code>
          </div>
          <div className="flex gap-3">
            {appointment.status === "Pending" && (
              <>
                <Button
                  variant="destructive"
                  className="gap-2"
                  disabled={rejectLoading}
                  onClick={() => onReject(appointment._id)}
                >
                  <XCircle className="h-4 w-4" />
                  {rejectLoading ? "Rejecting.." : "Reject"}
                </Button>
                <Button
                  className="gap-2 bg-green-400 hover:bg-green-500"
                  onClick={() => onConfirm(appointment._id)}
                  disabled={changeLoading}
                >
                  <CheckCircle className="h-4 w-4" />
                  {changeLoading ? "Confirming..." : "Confirm"}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default DentistAppointments;
