import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { setCredentials } from "../app/slices/authSlice";
import { useLoginMutation } from "../app/slices/userApiSlice";
import { toast } from "react-toastify";
import loginImage from "../assets/images/login.png";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [storeLogin, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const onSubmit = async (data) => {
    try {
      const res = await storeLogin(data).unwrap();
      console.log(res.user);
      dispatch(setCredentials({ user: res.user }));

      if (res?.user?.role === "dentist") {
        console.log("Iam here dentist");
        navigate("/dentist");
      } else if (res?.user?.role === "admin") {
        console.log("I am here admin");
        navigate("/admin");
        console.log("Navigation completed");
      } else if (res?.user?.role === "user") {
        // For regular users, use the redirect parameter if it exists and is valid
        console.log("Iam here user");
        navigate(redirect);
      }
      toast.success("Login Successfull");
    } catch (error) {
      toast.error(error.data.message || "Login failed try again later");
    }
  };

  // const placeholder = false
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-4xl bg-white border-red-500 rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block flex-1 bg-black">
          <img
            src={loginImage}
            alt="Registration illustration"
            width={600}
            height={800}
            className="object-cover w-full opacity-80 h-full"
          />
        </div>
        <Card className="flex-1 flex flex-col justify-center  shadow-none">
          <CardHeader>
            <CardTitle>Login to your Account</CardTitle>
            <CardDescription>Enter your details to login</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
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
                  })}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
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
                {isLoading ? "Submitting..." : "Login"}
              </Button>

              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => navigate(`/register?redirect=${redirect}`)}
                >
                  Signup
                </span>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
