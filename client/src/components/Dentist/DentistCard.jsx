import React from "react";
import {
  Calendar,
  Clock,
  GraduationCap,
  Stethoscope,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DentistCard({ dentist }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full sm:w-[48%] lg:w-[30%] p-4">
      <div className="flex items-start space-x-4">
        <img
          src={
            dentist.user.avatar?.url ||
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          }
          alt={dentist.user.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {dentist.user.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span>{dentist.specialization}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>{dentist.experience} yrs experience</span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>
              {dentist.workingHours.startTime} - {dentist.workingHours.endTime}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{dentist.workingHours.days.slice(0, 3).join(", ")}...</span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-600 line-clamp-2">{dentist.bio}</p>

      <div className="mt-2 flex flex-wrap gap-1 text-xs">
        {dentist.qualifications.map((qualification, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
          >
            {qualification}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-gray-500">
          Consulting fees :
          <span className="text-lg font-semibold text-green-600">
            Rs.{dentist.consultingFee}
          </span>
        </p>
        <Link to={`/dentist/${dentist._id}`}>
        <button className="bg-teal-500 text-white px-3 py-2 rounded-md text-sm hover:bg-teal-700 transition">
          Book Appointment
        </button>
        </Link>
      </div>
    </div>
  );
}
