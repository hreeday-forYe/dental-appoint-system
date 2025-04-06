import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  ArrowUpDown,
  DollarSign,
  Filter,
  IndianRupee,
} from 'lucide-react';
import { useFetchAllPaymentsQuery } from '@/app/slices/adminApiSlice';

const AdminAllPayments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const {data: paymentData}= useFetchAllPaymentsQuery();

  const payments = Array.isArray(paymentData?.payments) ? paymentData.payments : [];
  const recentPayments = [...payments].reverse().slice(0, 4);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10';
      case 'Failed':
        return 'bg-red-50 text-red-700 ring-1 ring-red-600/10';
      default:
        return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch =
        payment.paidBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.paidBy.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.pidx.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate total amount for filtered payments
  const totalAmount = filteredPayments.reduce((sum, payment) => {
    return payment.status === 'Paid' ? sum + payment.amount : sum;
  }, 0);

  return (
    <div className="flex-1 min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-900/5">
              <CreditCard className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
              <p className="text-sm text-gray-500">Monitor and track all payment transactions</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-teal-50 p-2">
                <IndianRupee className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-lg font-semibold text-gray-900">
                  Rs. {totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">Patient</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">Amount</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">Method</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">Transaction ID</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                      <span className="text-xs font-medium text-gray-500 uppercase">Date</span>
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{payment.paidBy.name}</div>
                          <div className="text-sm text-gray-500">{payment.paidBy.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{payment.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-gray-500">{payment.pidx}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(payment.createdAt), 'hh:mm a')}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No payments found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Payment records will appear here once transactions are made'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAllPayments;