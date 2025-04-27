import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddDentistMutation } from "@/app/slices/adminApiSlice";
import { ScrollArea } from "../ui/scroll-area";
function AddDentist() {
  const navigate = useNavigate();
  const [addDentist, { isLoading, errors: addErrors }] =
    useAddDentistMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      slotDuration: "30",
      workingHours: {
        startTime: "09:00",
        endTime: "17:00",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    },
  });

  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => {
      const newDays = { ...prev, [day]: !prev[day] };
      const selectedDays = Object.entries(newDays)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day);

      setValue("workingHours.days", selectedDays);
      return newDays;
    });
  };

  const onSubmit = async (data) => {
    try {
      // Add your API call here
      const response = await addDentist(data).unwrap();
      console.log(response);
      if (response.success) {
        toast.success("Dentist Added Successfully");
        navigate("/admin/all-dentists");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      reset();
    }
  };

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-25px)] ">
      <div className="overflow-auto bg-gray-50 w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/all-dentists")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dentists
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Stethoscope className="h-8 w-8 text-teal-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Dentist
              </h1>
              <p className="text-gray-500 mt-1">
                Register a new dental professional to the system
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      {...register("name", {
                        required: "Name is required",
                        pattern: {
                          value: /^[A-Za-z\s]{2,}$/,
                          message: "Please enter a valid name",
                        },
                      })}
                      placeholder="Dr. John Doe"
                      className={`w-full ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  {/* ... Rest of the personal information fields ... */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      type="email"
                      placeholder="doctor@example.com"
                      className={`w-full ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        maxLength: {
                          value: 32,
                          message: "Password must not exceed 32 characters",
                        },
                        validate: {
                          hasUpperCase: (value) =>
                            /[A-Z]/.test(value) ||
                            "Must contain at least one uppercase letter",
                          hasLowerCase: (value) =>
                            /[a-z]/.test(value) ||
                            "Must contain at least one lowercase letter",
                          hasNumber: (value) =>
                            /[0-9]/.test(value) ||
                            "Must contain at least one number",
                          hasSpecialChar: (value) =>
                            /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                            "Must contain at least one special character",
                          noSpaces: (value) =>
                            !/\s/.test(value) ||
                            "Password cannot contain spaces",
                        },
                      })}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <Input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\+?[1-9]\d{1,14}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <Input
                      {...register("address", {
                        required: "Address is required",
                        minLength: {
                          value: 10,
                          message: "Please enter a complete address",
                        },
                      })}
                      placeholder="123 Medical Center Dr."
                      className={`w-full ${
                        errors.address ? "border-red-500" : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <Input
                      {...register("dob", {
                        required: "Date of birth is required",
                        validate: (value) => {
                          const date = new Date(value);
                          const today = new Date();
                          const age = today.getFullYear() - date.getFullYear();
                          return age >= 18 || "Must be at least 18 years old";
                        },
                      })}
                      type="date"
                      className={`w-full ${errors.dob ? "border-red-500" : ""}`}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-green-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Professional Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ... Professional information fields ... */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Specialization
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setValue("specialization", value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          General Dentistry
                        </SelectItem>
                        <SelectItem value="orthodontics">
                          Orthodontics
                        </SelectItem>
                        <SelectItem value="periodontics">
                          Periodontics
                        </SelectItem>
                        <SelectItem value="endodontics">Endodontics</SelectItem>
                        <SelectItem value="oral-surgery">
                          Oral Surgery
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.specialization && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.specialization.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Experience (years)
                    </label>
                    <Input
                      {...register("experience", {
                        required: "Experience is required",
                        min: {
                          value: 1,
                          message: "Experience must be at least 1 year",
                        },
                        max: {
                          value: 50,
                          message: "Please enter a valid experience",
                        },
                      })}
                      type="number"
                      placeholder="5"
                      className={`w-full ${
                        errors.experience ? "border-red-500" : ""
                      }`}
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      NMC Number
                    </label>
                    <Input
                      {...register("nmcNumber", {
                        required: "NMC Number is required",
                        // pattern: {
                        //   value: /^NMC\d{6}$/,
                        //   message:
                        //     "Please enter a valid NMC number (e.g., NMC123456)",
                        // },
                      })}
                      placeholder="NMC123456"
                      className={`w-full ${
                        errors.nmcNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.nmcNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nmcNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Qualifications
                    </label>
                    <Input
                      {...register("qualifications", {
                        required: "Qualifications are required",
                      })}
                      placeholder="BDS, MDS"
                      className={`w-full ${
                        errors.qualifications ? "border-red-500" : ""
                      }`}
                    />
                    {errors.qualifications && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.qualifications.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Consulting Fee ($)
                    </label>
                    <Input
                      {...register("consultingFee", {
                        required: "Consulting fee is required",
                        min: {
                          value: 1,
                          message: "Consulting fee must be greater than 0",
                        },
                      })}
                      type="number"
                      placeholder="150"
                      className={`w-full ${
                        errors.consultingFee ? "border-red-500" : ""
                      }`}
                    />
                    {errors.consultingFee && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.consultingFee.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Appointment Duration (minutes)
                    </label>
                    <Select
                      onValueChange={(value) => setValue("slotDuration", value)} // Update form state correctly
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Slot Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 Minutes</SelectItem>
                        <SelectItem value="30">30 Minutes</SelectItem>
                        <SelectItem value="45">45 Minutes</SelectItem>
                        <SelectItem value="60">60 Minutes</SelectItem>
                      </SelectContent>
                    </Select>

                    {errors.slotDuration && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.slotDuration.message}
                      </p>
                    )}
                    {errors.slotDuration && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.slotDuration.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Working Hours Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-teal-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Working Hours
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <Input
                      {...register("workingHours.startTime", {
                        required: "Start time is required",
                      })}
                      type="time"
                      className={`w-full ${
                        errors.workingHours?.startTime ? "border-red-500" : ""
                      }`}
                    />
                    {errors.workingHours?.startTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.workingHours.startTime.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <Input
                      {...register("workingHours.endTime", {
                        required: "End time is required",
                        validate: (value) => {
                          const startTime = watch("workingHours.startTime");
                          return (
                            value > startTime ||
                            "End time must be after start time"
                          );
                        },
                      })}
                      type="time"
                      className={`w-full ${
                        errors.workingHours?.endTime ? "border-red-500" : ""
                      }`}
                    />
                    {errors.workingHours?.endTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.workingHours.endTime.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Working Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedDays).map(([day, isSelected]) => (
                      <Button
                        key={day}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => handleDayToggle(day)}
                        className={`${
                          isSelected
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        } transition-colors duration-200`}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                  {errors.workingHours?.days && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select at least one working day
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/dentists")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-8"
                  >
                    Add Dentist
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AddDentist;
