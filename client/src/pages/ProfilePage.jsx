"use client";

import { useEffect, useRef, useState } from "react";
// import img from 'next/imgimg'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "@/app/slices/userApiSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setCredentials } from "@/app/slices/authSlice";
import profileimage from "../assets/images/profilepage.png";

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState("/https://placehold.co/100x100");
  const [updateUserProfile, { isLoading }] = useUpdateProfileMutation();
  const [updateStatus, setUpdateStatus] = useState(false);
  const dispatch = useDispatch();
  const updateRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      const res = await updateUserProfile(data).unwrap();
      dispatch(setCredentials({ user: res.user }));
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error(error);
    }
  };
  const userData = useSelector((state) => state.auth.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-zinc-800">
              Manage your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 ">
                  {!userData?.profilePic ? (
                    <img
                      src="https://github.com/shadcn.png"
                      alt="Profile"
                      layout="fill"
                      width="150px"
                      height="100px"
                      className="rounded-full"
                    />
                  ) : (
                    <Avatar></Avatar>
                  )}
                </div>
                <Input
                  id="avatar"
                  type="file"
                  accept="imgimg/*"
                  className="hidden"
                  {...register("avatar")}
                />
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="additional">Additional Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        {...register("name", {
                          required: "Name is required",
                        })}
                        defaultValue={userData?.name}
                        ref={updateRef}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        value={userData?.email}
                        className="text-black"
                        disabled={true}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="additional">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone", {
                          required: false,
                          minLength: {
                            value: 10,
                            message: "Phone Number must be at least 10 digits",
                          },
                        })}
                        defaultValue={userData?.phone}
                        placeholder="Enter your Phone Number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        {...register("address", {
                          required: false,
                          minLength: {
                            value: 6,
                            message: "Invalid address format",
                          },
                        })}
                        placeholder="Enter your address"
                        defaultValue={userData?.address}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="bio">Medical Issues</Label>
                      <Textarea
                        id="medicalIssues"
                        defaultValue={userData?.medicalissues}
                        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:ring-offset-1"
                        {...register("medicalIssues", {
                          required: false,
                        })}
                        placeholder="Add medical issues if any"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="security">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        {...register("password")}
                        placeholder="Current Password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        {...register("newPassword", {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        placeholder="New Password"
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword", {
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                        placeholder="Confirm Password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-mainCustomColor hover:bg-teal-600"
                  ref={updateRef}
                >
                  {!updateStatus ? "Edit" : "Save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
