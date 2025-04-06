import React from "react";
import { format } from "date-fns";
import { useGetUserAppointmentsQuery } from "@/app/slices/appointmentApiSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Stethoscope,
  User2,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import CancelAppointment from "@/components/CancelAppointment";
import {
  useInitiatePaymentMutation,
  useCompletePaymentQuery,
} from "@/app/slices/appointmentApiSlice";
import { toast } from "react-toastify";
import { useEffect, useRef, useState, useCallback } from "react";

const AppointmentCard = ({ appointment, refetch }) => {
  const statusColors = {
    Pending:
      "bg-yellow-100 text-yellow-800 hover:text-yellow-800 hover:bg-yellow-200 text-sm",
    Confirmed:
      "bg-blue-100 text-blue-800 hover:text-blue-800 hover:bg-blue-200 text-sm",
    Completed:
      "bg-emerald-100 text-emerald-800 hover:text-emerald-800 hover:bg-emerald-200 text-sm",
    Cancelled:
      "bg-red-100 text-red-800 hover:text-cancelled-800 hover:bg-cancelled-100 text-sm",
  };

  const paymentStatusColors = {
    Pending: "bg-orange-100 text-orange-800",
    Completed: "bg-emerald-100 text-emerald-800",
    Failed: "bg-red-100 text-red-800",
  };
  const [payment, { isLoading }] = useInitiatePaymentMutation();
  const [paymentResult, setPaymentResult] = useState(null);
  const [pidx, setPidx] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const hasHandledPayment = useRef(false);

  const handleCancelSuccess = () => {
    refetch();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pidxFromUrl = urlParams.get("pidx");
    if (pidxFromUrl) {
      setPidx(pidxFromUrl);
    }
  }, []);

  const {
    data: paymentData,
    isLoading: verifyLoading,
    error: verifyError,
  } = useCompletePaymentQuery(pidx, {
    skip: !pidx,
  });

  const onSubmit = async (data) => {
    try {
      const res = await payment(data).unwrap();
      if (res.success) {
        window.location.href = res?.payment_url;
      }
    } catch (error) {
      toast.error(error?.data?.message || "Payment Initiation Failed");
    }
  };

  useEffect(() => {
    const handlePayment = async () => {
      if (!hasHandledPayment.current && paymentData) {
        hasHandledPayment.current = true;

        setPaymentResult(paymentData);

        if (paymentData.success) {
          // TODO: HIT another API TO make the data base call possible
          // const response = await manageApplicationStatus({purchaseOrderId: appointment._id, })
          setShowSuccessPopup(true);
        } else {
          toast.error(paymentData.message || "Payment Verification Failed");
        }
      }

      if (!hasHandledPayment.current && verifyError) {
        hasHandledPayment.current = true;

        setPaymentResult({
          success: false,
          message: verifyError?.data?.message || "Verification failed",
        });
        toast.error(verifyError?.data?.message || "Verification failed");
      }
    };
    handlePayment()
  }, [paymentData, verifyError]);

  const togglePopup = useCallback(() => {
    setShowSuccessPopup((prev) => !prev);
  }, []);

  const resetForm = useCallback(() => {
    setShowSuccessPopup(false);
    hasHandledPayment.current = false;
    refetch();
    window.history.pushState({}, document.title, "/my-appointments");
  }, [refetch]);

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage
              src={
                appointment.dentist.user.avatar?.url ||
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              }
              alt={appointment.dentist.user.name}
            />
            <AvatarFallback>
              {appointment.dentist.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Dr. {appointment.dentist.user.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {appointment.dentist.specialization} •{" "}
                  {appointment.dentist.qualifications.join(", ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  className={`${statusColors[appointment.status]} hover:none`}
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">
                  {format(new Date(appointment.date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {appointment.timeSlot} ({appointment.duration} mins)
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span className="text-md text-green-800">
                  Rs. {appointment.fees} • {appointment.paymentMethod}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Stethoscope className="h-4 w-4" />
                <span
                  className="text-sm line-clamp-1"
                  title={appointment.reasonForVisit}
                >
                  {appointment.reasonForVisit}
                </span>
              </div>
            </div>
            <div className="flex gap-6">
              {appointment.paymentStatus === "Pending" &&
                appointment.status === "Confirmed" && (
                  <button
                    onClick={(e) =>
                      onSubmit({
                        amount: appointment.fees,
                        purchaseOrderId: appointment._id,
                        purchaseOrderName: appointment.dentist.user.name,
                      })
                    }
                    className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Pay Now
                  </button>
                )}

              {appointment.paymentStatus === "Pending" &&
                appointment.status === "Pending" && (
                  <div className="mt-4 flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg">
                    <Clock3 className="h-5 w-5 animate-pulse" />
                    <div>
                      <p className="font-medium">Awaiting Confirmation</p>
                      <p className="text-sm text-yellow-600">
                        Your appointment request is being reviewed
                      </p>
                    </div>
                  </div>
                )}

              {appointment.paymentStatus === "Paid" && (
                <div className="mt-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg">
                  <ShieldCheck className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Payment Confirmed</p>
                    <p className="text-sm text-emerald-600">
                      Your appointment is secured and ready
                    </p>
                  </div>
                </div>
              )}

              {appointment.status !== "Cancelled" &&
                appointment.status !== "Completed" &&
                appointment.paymentStatus !== "Paid" && (
                  <CancelAppointment
                    appointmentId={appointment._id}
                    onCancelSuccess={handleCancelSuccess}
                    className="mt-5 bg-red-100 text-red-800 hover:bg-red-300 font-semibold rounded-lg transition"
                    trigger={
                      <Button
                        variant="ghost"
                        className="mt-4 bg-red-100 text-red-800 hover:bg-red-300 font-semibold rounded-lg transition"
                      >
                        Cancel Appointment
                      </Button>
                    }
                  />
                )}
            </div>
          </div>
        </div>
      </CardContent>
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Payment Successful!
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>Your payment has been processed successfully.</p>

                {paymentResult?.paymentInfo && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg text-left">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Transaction Details:
                    </h4>
                    <div className="space-y-1">
                      <p className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        <span>
                          NPR {paymentResult.paymentInfo.total_amount}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Transaction ID:</span>
                        <span className="font-mono">
                          {paymentResult.paymentInfo.transaction_id}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={resetForm}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

const MyAppointmentsPage = () => {
  const { data, isLoading, refetch } = useGetUserAppointmentsQuery();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading appointments...</div>
      </div>
    );
  }

  const appointments = data?.appointments || [];
  const upcoming = appointments.filter(
    (apt) => new Date(apt.date) >= new Date()
  );
  const past = appointments.filter((apt) => new Date(apt.date) < new Date());

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <User2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="upcoming" className="text-base">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="text-base">
              Past ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length > 0 ? (
              upcoming.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  refetch={refetch}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No upcoming appointments
                </h3>
                <p className="text-gray-500 mt-1">
                  Schedule your next visit with one of our dentists.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length > 0 ? (
              past.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No past appointments
                </h3>
                <p className="text-gray-500 mt-1">
                  Your appointment history will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
