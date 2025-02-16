import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { DentistCard } from '../components';
import { Input } from '@/components/ui/input';
import { useGetAllDentistsQuery } from '@/app/slices/dentistApiSlice';
// import type { Dentist } from '../types';

// Mock data - Replace with actual API call
const mockDentists = [
  {
    _id: '1',
    user: {
      _id: 'u1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: 1234567890,
      address: '123 Medical Center',
      role: 'dentist',
      avatar: {
        public_id: 'avatar1',
        url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      }
    },
    specialization: 'Orthodontist',
    experience: 8,
    nmcNumber: 'NMC123456',
    qualifications: ['BDS', 'MDS - Orthodontics'],
    consultingFee: 150,
    slotDuration: 30,
    workingHours: {
      startTime: '09:00',
      endTime: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    bio: 'Specialized in treating misaligned teeth and jaws. Experienced in both traditional braces and Invisalign treatments.'
  },
  // Add more mock dentists as needed
];

const specializations = [
  'all',
  'orthodontist',
  'periodontist',
  'endodontist',
  'oral surgeon',
  'general dentist'
];

export default function FindDoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [sortBy, setSortBy] = useState('experience');
  const {data, isLoading} = useGetAllDentistsQuery()
  const dentists = data?.dentists || mockDentists

  const filteredDentists = dentists?.filter(dentist => {
    const matchesSearch = dentist.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dentist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All' || 
      dentist.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  }).sort((a, b) => {
    if (sortBy === 'experience') {
      return b.experience - a.experience;
    }
    return a.consultingFee - b.consultingFee;
  });

  if (isLoading) {
    return <p className="text-center py-12 text-gray-500 text-lg">Loading dentists...</p>;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Dental Specialist</h1>
          <p className="text-md text-gray-600">
            Connect with experienced dentists and book your appointment today
          </p>
        </div>

        <div className="mb-8 space-y-2">
          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name or specialization..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="experience">Sort by Experience</option>
                <option value="fee">Sort by Fee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className=" flex flex-wrap justify-start items-center gap-7">
          {filteredDentists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No dentists found matching your criteria</p>
            </div>
          ) : (
            filteredDentists.map(dentist => (
              <DentistCard key={dentist._id} dentist={dentist} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}