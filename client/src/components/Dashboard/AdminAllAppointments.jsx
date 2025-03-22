import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  UserCog,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import { useFetchAllAppointmentsQuery } from "@/app/slices/adminApiSlice";
import { ScrollArea } from "../ui/scroll-area";

// Mock data based on your MongoDB schema
// const mockAppointments = [
//   {
//     _id: "1",
//     user: { name: "John Doe", email: "john@example.com" },
//     dentist: {
//       user: { name: "Dr. Sarah Smith", email: "dr.sarah@example.com" },
//     },
//     date: new Date("2025-06-15T10:00:00"),
//     timeSlot: "10:00 AM - 10:30 AM",
//     duration: 30,
//     status: "Pending",
//     reasonForVisit: "Routine Checkup",
//     paymentStatus: "Pending",
//     paymentMethod: "Cash",
//     fees: 1500,
//     createdAt: new Date("2025-06-10T08:30:00"),
//   },
//   {
//     _id: "2",
//     user: { name: "Jane Smith", email: "jane@example.com" },
//     dentist: {
//       user: { name: "Dr. Michael Johnson", email: "dr.michael@example.com" },
//     },
//     date: new Date("2025-06-16T14:00:00"),
//     timeSlot: "2:00 PM - 2:30 PM",
//     duration: 30,
//     status: "Confirmed",
//     reasonForVisit: "Tooth Extraction",
//     paymentStatus: "Paid",
//     paymentMethod: "Khalti",
//     fees: 2500,
//     createdAt: new Date("2025-06-11T09:15:00"),
//   },
//   {
//     _id: "3",
//     user: { name: "Robert Brown", email: "robert@example.com" },
//     dentist: {
//       user: { name: "Dr. Sarah Smith", email: "dr.sarah@example.com" },
//     },
//     date: new Date("2025-06-14T11:30:00"),
//     timeSlot: "11:30 AM - 12:00 PM",
//     duration: 30,
//     status: "Completed",
//     reasonForVisit: "Dental Cleaning",
//     paymentStatus: "Paid",
//     paymentMethod: "Cash",
//     fees: 1800,
//     createdAt: new Date("2025-06-09T14:20:00"),
//   },
//   {
//     _id: "4",
//     user: { name: "Emily Wilson", email: "emily@example.com" },
//     dentist: {
//       user: { name: "Dr. Michael Johnson", email: "dr.michael@example.com" },
//     },
//     date: new Date("2025-06-17T09:00:00"),
//     timeSlot: "9:00 AM - 9:30 AM",
//     duration: 30,
//     status: "Cancelled",
//     cancellationReason: "Patient unavailable",
//     reasonForVisit: "Root Canal",
//     paymentStatus: "Refunded",
//     paymentMethod: "Khalti",
//     fees: 3500,
//     createdAt: new Date("2025-06-12T10:45:00"),
//   },
//   {
//     _id: "5",
//     user: { name: "David Clark", email: "david@example.com" },
//     dentist: {
//       user: { name: "Dr. Sarah Smith", email: "dr.sarah@example.com" },
//     },
//     date: new Date("2025-06-18T13:30:00"),
//     timeSlot: "1:30 PM - 2:00 PM",
//     duration: 30,
//     status: "Pending",
//     reasonForVisit: "Consultation",
//     paymentStatus: "Pending",
//     paymentMethod: "Cash",
//     fees: 1000,
//     createdAt: new Date("2025-06-13T16:10:00"),
//   },
// ];

