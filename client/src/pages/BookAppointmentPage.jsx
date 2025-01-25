"use client";

import { useState } from "react";
// import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import appointmentImage from "../assets/images/appointment2.jpg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export default function BookAppointmentPage() {
  const [date, setDate] = useState();

  const doctors = [
    {
      id: 1,
      name: "DR. Brent",
      specialty: "General Dentist & Cosmetic Dentist",
    },
    {
      id: 2,
      name: "DR. Ashish J. Vashi",
      specialty: "Aesthetic & Implant Dentistry",
    },
    {
      id: 3,
      name: "Dr. James Connors",
      specialty: "Dentist & Oral Surgeon",
    },
  ];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Appointment Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Book an Appointment</CardTitle>
              <CardDescription>
                Schedule your dental appointment with our specialists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doctor Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Doctor</label>
                  <Select className="focus:border-teal-600">
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem
                          key={doctor.id}
                          value={doctor.id.toString()}
                        >
                          <div>
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {doctor.specialty}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Time</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose appointment time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Issues */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Additional Issues
                  </label>
                  <Textarea
                    placeholder="Please describe any specific dental issues or concerns..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-mainCustomColor hover:bg-teal-600"
                >
                  Book Appointment
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Img Section */}
          <section className="py-4">
            <div
              className={`relative hidden lg:block h-[600px] w-full rounded-md overflow-hidden`}
              style={{
                backgroundImage: `url(${appointmentImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Expert Dental Care
                </h2>
                <p className="text-white/90">
                  Our skilled dentists use advanced techniques and
                  state-of-the-art equipment to ensure your comfort and provide
                  the highest quality dental care.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
