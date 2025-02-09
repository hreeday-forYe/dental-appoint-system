import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User as UserIcon } from "lucide-react";

function AdminAllUsers() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      phone: "1234567890",
      address: "123 Main St",
      isVerified: true,
      createdAt: "2024-03-01",
      avatar: { url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop" }
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      phone: "0987654321",
      address: "456 Oak Ave",
      isVerified: false,
      createdAt: "2024-03-05",
      avatar: null
    },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">All Users</h1>
              <p className="text-muted-foreground">Manage and monitor user accounts</p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-4 text-left">User</th>
                    <th className="pb-4 text-left">Contact</th>
                    <th className="pb-4 text-left">Role</th>
                    <th className="pb-4 text-left">Status</th>
                    <th className="pb-4 text-left">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar?.url ? (
                            <img
                              src={user.avatar.url}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm">{user.phone}</p>
                        <p className="text-sm text-muted-foreground">{user.address}</p>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {user.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminAllUsers;