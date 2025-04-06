import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { format } from "date-fns";
import {
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} from "@/app/slices/userApiSlice";
import { setCredentials } from "@/app/slices/authSlice";

// Mock data for dentists
const mockDentists = [
  { id: 1, name: "Dr. Sarah Johnson", specialization: "General Dentistry" },
  { id: 2, name: "Dr. Michael Chen", specialization: "Orthodontics" },
  { id: 3, name: "Dr. Emily Williams", specialization: "Periodontics" },
  { id: 4, name: "Dr. James Wilson", specialization: "Endodontics" },
  { id: 5, name: "Dr. Maria Garcia", specialization: "Pediatric Dentistry" },
];

const formatDate = (date) => {
  return format(new Date(date), "do MMM yyyy");
};

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [preferredDentists, setPreferredDentists] = useState([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePassword, { isLoading: passwordLoading, error }] =
    useChangePasswordMutation();

  const { data, refetch } = useGetUserProfileQuery();

  const [updateProfile, { isLoading: profileLoading, error: updateError }] =
    useUpdateProfileMutation();

  const [updateAvatar, { isLoading: avatarLoading }] =
    useUpdateAvatarMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      medicalHistory: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "Contact info not provided",
        dob: data.user.dob ? formatDate(data.user.dob) : "Date of birth not provided",
        address: data.user.address || "Address not provided",
        medicalHistory: data.user.medicalHistory || "No Medical history provided",
      });
      setSelectedImage(data?.user.avatar?.url || "");
    }
  }, [data, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data).unwrap();
      // setCredentials(response.user);
      console.log(response);
      await refetch();
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsEditing(false);
      console.log(data);
    }
  };

  // Separate form for password change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
      reader.onloadend = async () => {
        setSelectedImage(reader.result);
        const data = {
          image: reader.result,
        };
        // Update the image using API CALL TO THE BACKEND
        try {
          // Send the base64 string to the backend
          const response = await updateAvatar(data).unwrap();
          console.log(response);

          // Handle the response
          if (response.success) {
            toast.success("Profile image updated successfully!");
            // setSelectedImage(response.avatar.url); // Update the displayed image
            await refetch();
          } else {
            toast.error("Failed to update profile image");
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setIsEditing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const passwordData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      // Handle API CHANGE FOR THE PASSWORD.
      const response = await changePassword(passwordData).unwrap();
      if (!response.success) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Password changed successfully!");
      resetPassword(); // Reset the password form fields
      setIsChangingPassword(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleDentist = (dentistId) => {
    setPreferredDentists((prev) =>
      prev.includes(dentistId)
        ? prev.filter((id) => id !== dentistId)
        : [...prev, dentistId]
    );
  };

  const removeDentist = (dentistId) => {
    setPreferredDentists((prev) => prev.filter((id) => id !== dentistId));
    toast.success("Dentist preference removed");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <Button
              variant={isEditing ? "secondary" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className={
                !isEditing
                  ? "bg-mainCustomColor text-white hover:bg-teal-600 hover:text-white"
                  : "text-black"
              }
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={selectedImage} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Label
                  htmlFor="picture"
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90"
                >
                  <Camera className="w-5 h-5" />
                  <Input
                    id="picture"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                  />
                </Label>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                disabled={!isEditing}
                {...register("name", {
                  required: "First name is required",
                })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled={true}
                {...register("email", { required: "Email is required" })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                disabled={!isEditing}
                {...register("phone", { required: "Phone number is required" })}
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type={!isEditing ? "string" : "date"}
                disabled={!isEditing}
                {...register("dob", { required: "Date of birth is required" })}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                disabled={!isEditing}
                {...register("address", { required: "Address is required" })}
              />
            </div>

            <div>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                disabled={!isEditing}
                {...register("medicalHistory")}
                className="h-32"
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <Link
                  to="/my-appointments"
                  className="text-primary hover:underline"
                >
                  View My Appointments
                </Link>
              </div>
              <Dialog
                open={isChangingPassword}
                onOpenChange={setIsChangingPassword}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent aria-describedby={"Change Password content"}>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleSubmitPassword(handlePasswordChange)}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...registerPassword("currentPassword", {
                          required: "Current password is required",
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...registerPassword("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerPassword("confirmPassword", {
                          required: "Please confirm your password",
                        })}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsChangingPassword(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-mainCustomColor">
                        Update Password
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <Button type="submit" className="bg-mainCustomColor">
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
