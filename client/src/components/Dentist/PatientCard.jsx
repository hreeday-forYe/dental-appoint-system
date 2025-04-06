import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mail, Phone } from "lucide-react";

export function PatientCard({ patient }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <img
              src={
                patient.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  patient.name
                )}&background=random`
              }
              alt={patient.name}
              className="object-cover"
            />
          </Avatar>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{patient.email}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Last visit: {formatDate(patient.lastAppointment)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
