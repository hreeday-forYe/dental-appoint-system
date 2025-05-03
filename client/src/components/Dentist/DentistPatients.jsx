import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PatientCard } from "./PatientCard";

import { Search, UserPlus } from "lucide-react";
import { useGetPatientsDataQuery } from "@/app/slices/dentistApiSlice";
// Mock data
const mockPatients = [
  {
    _id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
    lastAppointment: "2024-03-15",
  },
  {
    _id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1 (555) 234-5678",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop",
    lastAppointment: "2024-03-20",
  },
  {
    _id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "+1 (555) 345-6789",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&auto=format&fit=crop",
    lastAppointment: "2024-03-22",
  },
  {
    _id: "4",
    name: "David Kim",
    email: "d.kim@example.com",
    phone: "+1 (555) 456-7890",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop",
    lastAppointment: "2024-03-25",
  },
  {
    _id: "5",
    name: "Lisa Thompson",
    email: "lisa.t@example.com",
    phone: "Not provided",
    avatar: null,
    lastAppointment: "2024-03-26",
  },
];

export default function DentistPatients() {
  const [searchQuery, setSearchQuery] = useState("");

  // const [patients, setPatients] = useState(mockPatients);
  const { data: realPatients, isLoading } = useGetPatientsDataQuery();
  const patients = Array.isArray(realPatients?.data) ? realPatients.data : [];
  // const 

  const filteredPatients = patients?.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (isLoading) {
    return <>Loading....</>;
  }
  return (
    <div className="flex-1 p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view your patient records
          </p>
        </div>
        <Button className="bg-teal-600 flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name, email, or phone..."
          className="pl-10 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPatients?.map((patient) => (
          <PatientCard key={patient._id} patient={patient} />
        ))}
      </div>

      {filteredPatients?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No patients found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
