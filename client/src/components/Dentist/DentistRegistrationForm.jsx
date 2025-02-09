import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Stethoscope,
  Clock,
  GraduationCap,
  BrainCircuit,
  Timer,
} from "lucide-react";
import { useRegisterDentistMutation } from "@/app/slices/dentistApiSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../app/slices/userApiSlice";
import { logout as logoutStore } from "../../app/slices/authSlice";
import { toast } from "react-toastify";

function DentistRegistrationForm() {
  const form = useForm({
    defaultValues: {
      specialization: "",
      experience: "",
      nmcNumber: "",
      qualifications: "",
      consultingFee: "",
      slotDuration: "30",
      workingHours: {
        startTime: "09:00",
        endTime: "17:00",
        days: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
      },
      bio: "",
    },
  });

  const [registerDentist, { isLoading, isError }] =
    useRegisterDentistMutation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutStore());
      navigate("/");
      toast.success("Logout successfull");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onSubmit = async (data) => {
    try {
      // Add your API call here
      const response = await registerDentist(data).unwrap();
      if (
        response.dentist.user.role === "dentist" &&
        !response.dentist.user.isVerified
      ) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-start">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-teal-600 hover:text-teal-900"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Button>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              Dentist Registration
            </CardTitle>
            <CardDescription className="text-lg">
              Join our network of professional dentists and grow your practice
            </CardDescription>
          </CardHeader>

          <CardContent>
            {showModal && <ConfirmAlert onConfirm={handleLogout} />}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Specialization */}
                <FormField
                  control={form.control}
                  name="specialization"
                  rules={{ required: "Specialization is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4" />
                        Specialization
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your specialization" />
                          </SelectTrigger>
                        </FormControl>
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
                          <SelectItem value="endodontics">
                            Endodontics
                          </SelectItem>
                          <SelectItem value="oral-surgery">
                            Oral Surgery
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Experience and NMC Number */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="experience"
                    rules={{
                      required: "Experience is required",
                      min: {
                        value: 0,
                        message: "Experience must be a positive number",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Years of Experience
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nmcNumber"
                    rules={{
                      required: "NMC Number is required",
                      minLength: {
                        value: 5,
                        message: "NMC Number must be at least 5 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          NMC Number
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Qualifications */}
                <FormField
                  control={form.control}
                  name="qualifications"
                  rules={{ required: "Qualifications are required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Qualifications
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., BDS, MDS Orthodontics"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Consulting Fee and Slot Duration */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="consultingFee"
                    rules={{
                      required: "Consulting fee is required",
                      min: {
                        value: 0,
                        message: "Consulting fee must be a positive number",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consulting Fee ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slotDuration"
                    rules={{ required: "Slot duration is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Timer className="h-4 w-4" />
                          Appointment Duration
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Working Hours */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="workingHours.startTime"
                    rules={{ required: "Start time is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workingHours.endTime"
                    rules={{ required: "End time is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your professional journey and expertise..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-mainCustomColor hover:bg-teal-600"
                  disabled={isLoading}
                >
                  <Stethoscope className="mr-2 h-5 w-5" />
                  {isLoading ? "Registering" : "Register as Dentist"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DentistRegistrationForm;

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function ConfirmAlert({ onConfirm }) {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="md:text-3xl">
            Application Under Review
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-800 md:text-base">
            We have received your application. You will now be logged out. For
            any inquiries, feel free to contact us at{" "} <br />
            <strong>contact@smilesync.com</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-mainCustomColor hover:bg-teal-600"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
