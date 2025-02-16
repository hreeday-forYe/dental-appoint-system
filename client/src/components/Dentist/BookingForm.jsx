import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useBookAppointmentMutation,
  useCheckAvailabilityMutation,
} from "@/app/slices/appointmentApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const generateTimeSlots = (
  startTime,
  endTime,
  duration,
  currentTime = null
) => {
  const slots = [];

  // Add 30 minutes to the start time
  let current = new Date(`2024-01-01 ${startTime}`);
  current = new Date(current.getTime() + 30 * 60000); // Add 30 minutes

  // Subtract 30 minutes from the end time
  let end = new Date(`2024-01-01 ${endTime}`);
  end = new Date(end.getTime() - 30 * 60000); // Subtract 30 minutes

  if (currentTime) {
    // Adjust start time if the selected date is today
    current = currentTime;
    // Ensure that the current time is at least 30 minutes after the start time
    const minStartTime = new Date(`2024-01-01 ${startTime}`);
    minStartTime.setMinutes(minStartTime.getMinutes() + 30);
    if (current < minStartTime) {
      current = minStartTime;
    }
  }

  while (current <= end) {
    const timeString = current.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    slots.push(timeString);
    current = new Date(current.getTime() + duration * 60000);
  }

  return slots;
};

const BookingForm = ({ mockDentist }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [dentistAvailable, setDentistAvailable] = useState(false);
  const form = useForm({
    defaultValues: {
      date: addDays(new Date(), 1),
      timeSlot: "",
      reasonForVisit: "",
      paymentMethod: "Cash",
    },
  });
  const [checkAvailability] = useCheckAvailabilityMutation();
  const [bookAppointment, { isLoading, isError }] =
    useBookAppointmentMutation();
  const { id: dentistId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const currentTime = new Date();
    const selectedDate = form.getValues("date");

    // If the selected date is today, update time slots
    if (selectedDate.toDateString() === currentTime.toDateString()) {
      // Generate available slots from the current time to end time
      const updatedSlots = generateTimeSlots(
        mockDentist.workingHours.startTime,
        mockDentist.workingHours.endTime,
        mockDentist.slotDuration,
        currentTime
      );
      setTimeSlots(updatedSlots);
    } else {
      // Generate all available slots if the selected date is not today
      const updatedSlots = generateTimeSlots(
        mockDentist.workingHours.startTime,
        mockDentist.workingHours.endTime,
        mockDentist.slotDuration
      );
      setTimeSlots(updatedSlots);
    }
  }, [form.watch("date")]);

  const onSubmit = async (data) => {
    const formData = { ...data, dentistId };
    try {
      const response = await bookAppointment(formData).unwrap();
      if (response.success) {
        form.reset();
        toast.success("Appointment Booked Successfully");
        navigate('/my-appointments')
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setDentistAvailable(false)
    }
  };

  const onCheckAvailability = async () => {
    try {
      const formData = {
        date: form.getValues("date"),
        time: form.getValues("timeSlot"),
        dentistId: dentistId,
      };
      // Check if the doctor is available on the date or not
      const response = await checkAvailability(formData).unwrap();
      if (response.available) {
        toast.success("Appointment date is available");
        setDentistAvailable(true); // Set dentistAvailable to true
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <Card className="border-none shadow-lg h-3/4">
      <CardHeader>
        {dentistAvailable ? (
          <CardTitle>Book Appointment</CardTitle>
        ) : (
          <CardTitle>Check Availability</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={() =>
                            !dentistAvailable && setIsOpen((prev) => !prev)
                          } // Disable popover if dentist is available
                          disabled={dentistAvailable} // Disable the button if dentist is available
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date || addDays(new Date(), 1));
                          setIsOpen(false); // Close the popover after selecting a date
                        }}
                        disabled={(date) =>
                          date <= new Date() || dentistAvailable
                        } // Disable calendar if dentist is available
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Time Slot</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={dentistAvailable} // Disable the select if dentist is available
                  >
                    <SelectTrigger>
                      <Clock className="h-4 text-gray-400" />
                      <SelectValue placeholder="Select Time Slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot, index) => (
                        <SelectItem key={index} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reasonForVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your symptoms or issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {dentistAvailable ? (
              <Button
                type="submit"
                className="w-full bg-mainCustomColor hover:bg-teal-600 text-white"
              >
                Book Appointment
              </Button>
            ) : (
              <Button
              type="button"
                onClick={onCheckAvailability}
                className="w-full bg-mainCustomColor hover:bg-teal-600 text-white"
              >
                Check Availability
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
