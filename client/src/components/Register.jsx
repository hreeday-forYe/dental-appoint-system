import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"; // Adjust import based on your file structure
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "../app/slices/userApiSlice";
import { toast } from "react-toastify";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password"); // Watch the password field for validation

  const navigate = useNavigate();
  const [storeRegister, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data) => {
    try {
      const res = await storeRegister(data).unwrap();
      // dispatch(setCredentials(res.data));

      navigate("/activate", {
        state: { activationToken: res.activationToken },
      });
      toast.success("Please check your mail");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white border-red-500 rounded-lg shadow-lg overflow-hidden">
        <Card className="flex-1 border-none shadow-none">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Enter your details to register</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your name"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    validate: {
                      matchPattern: (value) =>
                        /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/gim.test(value) ||
                        "Invalid email address",
                    },
                  })}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
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
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col  space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-mainCustomColor hover:bg-teal-600"
              >
                {isLoading ? "Submitting..." : "Register"}
              </Button>
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </CardFooter>
          </form>
        </Card>
        <div className="hidden md:block flex-1 bg-black">
          <img
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Registration illustration"
            width={600}
            height={800}
            className="object-cover w-full opacity-80 h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
