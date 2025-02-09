// import { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useGetAllDentistsQuery } from "@/app/slices/dentistApiSlice";
// function AdminAllDentists() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedDentist, setSelectedDentist] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const { data, refetch } = useGetAllDentistsQuery();

//   // const dentists = [
//   //   {
//   //     id: 1,
//   //     user: {
//   //       name: "Dr. Sarah Johnson",
//   //       email: "sarah@example.com",
//   //       avatar: {
//   //         url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
//   //       },
//   //       isVerified: true,
//   //     },
//   //     specialization: "Orthodontist",
//   //     experience: 10,
//   //     nmcNumber: "NMC123456",
//   //     qualifications: ["BDS", "MDS - Orthodontics"],
//   //     consultingFee: 150,
//   //     slotDuration: 30,
//   //     workingHours: {
//   //       startTime: "09:00",
//   //       endTime: "17:00",
//   //       days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
//   //     },
//   //     bio: "Experienced orthodontist specializing in clear aligners and traditional braces.",
//   //     status: "approved",
//   //   },
//   //   {
//   //     id: 2,
//   //     user: {
//   //       name: "Dr. Michael Chen",
//   //       email: "michael@example.com",
//   //       avatar: null,
//   //       isVerified: false,
//   //     },
//   //     specialization: "Periodontist",
//   //     experience: 8,
//   //     nmcNumber: "NMC789012",
//   //     qualifications: ["BDS", "MDS - Periodontics"],
//   //     consultingFee: 120,
//   //     slotDuration: 45,
//   //     workingHours: {
//   //       startTime: "10:00",
//   //       endTime: "18:00",
//   //       days: ["Monday", "Wednesday", "Friday"],
//   //     },
//   //     bio: "Specialist in gum diseases and dental implants.",
//   //     status: "pending",
//   //   },
//   // ];

//   const dentists = data?.dentists;

//   // const filteredDentists = dentists.filter(
//   //   (dentist) =>
//   //     dentist.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     dentist.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     dentist.specialization.toLowerCase().includes(searchQuery.toLowerCase())
//   // );

//   const handleViewDetails = (dentist) => {
//     setSelectedDentist(dentist);
//     setIsDialogOpen(true);
//   };

//   const handleStatusChange = (dentistId, newStatus) => {
//     // Implement status change logic here
//     console.log(`Changing status for dentist ${dentistId} to ${newStatus}`);
//     setIsDialogOpen(false);
//   };

//   const formatWorkingHours = (workingHours) => {
//     if (!workingHours) return "Not specified";
//     return `${workingHours.startTime} - ${workingHours.endTime}`;
//   };

//   const formatWorkingDays = (workingHours) => {
//     if (!workingHours?.days?.length) return "Not specified";
//     return workingHours.days.join(", ");
//   };

//   console.log(dentists);
//   const DentistList = ({ dentists, status }) => (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//       {dentists.map((dentist) => (
//         <Card key={dentist.id} className="p-6">
//           <div className="flex items-center gap-4">
//             {dentist.user.avatar?.url ? (
//               <img
//                 src={dentist.user.avatar.url}
//                 alt={dentist.user.name}
//                 className="h-16 w-16 rounded-full object-cover"
//               />
//             ) : (
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
//                 <UserIcon className="h-8 w-8 text-gray-500" />
//               </div>
//             )}
//             <div>
//               <h3 className="font-semibold">{dentist.user.name}</h3>
//               <p className="text-sm text-muted-foreground">
//                 {dentist.specialization}
//               </p>
//             </div>
//           </div>
//           <div className="mt-4 space-y-2">
//             <p className="text-sm">Experience: {dentist.experience} years</p>
//             <p className="text-sm">NMC Number: {dentist.nmcNumber}</p>
//             <p className="text-sm">Consulting Fee: ${dentist.consultingFee}</p>
//           </div>
//           <Button
//             className="mt-4 w-full"
//             variant="outline"
//             onClick={() => handleViewDetails(dentist)}
//           >
//             <Eye className="mr-2 h-4 w-4" />
//             View Details
//           </Button>
//         </Card>
//       ))}
//     </div>
//   );

