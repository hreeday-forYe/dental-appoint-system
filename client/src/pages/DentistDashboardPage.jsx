// import React from 'react'

// const DentistDashboardPage = () => {
//   return (
//     <div>DentistDashboardPage</div>
//   )
// }

// export default DentistDashboardPage

import React from "react";
import { LogoutButton } from "@/components";
import {
  Eye,
  Stethoscope,
  Users,
  DollarSign,
  Calendar,
  UserCog,
  Building2,
  BedDouble,
  UserCheck,
  Syringe,
  User,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";
// import DashboardStats from '../components/DashboardStats';
// import MetricCard from '../components/MetricCard';

// import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ClipboardList,
  HeartPulse,
  Bluetooth as Tooth,
  PhoneCall,
  MessageSquare,
  Clock,
  Pill,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetDentistAppointmentsQuery } from "@/app/slices/appointmentApiSlice";
// import React from 'react';
// import { Eye, Syringe, UserCheck } from 'lucide-react';

// interface StatCardProps {
//   icon: React.ReactNode;
//   count: number;
//   label: string;
//   color: string;
// }

const StatCard = ({ icon, count, label, color }) => (
  <div className={`${color} p-4 rounded-lg flex items-center gap-4`}>
    <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
    <div>
      <h3 className="text-2xl font-bold text-white">{count}</h3>
      <p className="text-white/90">{label}</p>
    </div>
  </div>
);

function DashboardStats() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <StatCard
        icon={<Eye className="w-6 h-6 text-white" />}
        count={9}
        label="Patients Today"
        color="bg-cyan-500"
      />
      <StatCard
        icon={<Syringe className="w-6 h-6 text-white" />}
        count={3}
        label="Surgeries"
        color="bg-green-500"
      />
      <StatCard
        icon={<UserCheck className="w-6 h-6 text-white" />}
        count={2}
        label="Discharges"
        color="bg-orange-500"
      />
    </div>
  );
}

