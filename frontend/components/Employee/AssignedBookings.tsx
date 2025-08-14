import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { MoreHorizontal, Eye, Calendar, Users, DollarSign } from "lucide-react";
import BookingDetailView from "./BookingDetailView";

// Types
import type { AssignedBooking } from "@/lib/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface DetailedAssignedBooking extends AssignedBooking {
  booking: AssignedBooking["booking"] & {
    tourPackage: AssignedBooking["booking"]["tourPackage"] & {
      locations: Array<{
        id: number;
        name: string;
        description: string;
        image: string;
      }>;
      tourPlanDays: Array<{
        id: number;
        title: string;
        activity: string;
        description: string;
        endOfTheDay: string;
      }>;
    };
  };
}

export default function EmployeeAssignedBookings() {
  const [assignedBookings, setAssignedBookings] = useState<AssignedBooking[]>(
    []
  );
  const [selectedBooking, setSelectedBooking] =
    useState<DetailedAssignedBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch assigned bookings
  useEffect(() => {
    const fetchAssignedBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${apiBaseUrl}/bookings/employee/assigned-bookings`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned bookings");
        }

        const data = await response.json();
        console.log("Assigned Bookings Data:", data);
        setAssignedBookings(data || []);
      } catch (error) {
        console.error("Error fetching assigned bookings:", error);
        setAssignedBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedBookings();
  }, []);

  // Handle view details
  const handleViewDetails = async (bookingId: number) => {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(
        `${apiBaseUrl}/bookings/employee/${bookingId}/details`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch booking details");
      }

      const data = await response.json();

      console.log("Booking Details Data:", data);
      setSelectedBooking(data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PAID":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // If detailed booking is selected, show detailed view
  if (selectedBooking) {
    return (
      <BookingDetailView
        booking={selectedBooking}
        onBack={() => setSelectedBooking(null)}
      />
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Assigned Bookings
        </h1>
        <p className="text-gray-600 mt-2">
          Manage bookings assigned to you by the admin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Assigned
                </p>
                <p className="text-2xl font-bold">{assignedBookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    assignedBookings.filter(
                      (b) => b.booking.status === "ACCEPTED"
                    ).length
                  }
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    assignedBookings.filter(
                      (b) => b.booking.status === "REJECTED"
                    ).length
                  }
                </p>
              </div>
              <Users className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Bookings</CardTitle>
          <CardDescription>
            View and manage bookings assigned to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : assignedBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings assigned to you yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Travel Date</TableHead>
                    <TableHead>People</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedBookings.map((assignedBooking) => (
                    <TableRow key={assignedBooking.id}>
                      <TableCell className="font-medium">
                        #{assignedBooking.booking.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {assignedBooking.booking.customer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {assignedBooking.booking.customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {assignedBooking.booking.tourPackage?.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {assignedBooking.booking.tourPackage?.country}
                          </p>
                        </div>
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
                        ${assignedBooking.booking.totalAmount.toLocaleString()}
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
                      <TableCell>
                        {new Date(
                          assignedBooking.assignedAt
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewDetails(assignedBooking.booking.id)
                              }
                              disabled={isLoadingDetails}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
