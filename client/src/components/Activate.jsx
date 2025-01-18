import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useActivateMutation } from "../app/slices/userApiSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { toast } from "react-toastify";

const Activate = () => {
  const { control, handleSubmit } = useForm();

  const location = useLocation();
  const activationToken = location.state?.activationToken;
  const [activateAccount, { isLoading }] = useActivateMutation();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    if (!activationToken) {
      alert("Activation token is missing.");
      return;
    }

    // Combine the activation code from user input and token from location state
    const payload = {
      activation_code: data.otp,
      activation_token: activationToken,
    };
    try {
      const response = await activateAccount(payload).unwrap();
      if (response.success) {
        navigate("/register-success");
        // Perform further actions like redirecting to login
        toast.success("Registration was successfull");
      }
    } catch (err) {
      const errorMessage =
        err?.data?.message.charAt(0).toUpperCase() +
        err?.data?.message.slice(1);
      toast.error(errorMessage || "Activation failed. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center flex flex-col items-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={100}
              height={100}
              viewBox="0 0 24 24"
              fill="none"
              stroke="teal"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-check"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="m9 12 2 2 4-4" />
            </svg>

            <h1 className="text-3xl font-bold text-gray-900">
              Activate Your Account
            </h1>
            <p className="text-gray-600 mt-2">
              Enter the code we sent to your email to activate your account.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">
                Enter your activation code
              </CardTitle>
              <CardDescription className="text-center">
                Check your inbox for the 6-digit code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Mail className="text-teal-500  w-8 h-8" />
                <form onSubmit={handleSubmit(onSubmit)} id="activationForm">
                  <div className="flex justify-center">
                    <Controller
                      name="otp"
                      control={control}
                      rules={{
                        required: "OTP is required",
                        validate: (value = "") =>
                          value.length === 6 || "OTP must be exactly 6 digits",
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <div>
                          <InputOTP
                            maxLength={6}
                            onChange={onChange}
                            value={value || ""}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                          {error && (
                            <p className="error-message text-red-500">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  {/* <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting" : "Submit"}
                    </Button>
                  </CardFooter> */}
                </form>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-mainCustomColor hover:bg-teal-600"
                form="activationForm"
                disabled={isLoading}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {isLoading ? "Submitting" : "Activate"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Resend Code
              </a>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center text-sm text-gray-500">
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>
              Your account is protected by industry-standard encryption
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Activate;