//   return (
//     <div className="flex-1 overflow-auto">
//       <div className="p-8">
//         <div className="mx-auto max-w-7xl space-y-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold">Dentists</h1>
//               <p className="text-muted-foreground">
//                 Manage dentist applications and approvals
//               </p>
//             </div>
//             <div className="relative w-64">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search dentists..."
//                 className="pl-8"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           <Tabs defaultValue="approved">
//             <TabsList>
//               <TabsTrigger value="approved">Approved Dentists</TabsTrigger>
//               <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
//             </TabsList>
//             <TabsContent value="approved" className="mt-6">
//               <DentistList dentists={dentists} status={true} />
//             </TabsContent>
//             <TabsContent value="pending" className="mt-6">
//               <DentistList dentists={dentists} status={false} />
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         {selectedDentist && (
//           <DialogContent className="sm:max-w-[600px]">
//             <DialogHeader>
//               <DialogTitle>Dentist Details</DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-6">
//               <div className="flex items-center gap-4">
//                 {selectedDentist.user.avatar?.url ? (
//                   <img
//                     src={selectedDentist.user.avatar.url}
//                     alt={selectedDentist.user.name}
//                     className="h-24 w-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
//                     <UserIcon className="h-12 w-12 text-gray-500" />
//                   </div>
//                 )}
//                 <div>
//                   <h3 className="text-xl font-semibold">
//                     {selectedDentist.user.name}
//                   </h3>
//                   <p className="text-muted-foreground">
//                     {selectedDentist.specialization}
//                   </p>
//                   <div className="mt-2">
//                     <span
//                       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                         selectedDentist.user.isVerified
//                           ? "bg-green-100 text-green-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {selectedDentist.user.isVerified
//                         ? "Verified"
//                         : "Pending Verification"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid gap-4">
//                 <div className="grid gap-2">
//                   <h4 className="font-semibold">Contact Information</h4>
//                   <p className="text-sm">Email: {selectedDentist.user.email}</p>
//                 </div>

//                 <div className="grid gap-2">
//                   <h4 className="font-semibold">Professional Details</h4>
//                   <p className="text-sm">
//                     Experience: {selectedDentist.experience} years
//                   </p>
//                   <p className="text-sm">
//                     NMC Number: {selectedDentist.nmcNumber}
//                   </p>
//                   <p className="text-sm">
//                     Qualifications: {selectedDentist.qualifications.join(", ")}
//                   </p>
//                   <p className="text-sm">
//                     Consulting Fee: ${selectedDentist.consultingFee}
//                   </p>
//                   <p className="text-sm">
//                     Appointment Duration: {selectedDentist.slotDuration} minutes
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <h4 className="font-semibold">Schedule</h4>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Clock className="h-4 w-4" />
//                     {formatWorkingHours(selectedDentist.workingHours)}
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Calendar className="h-4 w-4" />
//                     {formatWorkingDays(selectedDentist.workingHours)}
//                   </div>
//                 </div>

//                 {selectedDentist.bio && (
//                   <div className="grid gap-2">
//                     <h4 className="font-semibold">Bio</h4>
//                     <p className="text-sm">{selectedDentist.bio}</p>
//                   </div>
//                 )}
//               </div>

//               {selectedDentist.status === "pending" && (
//                 <div className="flex gap-4 mt-4">
//                   <Button
//                     className="flex-1 bg-green-500 hover:bg-green-600"
//                     onClick={() =>
//                       handleStatusChange(selectedDentist.id, "approved")
//                     }
//                   >
//                     <CheckCircle className="mr-2 h-4 w-4" />
//                     Approve
//                   </Button>
//                   <Button
//                     className="flex-1"
//                     variant="destructive"
//                     onClick={() =>
//                       handleStatusChange(selectedDentist.id, "rejected")
//                     }
//                   >
//                     <XCircle className="mr-2 h-4 w-4" />
//                     Reject
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         )}
//       </Dialog>
//     </div>
//   );
// }

// export default AdminAllDentists;

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

import { Search, Eye, User as UserIcon, Clock, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAllDentistsQuery,
  useVerifyDentistMutation,
} from "@/app/slices/dentistApiSlice";

