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
  Edit,
  Mail,
  Award,
  GraduationCap,
  DollarSign,
  CheckCircle,
  XCircle,
  IndianRupee,
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
                <h3 className="font-semibold text-teal-700">{dentist.user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {dentist.specialization}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm">Experience: {dentist.experience} years</p>
              <p className="text-sm">NMC Number: {dentist.nmcNumber}</p>
              <p className="text-sm">
                Consulting Fee: Rs.{dentist.consultingFee}
              </p>
            </div>
            <Button
              className="mt-4 w-full border-teal-600 text-teal-800 hover:bg-teal-50"
              variant="outline"
              onClick={() => handleViewDetails(dentist)}
            >
              <Eye className="mr-2 h-4 w-4 text-teal-500" />
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
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto my-8">
              <ScrollArea className="h-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl pb-2 font-semibold text-gray-600">
                    Dentist Details
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-8">
                  {/* Header Section with Avatar and Basic Info */}
                  <div className="flex items-start gap-6 border-b border-gray-100 pb-6">
                    {selectedDentist.user.avatar?.url ? (
                      <img
                        src={selectedDentist.user.avatar.url}
                        alt={selectedDentist.user.name}
                        className="h-28 w-28 rounded-full object-cover ring-2 ring-teal-500/10"
                      />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-teal-50">
                        <UserIcon className="h-14 w-14 text-teal-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900">
                            {selectedDentist.user.name}
                          </h3>
                          <p className="text-teal-600 font-medium mt-1">
                            {selectedDentist.specialization}
                          </p>
                        </div>
                        {/* <Button
                          onClick={() => handleEditDentist(selectedDentist._id)}
                          variant="outline"
                          className="border-teal-500 text-teal-500 hover:bg-teal-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </Button> */}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                            selectedDentist.user.isVerified
                              ? "bg-teal-50 text-teal-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {selectedDentist.user.isVerified
                            ? "Verified"
                            : "Pending Verification"}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {selectedDentist.experience} years experience
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid gap-6">
                    {/* Contact Information */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Contact Information
                      </h4>
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-teal-500" />
                        {selectedDentist.user.email}
                      </div>
                    </div>

                    {/* Professional Details */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Professional Details
                      </h4>
                      <div className="grid gap-3 text-gray-700">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-teal-500" />
                          <span>NMC Number: {selectedDentist.nmcNumber}</span>
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2 text-teal-500" />
                          <span>
                            Qualifications:{" "}
                            {selectedDentist.qualifications.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-2 text-teal-500" />
                          <span>
                            Consulting Fee: Rs.{selectedDentist.consultingFee}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-teal-500" />
                          <span>
                            Appointment Duration: {selectedDentist.slotDuration}{" "}
                            minutes
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Working Schedule
                      </h4>
                      <div className="grid gap-3 text-gray-700">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-teal-500" />
                          <span>
                            {formatWorkingHours(selectedDentist.workingHours)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-teal-500" />
                          <span>
                            {formatWorkingDays(selectedDentist.workingHours)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {selectedDentist.bio && (
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          About
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedDentist.bio}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Approval Actions */}
                  {selectedDentist.user.isVerified === false && (
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                      <Button
                        className="flex-1 bg-teal-500 hover:bg-teal-600"
                        onClick={() => handleStatusChange(selectedDentist._id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        className="flex-1 bg-white border-2 border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleStatusChange(selectedDentist._id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </ScrollArea>
  );
}

export default AdminAllDentists;
