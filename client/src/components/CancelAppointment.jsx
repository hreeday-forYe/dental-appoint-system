import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useCancelAppointmentMutation } from "@/app/slices/appointmentApiSlice";
// import { useToast } from "@/hooks/use-toast";

const CancelAppointment = ({
  appointmentId,
  onCancelSuccess,
  className,
  trigger,
}) => {
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cancelAppointment] = useCancelAppointmentMutation();
  // const { toast } = useToast();

  const handleCancelAppointment = async () => {
    try {
      setIsLoading(true);
      const response = await cancelAppointment({ appointmentId, reason }).unwrap();
      if (response.success) {
        toast.success({
          title: "Appointment Cancelled",
          description: "Your appointment has been successfully cancelled.",
        });
        setIsConfirmOpen(false);
        setIsReasonOpen(false);
        setReason("");
        onCancelSuccess?.(true);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* First Dialog - Reason Input */}
      <Dialog open={isReasonOpen} onOpenChange={setIsReasonOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="destructive" size="sm" className={className}>
              Cancel Appointment
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling your appointment. This
              helps us improve our services.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter your reason here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReasonOpen(false)}>
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!reason.trim()) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Please provide a reason for cancellation.",
                  });
                  return;
                }
                setIsReasonOpen(false);
                setIsConfirmOpen(true);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second Dialog - Final Confirmation */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Cancellation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-4 rounded-lg mt-2">
            <p className="text-sm font-medium">Reason for cancellation:</p>
            <p className="text-sm mt-1 text-muted-foreground">{reason}</p>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmOpen(false);
                setIsReasonOpen(true);
              }}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
              disabled={isLoading}
            >
              {isLoading ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CancelAppointment;
