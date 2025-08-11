import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Users,
  DollarSign,
  FileText,
  UserCheck,
  Download,
} from "lucide-react";
import { UnassignedBooking, AssignedBooking } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function BookingDetailView({
  booking,
  onBack,
}: {
  booking: UnassignedBooking | AssignedBooking;
  onBack: () => void;
}) {
  // Check if booking is assigned or unassigned
  const isAssigned = "employee" in booking;
  const bookingData = isAssigned ? booking.booking : booking;
  const assignedEmployee = isAssigned ? booking.employee : null;

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/bookings/${bookingData.id}/download-receipt`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download receipt");
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = bookingData.receipt || "receipt";
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Booking Details #{bookingData.id}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={isAssigned ? "default" : "secondary"}>
              {isAssigned ? "Assigned" : "Unassigned"}
            </Badge>
            <span className="text-sm text-gray-500">
              Created on{" "}
              {new Date(
                bookingData.createdAt || Date.now()
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  <p className="text-lg font-semibold">
                    {bookingData.customer?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Customer ID
                  </label>
                  <p className="text-lg">{bookingData.userId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-lg flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {bookingData.customer?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <p className="text-lg">{bookingData.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Country
                  </label>
                  <p className="text-lg">{bookingData.country || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Travel Date
                  </label>
                  <p className="text-lg font-semibold">
                    {new Date(bookingData.travelDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Number of People
                  </label>
                  <p className="text-lg flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {bookingData.numberOfPeople} travelers
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Package ID
                  </label>
                  <p className="text-lg">{bookingData.tourPackageId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Package Name
                  </label>
                  <p className="text-lg">{bookingData.tourPackage?.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Booking Status
                  </label>
                  <Badge
                    variant={
                      bookingData.status === "ASSIGNED"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {bookingData.status || "Pending"}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Special Requests */}
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Special Requests
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    {bookingData.specialRequests || "No special requests"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Information (if assigned) */}
          {isAssigned && assignedEmployee && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Assignment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Assigned Employee
                    </label>
                    <p className="text-lg font-semibold">
                      {assignedEmployee.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Employee Role
                    </label>
                    <p className="text-lg">{assignedEmployee.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Employee Email
                    </label>
                    <p className="text-lg">{assignedEmployee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Assignment Date
                    </label>
                    <p className="text-lg">
                      {new Date(
                        booking.assignedAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Booking Notes If Rejected or Accepted
                    </label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
                        {booking.notes || "No notes"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Payment Information */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${bookingData.totalAmount.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Price</span>
                  <span className="text-sm font-medium">
                    $
                    {(
                      bookingData.totalAmount / bookingData.numberOfPeople
                    ).toFixed(2)}{" "}
                    × {bookingData.numberOfPeople}
                  </span>
                </div>
              </div>

              {/* Payment Receipt */}
              {(bookingData.status === "PAID" ||
                bookingData.status === "ACCEPTED") &&
                bookingData.receipt && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Payment Receipt
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleDownloadReceipt}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </Button>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
        </div>
      </div>
    </div>
  );
}