function Sidebar({ userRole = "admin", userName, userTitle }) {
  const location = useLocation();

  const menuItems = {
    admin: [
      { icon: Home, label: "Hospital Dashboard", path: "/admin" },
      { icon: HeartPulse, label: "Medical Dashboard", path: "/admin/medical" },
      { icon: Tooth, label: "Dentist Dashboard", path: "/admin/dental" },
      { icon: Users, label: "Doctors", path: "/admin/doctors" },
      { icon: Users, label: "Patients", path: "/admin/patients" },
      { icon: UserCog, label: "Staff", path: "/admin/staff" },
      { icon: Calendar, label: "Appointments", path: "/admin/appointments" },
      { icon: Building2, label: "Departments", path: "/admin/departments" },
      { icon: DollarSign, label: "Accounts", path: "/admin/accounts" },
    ],
    dentist: [
      { icon: Home, label: "Dashboard", path: "/dentist" },
      { icon: Users, label: "My Patients", path: "/dentist/patients" },
      { icon: Calendar, label: "Appointments", path: "/dentist/appointments" },
      {
        icon: ClipboardList,
        label: "Treatment Plans",
        path: "/dentist/treatments",
      },
      { icon: DollarSign, label: "Billing", path: "/dentist/billing" },
      { icon: User, label: "Profile", path: "/profile" },
    ],
  };

  const currentMenuItems =
    menuItems[userRole === "admin" ? "admin" : "dentist"];

  return (
    <div className="min-h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop"
            alt={userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{userName}</h3>
            <p className="text-sm text-gray-500">{userTitle}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {currentMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 p-4 rounded-lg">
          {/* <h4 className="font-semibold text-blue-800 flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            Emergency Contact
          </h4>
          <p className="text-blue-600 text-lg font-bold mt-1">1-800-DENTIST</p> */}
          <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
        </div>
      </div>
    </div>
  );
}
import { useChangeAppointmentStatusMutation } from "@/app/slices/appointmentApiSlice";
import { toast } from "react-toastify";
function AppointmentCard({ appointment, onConfirm }) {
  const statusVariants = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Confirmed: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Completed: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Patient Information Section */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
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
              {/* <HoverCard>
                <HoverCardTrigger>
                  <Badge variant="secondary" className="ml-2">
                    ${appointment.fees}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit">
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Payment Method: {appointment.paymentMethod}</p>
                    <p>Status: {appointment.paymentStatus}</p>
                  </div>
                </HoverCardContent>
              </HoverCard> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {format(new Date(appointment.date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {appointment.timeSlot} ({appointment.duration} mins)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
              <MessageSquare className="h-4 w-4 text-primary mt-1" />
              <div>
                <p className="text-sm font-medium">Reason for Visit</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {appointment.reasonForVisit}
                </p>
              </div>
            </div>
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
                  // onClick={() => onReject(appointment._id)}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="gap-2 bg-green-400 hover:bg-green-500"
                  onClick={() => onConfirm(appointment._id)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm
                </Button>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function DentistDashboardPage() {
  const { data, refetch } = useGetDentistAppointmentsQuery();
  const appointments = data?.appointments;
  const [changeAppointment, { isLoading }] =
    useChangeAppointmentStatusMutation();

  // #TODO: COMPLETE THIS
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
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        userRole="dentist"
        userName="Dr. Patrick Kim"
        userTitle="Senior Dentist"
      />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Good Morning,
                </h1>
                <h2 className="text-3xl font-bold text-blue-600">
                  Dr. Patrick Kim
                </h2>
                <p className="text-gray-600 mt-1">Your schedule today.</p>
              </div>

              {/* <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  Today
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  7d
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  1m
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  3m
                </button>
              </div> */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8">{/* <DashboardStats /> */}</div>

          {/* Metrics Grid */}
          {/* <div className="grid grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={<Eye className="w-6 h-6" />}
              value="890"
              label="New Patients"
              change={{ value: 40, period: 'month' }}
              viewAllLink="/patients"
              iconBgColor="bg-green-100"
              iconTextColor="text-green-600"
            />
            <MetricCard
              icon={<Stethoscope className="w-6 h-6" />}
              value="360"
              label="OPD Patients"
              change={{ value: 30, period: 'month' }}
              viewAllLink="/opd"
              iconBgColor="bg-blue-100"
              iconTextColor="text-blue-600"
            />
            <MetricCard
              icon={<Calendar className="w-6 h-6" />}
              value="980"
              label="Lab Tests"
              change={{ value: 60, period: 'month' }}
              viewAllLink="/lab"
              iconBgColor="bg-red-100"
              iconTextColor="text-red-600"
            />
            <MetricCard
              icon={<DollarSign className="w-6 h-6" />}
              value="$98,000"
              label="Total Earnings"
              change={{ value: 20, period: 'month' }}
              viewAllLink="/earnings"
              iconBgColor="bg-yellow-100"
              iconTextColor="text-yellow-600"
            />
          </div> */}

          {/* Quick Stats */}
          <div className="grid grid-cols-6 gap-6">
            {[{ icon: Calendar, label: "Appointments", value: "1" }].map(
              (stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              )
            )}
          </div>
          <div className="mt-12">
            {appointments &&
              appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  onConfirm={onConfirm}
                />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  icon,
  value,
  label,
  change,
  viewAllLink,
  iconBgColor,
  iconTextColor,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <div className={`${iconTextColor}`}>{icon}</div>
        </div>
        {viewAllLink && (
          <a
            href={viewAllLink}
            className="text-sm text-blue-600 hover:underline"
          >
            View All →
          </a>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        <p className="text-gray-600">{label}</p>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              change.value >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {change.value >= 0 ? "+" : ""}
            {change.value}%
          </span>
          <span className="text-sm text-gray-400">this {change.period}</span>
        </div>
      </div>
    </div>
  );
}