function AdminAllDentists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, refetch, isLoading, isError } = useGetAllDentistsQuery();
  const [verifyDentist, { isLoading: verifyLoading }] =
    useVerifyDentistMutation();

  const dentists = data?.dentists || []; // Fallback to an empty array if data is undefined

  const handleViewDetails = (dentist) => {
    setSelectedDentist(dentist);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (dentistId) => {
    // Implement status change logic here
    // console.log(`Changing status for dentist ${dentistId} to ${newStatus}`);
    try {
      const response = await verifyDentist(dentistId);
      refetch()
      toast.success("Dentist has been verified Successfully");
    } catch (error) {
      toast.error(error.message);
    }
    setIsDialogOpen(false);
  };
  const formatWorkingHours = (workingHours) => {
    if (!workingHours) return "Not specified";
    return `${workingHours.startTime} - ${workingHours.endTime}`;
  };

  const formatWorkingDays = (workingHours) => {
    if (!workingHours?.days?.length) return "Not specified";
    return workingHours.days.join(", ");
  };

  // Filter dentists based on their verification status
  const filterDentistsByStatus = (status) => {
    return dentists.filter((dentist) => dentist?.user?.isVerified === status);
  };

  // console.log(filterDentistsByStatus(false));
  const DentistList = ({ dentists }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dentists.length === 0 ? (
        <div>No dentists found.</div>
      ) : (
        dentists.map((dentist) => (
          <Card key={dentist.id} className="p-6">
            <div className="flex items-center gap-4">
              {dentist.user.avatar?.url ? (
                <img
                  src={dentist.user.avatar.url}
                  alt={dentist.user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <UserIcon className="h-8 w-8 text-gray-500" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{dentist.user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {dentist.specialization}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm">Experience: {dentist.experience} years</p>
              <p className="text-sm">NMC Number: {dentist.nmcNumber}</p>
              <p className="text-sm">
                Consulting Fee: ${dentist.consultingFee}
              </p>
            </div>
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() => handleViewDetails(dentist)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Card>
        ))
      )}
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading dentists.</div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Dentists</h1>
              <p className="text-muted-foreground">
                Manage dentist applications and approvals
              </p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dentists..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="approved">
            <TabsList>
              <TabsTrigger value="approved">Verified Dentists</TabsTrigger>
              <TabsTrigger value="pending">Unverified Dentists</TabsTrigger>
            </TabsList>

            <TabsContent value="approved" className="mt-6">
              <DentistList dentists={filterDentistsByStatus(true)} />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <DentistList dentists={filterDentistsByStatus(false)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDentist && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Dentist Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                {selectedDentist.user.avatar?.url ? (
                  <img
                    src={selectedDentist.user.avatar.url}
                    alt={selectedDentist.user.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                    <UserIcon className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedDentist.user.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedDentist.specialization}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        selectedDentist.user.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedDentist.user.isVerified
                        ? "Verified"
                        : "Pending Verification"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <h4 className="font-semibold">Contact Information</h4>
                  <p className="text-sm">Email: {selectedDentist.user.email}</p>
                </div>

                <div className="grid gap-2">
                  <h4 className="font-semibold">Professional Details</h4>
                  <p className="text-sm">
                    Experience: {selectedDentist.experience} years
                  </p>
                  <p className="text-sm">
                    NMC Number: {selectedDentist.nmcNumber}
                  </p>
                  <p className="text-sm">
                    Qualifications: {selectedDentist.qualifications.join(", ")}
                  </p>
                  <p className="text-sm">
                    Consulting Fee: ${selectedDentist.consultingFee}
                  </p>
                  <p className="text-sm">
                    Appointment Duration: {selectedDentist.slotDuration} minutes
                  </p>
                </div>

                <div className="grid gap-2">
                  <h4 className="font-semibold">Schedule</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {formatWorkingHours(selectedDentist.workingHours)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {formatWorkingDays(selectedDentist.workingHours)}
                  </div>
                </div>

                {selectedDentist.bio && (
                  <div className="grid gap-2">
                    <h4 className="font-semibold">Bio</h4>
                    <p className="text-sm">{selectedDentist.bio}</p>
                  </div>
                )}
              </div>

              {selectedDentist.user.isVerified === false && (
                <div className="flex gap-4 mt-4">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => handleStatusChange(selectedDentist._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => handleStatusChange(selectedDentist._id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

export default AdminAllDentists;
