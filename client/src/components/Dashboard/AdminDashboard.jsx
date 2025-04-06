import { useState } from "react";
import {
  Users,
  CalendarCheck,
  UserCog,
  TrendingUp,
  Clock,
  Calendar,
  ChevronRight,
  Activity,
  User as UserIcon,
  DollarSign,
  CreditCard,
  TrendingDown,
  BarChart3,
  IndianRupee,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";
import {
  useFetchAllAppointmentsQuery,
  useFetchAllUsersQuery,
  useFetchAllPaymentsQuery
} from "@/app/slices/adminApiSlice";
import { useGetAllDentistsQuery } from "@/app/slices/dentistApiSlice";

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today");

  // Get the users, dentist and appointments
  const { data: userData, isLoading } = useFetchAllUsersQuery();
  const { data: appointmentData } = useFetchAllAppointmentsQuery();
  const { data: dentistData } = useGetAllDentistsQuery();
  const {data: paymentData}= useFetchAllPaymentsQuery();
  const users = Array.isArray(userData?.users) ? userData.users : [];
  const recentUsers = [...users].reverse().slice(0, 4);
  const appointments = Array.isArray(appointmentData?.appointments) ? appointmentData.appointments : [];
  const recentAppointments = [...appointments].reverse().slice(0, 4);
  
  const payments = Array.isArray(paymentData?.payments) ? paymentData.payments : [];
  const recentPayments = [...payments].reverse().slice(0, 4);
  // Mock data - replace with actual API calls

  const stats = {
    totalUsers: users?.length,
    activeUsers: users?.length,
    totalDentists: dentistData?.dentists.length,
    pendingDentists: 0,
    totalAppointments: appointments.length,
    completedAppointments: 24,
    cancelledAppointments: 3,
    upcomingAppointments: 5,
  };

  const financialStats = {
    totalRevenue: recentPayments.reduce((sum, payment) => sum + payment.amount, 0),
    monthlyRevenue: 15000,
    weeklyRevenue: 3500,
    todayRevenue: 750,
    pendingPayments: 2500,
    averageAppointmentValue: 180,
    revenueGrowth: 12.5,
    totalRefunds: 500,
  };

  

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case 'Paid':
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-25px)] ">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">Welcome Admin</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening in your dental practice
                </p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            
            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <IndianRupee className="h-6 w-6 text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">
                        Rs.{financialStats.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600">
                        +{financialStats.revenueGrowth}%
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Users className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-sm text-muted-foreground">
                        ({stats.activeUsers} active)
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <UserCog className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dentists</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">
                        {stats.totalDentists}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ({stats.pendingDentists} pending)
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <CalendarCheck className="h-6 w-6 text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Appointments
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">
                        {stats.totalAppointments}
                      </p>
                      
                    </div>
                  </div>
                </div>
              </Card>

              {/* <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <Activity className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Appointment Status
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">
                        {stats.upcomingAppointments}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        upcoming ({stats.cancelledAppointments} cancelled)
                      </p>
                    </div>
                  </div>
                </div>
              </Card> */}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Payments */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Payments</h2>
                </div>
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{payment.paidBy.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Appointment Id: <strong className="text-green-800">{payment.appointment}</strong>
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(payment.createdAt).toLocaleDateString()}
                          <CreditCard className="h-4 w-4 ml-2" />
                          {payment.paymentMethod}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          Rs.{payment.amount}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Appointments */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Appointments</h2>
                  <Button variant="ghost" className="text-sm">
                    View All
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          with {appointment.dentist.user.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString()}
                          <Clock className="h-4 w-4 ml-2" />
                          {appointment.timeSlot}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {appointment.reasonForVisit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Users */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Users</h2>
                <Button variant="ghost" className="text-sm">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar.url}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Joined: {" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AdminDashboard;
