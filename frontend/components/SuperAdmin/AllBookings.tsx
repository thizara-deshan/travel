import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Employee, UnassignedBooking, AssignedBooking } from "@/lib/types";

import { BookingDetailView } from "./BookingDetailView";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

interface AllBookingsProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  employeeData: Employee[] | null;
}

export default function AllBookings({ user, employeeData }: AllBookingsProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [unAssignedBookings, setUnAssignedBookings] = useState<
    UnassignedBooking[] | null
  >(null);
  const [assignedBookings, setAssignedBookings] = useState<
    AssignedBooking[] | null
  >(null);

  // New state for detailed view
  const [detailedBooking, setDetailedBooking] = useState<
    UnassignedBooking | AssignedBooking | null
  >(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  const handleAssign = (bookingId: number) => {
    setSelectedBooking(bookingId);
    setAssignDialogOpen(true);
    console.log("Selected booking for assignment:", bookingId);
    console.log("Available employees:", employeeData);
  };

  const handleRemove = (bookingId: number) => {
    setSelectedBooking(bookingId);
    setRemoveDialogOpen(true);
  };

  // New function to handle view details
  const handleViewDetails = (booking: UnassignedBooking | AssignedBooking) => {
    setDetailedBooking(booking);
    setShowDetailedView(true);
  };

  const confirmAssignment = async () => {
    if (selectedEmployee && selectedBooking) {
      try {
        const response = await fetch(
          `${apiBaseUrl}/bookings/${selectedBooking}/assign`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ employeeId: selectedEmployee }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to assign booking");
        }
        fetchAssignedBookings();
        console.log(
          `Assigned booking ${selectedBooking} to employee ${selectedEmployee}`
        );
        setUnAssignedBookings(
          (prevBookings) =>
            prevBookings?.filter((booking) => booking.id !== selectedBooking) ||
            null
        );
      } catch (error) {
        console.error("Error assigning booking:", error);
      }
      setAssignDialogOpen(false);
      setSelectedEmployee("");
      setSelectedBooking(null);
    }
  };

  const confirmRemoval = async () => {
    if (selectedBooking) {
      try {
        const response = await fetch(
          `${apiBaseUrl}/bookings/${selectedBooking}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete booking");
        }
        setUnAssignedBookings(
          (prevBookings) =>
            prevBookings?.filter((booking) => booking.id !== selectedBooking) ||
            null
        );
      } catch (error) {
        console.error("Error removing booking:", error);
      }
      console.log(`Removed booking ${selectedBooking}`);
      setRemoveDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  useEffect(() => {
    const fetchUnassignedBookings = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/bookings/get-all-unassigned-bookings`,
          {
            credentials: "include",
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch unassigned bookings");
        }

        const data = await response.json();
        setUnAssignedBookings(data);
      } catch (error) {
        console.error("Error fetching unassigned bookings:", error);
      }
    };

    fetchUnassignedBookings();
  }, []);

  const fetchAssignedBookings = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/bookings/get-all-assigned-bookings`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assigned bookings");
      }

      const data = await response.json();
      console.log("Assigned bookings data:", data);
      setAssignedBookings(data);
    } catch (error) {
      console.error("Error fetching assigned bookings:", error);
    }
  };

  useEffect(() => {
    fetchAssignedBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PAID":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // If detailed view is active, show the detailed component
  if (showDetailedView && detailedBooking) {
    return (
      <BookingDetailView
        booking={detailedBooking}
        onBack={() => {
          setShowDetailedView(false);
          setDetailedBooking(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Manage Your Bookings</h1>
        <p className="text-blue-100 mb-6">
          Welcome back, {user?.name}. Ready to manage your bookings? assign
          bookings to employees and manage them efficiently.
        </p>
      </div>

      {/* Unassigned Bookings Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-xl">Unassigned Bookings</CardTitle>
              <CardDescription>
                Here you can view and manage all unassigned bookings. Assign
                them to employees or remove them as needed.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Special Requests
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Customer ID
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Package ID
                  </TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unAssignedBookings
                  ?.filter((booking) => booking.status !== "CANCELLED")
                  .map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.id}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.travelDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{booking.numberOfPeople}</TableCell>
                      <TableCell>${booking.totalAmount}</TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[200px]">
                        <div
                          className="truncate"
                          title={booking.specialRequests ?? undefined}
                        >
                          {booking.specialRequests}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {booking.customer.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {booking.tourPackageId}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(booking)}
                              className="cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAssign(booking.id)}
                              className="cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                            >
                              Assign
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemove(booking.id)}
                              className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Bookings Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-xl">Assigned Bookings</CardTitle>
              <CardDescription>
                Here you can view all bookings that have been assigned to
                employees.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Customer ID
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Package ID
                  </TableHead>
                  <TableHead>Assigned Employee</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedBookings?.map((assignedBooking) => (
                  <TableRow key={assignedBooking.id}>
                    <TableCell className="font-medium">
                      {assignedBooking.booking.id}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        assignedBooking.booking.travelDate
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {assignedBooking.booking.numberOfPeople}
                    </TableCell>
                    <TableCell>
                      ${assignedBooking.booking.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(
                          assignedBooking.booking.status
                        )}
                      >
                        {assignedBooking.booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {assignedBooking.booking.userId}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {assignedBooking.booking.tourPackageId}
                    </TableCell>
                    <TableCell>{assignedBooking.employee.name}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(assignedBooking)}
                            className="cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                          >
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cancelled Bookings Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-xl">Cancelled Bookings</CardTitle>
              <CardDescription>
                Here you can view all bookings that have been cancelled.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Customer ID
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Package ID
                  </TableHead>

                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unAssignedBookings
                  ?.filter((booking) => booking.status === "CANCELLED")
                  .map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>
                        {" "}
                        {new Date(booking.travelDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{booking.numberOfPeople}</TableCell>
                      <TableCell>${booking.totalAmount}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {booking.customer.id}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {booking.tourPackage?.id}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(booking)}
                              className="cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                            >
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Assign Booking</DialogTitle>
            <DialogDescription>
              Select an employee to assign booking {selectedBooking} to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="employee" className="text-sm font-medium">
                Select Employee
              </label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employeeData?.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id.toString()}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {employee.role}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAssignment}
              disabled={!selectedEmployee}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Removal Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove booking{" "}
              {selectedBooking} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoval}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
