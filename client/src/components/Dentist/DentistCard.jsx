import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  GraduationCap,
  Stethoscope,
  IndianRupee,
  MapPin,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";


export default function DentistCard({ dentist }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatWorkingDays = (days) => {
    if (days.length === 5 && days.every((day, i) => day === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][i])) {
      return "Mon - Fri";
    }
    return days.map(day => day.slice(0, 3)).join(", ");
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg bg-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-24 w-24 rounded-xl">
            <AvatarImage
              src={
                dentist.user.avatar?.url ||
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              }
              alt={dentist.user.name}
              className="object-cover"
            />
            <AvatarFallback className="text-xl bg-primary/10">
              {getInitials(dentist.user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-xl text-foreground">
                  {dentist.user.name}
                </h3>
                {/* <p className="text-sm text-muted-foreground">
                  Age: {getAge(dentist.user.dob)} years
                </p> */}
              <Badge variant="outline" className="text-primary border-primary">
                NMC: {dentist.nmcNumber}
              </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <span className="capitalize text-sm">{dentist.specialization}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Specialization</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{dentist.experience} years exp.</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Years of Experience</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{dentist.slotDuration} min slot</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Consultation Duration</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                <span>{dentist.user.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <span>{dentist.workingHours.startTime} - {dentist.workingHours.endTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatWorkingDays(dentist.workingHours.days)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {dentist.qualifications.map((qualification, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
              >
                <GraduationCap className="h-3 w-3 mr-1" />
                {qualification}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4 text-green-600" />
            <span className="text-xl font-semibold text-green-600">
              {dentist.consultingFee}
            </span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Per Visit
          </Badge>
        </div>

        <Link to={`/dentist/${dentist._id}`}>
          <Button size="lg" className="bg-mainCustomColor hover:bg-teal-600">
            Book Appointment
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}