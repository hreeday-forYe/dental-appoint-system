import React, { useState } from "react";
import { Search } from "lucide-react";
import { DentistCard } from "../components";
import { Input } from "@/components/ui/input";
import { useGetAllDentistsQuery } from "@/app/slices/dentistApiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const specializations = [
  { value: "all", label: "All Specializations" },
  { value: "general dentist", label: "General Dentist" },
  { value: "orthodontics", label: "Orthodontist" },
  { value: "periodontics", label: "Periodontics" }, // Added this as it appears in your data
  { value: "endodontist", label: "Endodontist" },
  { value: "oral surgeon", label: "Oral Surgeon" },
];

const sortOptions = [
  { value: "experience", label: "Experience (High to Low)" },
  { value: "experience-asc", label: "Experience (Low to High)" },
  { value: "fee-asc", label: "Fee (Low to High)" },
  { value: "fee-desc", label: "Fee (High to Low)" },
];

export default function FindDoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("experience");
  const { data, isLoading } = useGetAllDentistsQuery();

  const dentists = Array.isArray(data?.dentists)
    ? [...data.dentists].reverse()
    : [];

  const filteredDentists = dentists
    .filter((dentist) => {
      const nameMatch = dentist.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const specializationMatch = dentist.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || specializationMatch;

      const matchesSpecialization =
        selectedSpecialization === "all" ||
        dentist.specialization.toLowerCase() ===
          selectedSpecialization.toLowerCase();

      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "experience":
          return b.experience - a.experience;
        case "experience-asc":
          return a.experience - b.experience;
        case "fee-asc":
          return a.consultingFee - b.consultingFee;
        case "fee-desc":
          return b.consultingFee - a.consultingFee;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-36 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Your Dental Specialist
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with experienced dentists and book your appointment today
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name or specialization..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4 sm:w-auto w-full">
                <Select
                  defaultValue={selectedSpecialization}
                  onValueChange={setSelectedSpecialization}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select specialization">
                      {
                        specializations.find(
                          (s) => s.value === selectedSpecialization
                        )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec.value} value={spec.value}>
                        {spec.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select defaultValue={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by">
                      {sortOptions.find((s) => s.value === sortBy)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDentists.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No dentists found matching your criteria
              </p>
            </div>
          ) : (
            filteredDentists.map((dentist) => (
              <DentistCard key={dentist._id} dentist={dentist} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