function AdminAllAppointments() {
  // const [appointments, setAppointments] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useFetchAllAppointmentsQuery();
  const appointments = data?.appointments;

  // const handleStatusChange = (id, newStatus) => {
  //   // In a real application, you would update the status via API
  //   // Example: fetch(`/api/appointments/${id}`, {
  //   //   method: 'PATCH',
  //   //   headers: { 'Content-Type': 'application/json' },
  //   //   body: JSON.stringify({ status: newStatus })
  //   // })

  //   // For demonstration, update the local state
  //   setAppointments(
  //     appointments.map((appointment) =>
  //       appointment._id === id
  //         ? { ...appointment, status: newStatus }
  //         : appointment
  //     )
  //   );
  // };

  // const handlePaymentStatusChange = (id, newStatus) => {
  //   // Similar to status change, but for payment status
  //   setAppointments(
  //     appointments.map((appointment) =>
  //       appointment._id === id
  //         ? { ...appointment, paymentStatus: newStatus }
  //         : appointment
  //     )
  //   );
  // };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const filteredAppointments = appointments?.filter((appointment) => {
    const matchesFilter = filter === "All" || appointment.status === filter;
    const matchesSearch =
      appointment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.dentist.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.reasonForVisit
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-teal-100 text-teal-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock3 className="w-4 h-4" />;
      case "Confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <ScrollArea className="h-[100vh] flex-1">
      <div className="min-h-screen flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between p-8">
          <div>
            <h1 className="text-4xl font-bold">All Appointments</h1>
            <p className="text-muted-foreground">
              Manage and monitor all the appointments
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("All")}
                className={`px-4 py-2 rounded-md ${
                  filter === "All"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("Pending")}
                className={`px-4 py-2 rounded-md ${
                  filter === "Pending"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("Confirmed")}
                className={`px-4 py-2 rounded-md ${
                  filter === "Confirmed"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilter("Completed")}
                className={`px-4 py-2 rounded-md ${
                  filter === "Completed"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("Cancelled")}
                className={`px-4 py-2 rounded-md ${
                  filter === "Cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancelled
              </button>
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white shadow h-screen overflow-hidden sm:rounded-lg">
            {isLoading ? (
              <div className="p-10 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-10 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-4 text-gray-600">No appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Patient
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dentist
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date & Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reason
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Payment
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <UserCog className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.dentist.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.dentist.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              {formatDate(appointment.date)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              {appointment.timeSlot}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.reasonForVisit}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.duration} mins
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                appointment.paymentStatus
                              )}`}
                            >
                              {appointment.paymentStatus}
                            </span>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {appointment.fees} ({appointment.paymentMethod})
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal(appointment)}
                            className="text-teal-600 hover:text-teal-900 mr-3"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Appointment Details Modal */}
        {isModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Appointment Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Patient Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Name:
                        </span>
                        <p className="text-gray-900">
                          {selectedAppointment.user.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Email:
                        </span>
                        <p className="text-gray-900">
                          {selectedAppointment.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Dentist Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Name:
                        </span>
                        <p className="text-gray-900">
                          {selectedAppointment.dentist.user.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Email:
                        </span>
                        <p className="text-gray-900">
                          {selectedAppointment.dentist.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Appointment Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Date:
                        </span>
                        <p className="text-gray-900">
                          {formatDate(selectedAppointment.date)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Time Slot:
                        </span>
                        <p className="text-gray-900">
                          {selectedAppointment.timeSlot}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Duration:
                        </span>
                        <p className="text-gray-900">
                          {selectedAppointment.duration} minutes
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Reason for Visit:
                        </span>
                        <p className="text-gray-900">
                          {selectedAppointment.reasonForVisit}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Created At:
                        </span>
                        <p className="text-gray-900">
                          {formatDate(selectedAppointment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Status & Payment
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Status:
                        </span>
                        <div className="mt-1">
                          <select
                            value={selectedAppointment.status}
                            // onChange={(e) =>
                            //   handleStatusChange(
                            //     selectedAppointment._id,
                            //     e.target.value
                            //   )
                            // }
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      {selectedAppointment.status === "Cancelled" &&
                        selectedAppointment.cancellationReason && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Cancellation Reason:
                            </span>
                            <p className="text-gray-900">
                              {selectedAppointment.cancellationReason}
                            </p>
                          </div>
                        )}
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Payment Status:
                        </span>
                        <div className="mt-1">
                          <select
                            value={selectedAppointment.paymentStatus}
                            // onChange={(e) =>
                            //   handlePaymentStatusChange(
                            //     selectedAppointment._id,
                            //     e.target.value
                            //   )
                            // }
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Payment Method:
                        </span>
                        <p className="text-gray-900">
                          {selectedAppointment.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Fees:
                        </span>
                        <p className="text-gray-900">
                          Rs. {selectedAppointment.fees}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, you would save changes to the API here
                      closeModal();
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default AdminAllAppointments;
