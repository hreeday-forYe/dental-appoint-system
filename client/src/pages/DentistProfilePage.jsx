import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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

import {useGetDentistProfileQuery} from '@/app/slices/dentistApiSlice'

// Mock data - replace with actual data from your backend
const initialData = {
  user: {
    name: "Dr. Dipesh Dahal",
    email: "sarah.wilson@example.com",
    phone: "1234567890",
    address: "123 Medical Center Drive, Healthcare City",
    avatar: {
      url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop",
    },
  },
  specialization: "Orthodontics",
  experience: 8,
  nmcNumber: "NMC123456",
  qualifications: ["BDS", "MDS - Orthodontics", "Fellowship in Implantology"],
  consultingFee: 150,
  slotDuration: 30,
  workingHours: {
    startTime: "09:00",
    endTime: "17:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  bio: "Dedicated dental professional with over 8 years of experience specializing in orthodontics. Committed to providing exceptional patient care and achieving optimal dental health outcomes.",
};

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
  const { data: dentistDataReal, isLoading } = useGetDentistProfileQuery();
  const [selectedImage, setSelectedImage] = useState();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Reset form when data is loaded
  useEffect(() => {
    if (dentistDataReal?.dentist) {
      reset({
        name: dentistDataReal.dentist.user?.name || '',
        email: dentistDataReal.dentist.user?.email || '',
        phone: dentistDataReal.dentist.user?.phone || '',
        address: dentistDataReal.dentist.user?.address || '',
        specialization: dentistDataReal.dentist.specialization || '',
        experience: dentistDataReal.dentist.experience || 0,
        nmcNumber: dentistDataReal.dentist.nmcNumber || '',
        consultingFee: dentistDataReal.dentist.consultingFee || 0,
        slotDuration: dentistDataReal.dentist.slotDuration || 30,
        bio: dentistDataReal.dentist.bio || '',
        startTime: dentistDataReal.dentist.workingHours?.startTime || '09:00',
        endTime: dentistDataReal.dentist.workingHours?.endTime || '17:00',
      });
    }
  }, [dentistDataReal, reset]);

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

  const onSubmit = async (data) => {
    try {
      // Your update logic here
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      toast.success("Password changed successfully");
      setIsChangingPassword(false);
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
    <ScrollArea className='flex-1 h-[100vh]'>
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
                onSubmit={handleSubmit(handlePasswordChange)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...register("currentPassword")}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsChangingPassword(false)}
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
                    src={selectedImage|| dentistData.user?.avatar?.url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop'}
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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full mt-6 space-y-4"
              >
                <div>
                  <Label>Full Name</Label>
                  <Input
                    {...register("name")}
                    disabled={!isEditing}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    {...register("email")}
                    disabled={true}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    {...register("phone")}
                    disabled={!isEditing}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    {...register("address")}
                    disabled={!isEditing}
                    className="text-center"
                  />
                </div>
              </form>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Specialization</Label>
                  <Input
                    {...register("specialization")}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Experience (Years)</Label>
                  <Input
                    type="number"
                    {...register("experience")}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>NMC Number</Label>
                  <Input {...register("nmcNumber")} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Consulting Fee ($)</Label>
                  <Input
                    type="number"
                    {...register("consultingFee")}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Slot Duration (minutes)</Label>
                  <Input
                    type="number"
                    {...register("slotDuration")}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  {...register("bio")}
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
                      {...register("startTime")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      {...register("endTime")}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Working Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {weekDays?.map((day) => (
                    <Badge
                      key={day}
                      variant="outline"
                      className={`cursor-pointer ${
                        dentistData?.workingHours?.days.includes(day)
                          ? "bg-teal-50 text-teal-600 border-teal-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Qualifications</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dentistData?.qualifications?.map((qual, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-teal-50 text-teal-600 border-teal-200"
                    >
                      {qual}
                    </Badge>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Save Changes
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
