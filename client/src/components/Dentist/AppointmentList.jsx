import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";



export function AppointmentList({ appointments, title }) {
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No appointments scheduled
                </p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between space-x-4 rounded-xl border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2">
                    <p className="font-semibold">{appointment.patientName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.time}
                      </div>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
