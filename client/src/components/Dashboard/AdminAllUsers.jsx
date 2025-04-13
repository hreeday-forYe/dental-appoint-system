import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  User as UserIcon,
  Edit,
  Ban,
  UserPlus,
  LockOpen,
} from "lucide-react";
import {
  useFetchAllUsersQuery,
  useAdminEditUserMutation,
  useAdminAddUserMutation,
  useAdminBanUserMutation,
} from "@/app/slices/adminApiSlice";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

function AdminAllUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  // Get Users
  const { data, isLoading, isError, refetch } = useFetchAllUsersQuery();
  const users = data?.users;

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add User
  const [adminAddUser, { isLoading: adduserLoading, isError: addUserError }] =
    useAdminAddUserMutation();
  // Edit user
  const [adminEditUser] = useAdminEditUserMutation();
  const [adminBanUser] = useAdminBanUserMutation();

  const handleEditUser = (user) => {
    if (user.role === "dentist") {
      navigate(`/admin/edit-dentist/${user._id}`);
      return;
    }

    setEditUserData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Implement edit user functionality
    try {
      const response = await adminEditUser({
        id: selectedUser._id,
        data: editUserData,
      }).unwrap();
      if (response.success) {
        toast.success("User updated successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowEditDialog(false);
      setSelectedUser(null);
      setEditUserData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  };

  const handleBanUser = (user) => {
    setSelectedUser(user);
    setShowBanDialog(true);
  };

  const confirmBanUser = async () => {
    // Implement ban functionality
    const id = selectedUser._id;
    try {
      const response = await adminBanUser(id).unwrap();
      if (response.success) {
        toast.success(response.message);
        refetch();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowBanDialog(false);
      setSelectedUser(null);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    // Implement add user functionality
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    try {
      const response = await adminAddUser(newUser).unwrap();
      if (response.success) {
        toast.success("User Added Successfully");
        await refetch();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add user");
    } finally {
      setShowAddUserDialog(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isError) {
    return (
      <p className="text-red-500 text-xl">Error while fetching Users...</p>
    );
  }

  return (
    <ScrollArea className="h-[100vh] flex-1">
      <div className="overflow-auto">
        <div className="p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">All Users</h1>
                <p className="text-muted-foreground">
                  Manage and monitor user accounts
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => setShowAddUserDialog(true)}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600"
                >
                  <UserPlus className="h-4 w-4" />
                  Add New User
                </Button>
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
                      <th className="pb-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers?.map((user) => (
                      <tr key={user._id} className="border-b last:border-0">
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
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">
                            {user.phone ? user.phone : "No Contact Details"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.address ? user.address : "Address not found"}
                          </p>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="py-4">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            {user.role !== "admin" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleBanUser(user)}
                                  className="flex items-center gap-1"
                                >
                                  {user.isVerified ? (
                                    <>
                                      <Ban className="h-4 w-4" />
                                      Ban
                                    </>
                                  ) : (
                                    <>
                                      <LockOpen className="h-3 w-3" />
                                      Unban
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Make changes to the fields below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editUserData.name}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, name: e.target.value })
                }
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editUserData.email}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, email: e.target.value })
                }
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editUserData.phone}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, phone: e.target.value })
                }
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editUserData.address}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, address: e.target.value })
                }
                placeholder="123 Main St, City, Country"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isVerified ? "Ban User" : "Unban User"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {selectedUser?.isVerified ? "ban" : "Unban"} {selectedUser?.name}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={confirmBanUser}>
              {selectedUser?.isVerified ? "Ban User" : "Unban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => {
                  setNewUser({ ...newUser, confirmPassword: e.target.value });
                  // Check passwords on every change
                  if (newUser.password !== e.target.value) {
                    setPasswordError("Passwords do not match.");
                  } else {
                    setPasswordError("");
                  }
                }}
                required
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddUserDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                Add User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}

export default AdminAllUsers;
