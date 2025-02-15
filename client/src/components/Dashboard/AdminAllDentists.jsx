import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import {
  Search,
  Eye,
  User as UserIcon,
  Clock,
  Calendar,
  Plus,
  UserPlus,
} from "lucide-react";
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
  const dentists = data?.dentists;

  const handleViewDetails = (dentist) => {
    setSelectedDentist(dentist);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (dentistId) => {
    try {
      const response = await verifyDentist(dentistId);
      refetch();
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

  const filterDentistsByStatus = (status) => {
    return dentists.filter((dentist) => dentist?.user?.isVerified === status);
  };

  useEffect(() => {
    refetch();
  }, []);

  const DentistList = ({ dentists }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dentists.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">
          No dentists found in this category.
        </div>
      ) : (
        dentists.map((dentist) => (
          <Card
            key={dentist._id}
            className="p-6 hover:shadow-lg transition-shadow duration-200"
          >
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
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading dentists.
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-25px)] ">
      <div className="overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Dental Professionals
                  </h1>
                  <p className="text-gray-500 mt-2">
                    Manage and oversee all dental professionals in the system
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/admin/add-dentist">
                    <Button
                      className="bg-teal-500 hover:bg-teal-700 text-white shadow-md"
                      onClick={() => console.log("Add new dentist")}
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Add New Dentist
                    </Button>
                  </Link>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search dentists..."
                      className="pl-10 w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-blue-600 font-semibold">
                    Total Dentists
                  </h3>
                  <p className="text-2xl font-bold">{dentists.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-green-600 font-semibold">Verified</h3>
                  <p className="text-2xl font-bold">
                    {filterDentistsByStatus(true).length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-yellow-600 font-semibold">
                    Pending Verification
                  </h3>
                  <p className="text-2xl font-bold">
                    {filterDentistsByStatus(false).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Tabs defaultValue="approved" className="space-y-6">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="approved" className="flex-1 sm:flex-none">
                    Verified Dentists
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex-1 sm:flex-none">
                    Pending Verification
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="approved">
                  <DentistList dentists={filterDentistsByStatus(true)} />
                </TabsContent>

                <TabsContent value="pending">
                  <DentistList dentists={filterDentistsByStatus(false)} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Details Dialog */}
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
                    <p className="text-sm">
                      Email: {selectedDentist.user.email}
                    </p>
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
                      Qualifications:{" "}
                      {selectedDentist.qualifications.join(", ")}
                    </p>
                    <p className="text-sm">
                      Consulting Fee: ${selectedDentist.consultingFee}
                    </p>
                    <p className="text-sm">
                      Appointment Duration: {selectedDentist.slotDuration}{" "}
                      minutes
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <h4 className="font-semibold">Working Time</h4>
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
    </ScrollArea>
  );
}

export default AdminAllDentists;
