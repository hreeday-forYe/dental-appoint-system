import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Stethoscope } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetAllDentistsQuery } from "@/app/slices/dentistApiSlice";
// import { Checkbox } from "@/components/ui/checkbox";

// Mock data for 30 doctors
// const mockDoctors = [
//   {
//     id: 1,
//     name: "Dr. Sarah Johnson",
//     specialization: "General Dentistry",
//     location: "New York, NY",
//     availability: "Available Today",
//     image: "https://source.unsplash.com/100x100/?portrait,dentist,1",
//   },
//   {
//     id: 2,
//     name: "Dr. Michael Chen",
//     specialization: "Orthodontics",
//     location: "Los Angeles, CA",
//     availability: "Available This Week",
//     image: "https://source.unsplash.com/100x100/?portrait,dentist,2",
//   },
//   // Add 28 more doctors...
// ];

// Mock data for filters
const specializations = [
  "General Dentistry",
  "Orthodontics",
  "Periodontics",
  "Endodontics",
  "Pediatric Dentistry",
];

const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
];

const availabilityOptions = ["Available Today", "Available This Week"];

const FindDoctorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useGetAllDentistsQuery();
  console.log(data);
  const currentDoctors = data?.dentists;
  const doctorsPerPage = 10;
  const totalPages= 4
  // console.log(mockDoctors);

  // // Filter doctors based on search and filters
  // const filteredDoctors = mockDoctors?.filter((doctor) => {
  //   const matchesSearch =
  //     doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     doctor.location.toLowerCase().includes(searchQuery.toLowerCase());

  //   const matchesSpecialization = selectedSpecialization
  //     ? doctor.specialization === selectedSpecialization
  //     : true;

  //   const matchesLocation = selectedLocation
  //     ? doctor.location === selectedLocation
  //     : true;

  //   const matchesAvailability =
  //     selectedAvailability.length === 0 ||
  //     selectedAvailability.includes(doctor.availability);

  //   return (
  //     matchesSearch &&
  //     matchesSpecialization &&
  //     matchesLocation &&
  //     matchesAvailability
  //   );
  // });

  // // Pagination logic
  // const indexOfLastDoctor = currentPage * doctorsPerPage;
  // const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  // const currentDoctors = filteredDoctors?.slice(
  //   indexOfFirstDoctor,
  //   indexOfLastDoctor
  // );

  // const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Doctors</h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by name, specialization, or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setCurrentPage(1)}>Search</Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Select onValueChange={setSelectedSpecialization}>
            <SelectTrigger>
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <div className="flex flex-col space-y-2">
            {availabilityOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedAvailability.includes(option)}
                  onCheckedChange={(checked) => {
                    setSelectedAvailability((prev) =>
                      checked
                        ? [...prev, option]
                        : prev.filter((item) => item !== option)
                    );
                  }}
                />
                <label htmlFor={option} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div> */}
        </div>

        {/* Doctor List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDoctors?.map((doctor) => (
            <Card key={doctor.id}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback>{doctor.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{doctor.user.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {doctor.specialization}
                    </p>
                  </div>
                    
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{doctor.experience} years</p>
                <Badge variant="secondary">{doctor.user.isVerified}</Badge>
                <Badge variant="secondary">{doctor.workingHours.days[0]}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="mx-4 flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FindDoctorsPage;
