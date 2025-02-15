import React from 'react';
import { Calendar, Clock, GraduationCap, Stethoscope, DollarSign } from 'lucide-react';



export default function DentistCard({ dentist }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={dentist.user.avatar?.url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
            alt={dentist.user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{dentist.user.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">{dentist.specialization}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">{dentist.experience} years experience</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-lg font-semibold text-green-600">${dentist.consultingFee}</span>
            </div>
            <div className="mt-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {dentist.workingHours.startTime} - {dentist.workingHours.endTime}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {dentist.workingHours.days.join(', ')}
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-gray-600 line-clamp-2">{dentist.bio}</p>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {dentist.qualifications.map((qualification, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {qualification}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}