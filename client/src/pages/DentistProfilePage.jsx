import { useState, useEffect } from "react";
import {
  Camera,
  User2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Stethoscope,
  GraduationCap,
  Clock4,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChangePasswordMutation } from "@/app/slices/userApiSlice";
import {
  useGetDentistProfileQuery,
  useUpdateDentistProfileMutation,
} from "@/app/slices/dentistApiSlice";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DentistProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: dentistDataReal,
    isLoading,
    refetch,
  } = useGetDentistProfileQuery();
  const [selectedImage, setSelectedImage] = useState();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateDentistProfile, { isLoading: updateLoading }] =
    useUpdateDentistProfileMutation();

  // Add state for working days management
  const [selectedDays, setSelectedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  // Initialize form values
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    experience: 0,
    nmcNumber: "",
    consultingFee: 0,
    slotDuration: 30,
    bio: "",
    startTime: "09:00",
    endTime: "17:00",
    workingDays: [],
    qualifications: [],
  });

  // State for new qualification input
  const [newQualification, setNewQualification] = useState("");

  // Reset form and days when data is loaded
  useEffect(() => {
    if (dentistDataReal?.dentist) {
      const dentist = dentistDataReal.dentist;
      setFormValues({
        name: dentist.user?.name || "",
        email: dentist.user?.email || "",
        phone: dentist.user?.phone || "",
        address: dentist.user?.address || "",
        specialization: dentist.specialization || "",
        experience: dentist.experience || 0,
        nmcNumber: dentist.nmcNumber || "",
        consultingFee: dentist.consultingFee || 0,
        slotDuration: dentist.slotDuration || 30,
        bio: dentist.bio || "",
        startTime: dentist.workingHours?.startTime || "09:00",
        endTime: dentist.workingHours?.endTime || "17:00",
        workingDays: dentist.workingHours?.days || [],
        qualifications: dentist.qualifications || [],
      });

      // Initialize selected days based on the dentist data
      const days = {};
      weekDays.forEach((day) => {
        days[day] = dentist.workingHours?.days?.includes(day) || false;
      });
      setSelectedDays(days);
    }
  }, [dentistDataReal]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Please upload only JPG, PNG or GIF images");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle working day toggle
  const handleDayToggle = (day) => {
    setSelectedDays((prev) => {
      const newDays = { ...prev, [day]: !prev[day] };

      // Update working days array based on selected days
      const workingDays = Object.entries(newDays)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day);

      setFormValues((prev) => ({
        ...prev,
        workingDays,
      }));

      return newDays;
    });
  };

  // Handle adding a new qualification
  const handleAddQualification = (e) => {
    e.preventDefault();
    if (newQualification.trim()) {
      setFormValues((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()],
      }));
      setNewQualification("");
    }
  };

  // Handle removing a qualification
  const handleRemoveQualification = (index) => {
    setFormValues((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formValues,
        workingHours: {
          startTime: formValues.startTime,
          endTime: formValues.endTime,
          days: formValues.workingDays,
        },
      };

      // Your API call would go here
      const response = await updateDentistProfile(data).unwrap();
      if (response.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        refetch();
      }
      // // For now just show success toast
      // console.log("Submitting data:", response);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };
  const [handlePassword, { isLoading: passwordLoading }] =
    useChangePasswordMutation();
  const handlePasswordChange = async (data) => {
    try {
      const response = await handlePassword(data).unwrap();
      if (response.success) {
        toast.success(response.message);
        setIsChangingPassword(false);
      }
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!dentistDataReal?.dentist) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No dentist data found</p>
      </div>
    );
  }

  const dentistData = dentistDataReal.dentist;

  return (
    <ScrollArea className="flex-1 h-[100vh]">
      <div className="flex-1 mx-auto p-4 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <div className="flex gap-2">
            <Dialog
              open={isChangingPassword}
              onOpenChange={setIsChangingPassword}
            >
              <DialogTrigger asChild>
                <Button variant="outline">Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePasswordChange({
                      currentPassword: e.target.currentPassword.value,
                      newPassword: e.target.newPassword.value,
                      confirmPassword: e.target.confirmPassword.value,
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsChangingPassword(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant={isEditing ? "secondary" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className={!isEditing ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={
                      selectedImage ||
                      dentistData.user?.avatar?.url ||
                      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop"
                    }
                    alt={dentistData?.user?.name}
                  />
                  <AvatarFallback>
                    <User2 className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full cursor-pointer hover:bg-teal-700"
                  >
                    <Camera className="w-5 h-5" />
                    <Input
                      id="avatar"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </Label>
                )}
              </div>
              <form className="w-full mt-6 space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    value={formValues.email}
                    disabled={true}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    value={formValues.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    name="address"
                    value={formValues.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-center"
                  />
                </div>
              </form>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Specialization</Label>
                  <Input
                    name="specialization"
                    value={formValues.specialization}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Experience (Years)</Label>
                  <Input
                    type="number"
                    name="experience"
                    value={formValues.experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>NMC Number</Label>
                  <Input
                    name="nmcNumber"
                    value={formValues.nmcNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Consulting Fee ($)</Label>
                  <Input
                    type="number"
                    name="consultingFee"
                    value={formValues.consultingFee}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Slot Duration (minutes)</Label>
                  <Input
                    type="number"
                    name="slotDuration"
                    value={formValues.slotDuration}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  name="bio"
                  value={formValues.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-32"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      name="startTime"
                      value={formValues.startTime}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      name="endTime"
                      value={formValues.endTime}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Working Days</Label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-2">
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
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {weekDays.map((day) => (
                      <Badge
                        key={day}
                        variant="outline"
                        className={`${
                          dentistData?.workingHours?.days.includes(day)
                            ? "bg-teal-50 text-teal-600 border-teal-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {day}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Qualifications</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {isEditing ? (
                    <>
                      <div className="w-full flex flex-wrap gap-2 mb-3">
                        {formValues.qualifications.map((qual, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-teal-50 text-teal-600 border-teal-200 pr-1 pl-2 flex items-center gap-1"
                          >
                            {qual}
                            <button
                              type="button"
                              onClick={() => handleRemoveQualification(index)}
                              className="w-4 h-4 rounded-full bg-teal-200 hover:bg-teal-300 text-teal-700 flex items-center justify-center ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex w-full space-x-2">
                        <Input
                          value={newQualification}
                          onChange={(e) => setNewQualification(e.target.value)}
                          placeholder="Add qualification (e.g., BDS, MDS)"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddQualification}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          Add
                        </Button>
                      </div>
                    </>
                  ) : (
                    formValues.qualifications.map((qual, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-teal-50 text-teal-600 border-teal-200"
                      >
                        {qual}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
