// components/BookingDetailView.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

import type { DetailedAssignedBooking } from "./AssignedBookings";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

interface BookingDetailViewProps {
  booking: DetailedAssignedBooking;
  onBack: () => void;
}

function BookingDetailView({ booking, onBack }: BookingDetailViewProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [notes, setNotes] = useState("");

  const handleStatusUpdate = async (status: "ACCEPTED" | "REJECTED") => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/employee/${booking.booking.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
            notes: notes.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      window.location.reload(); // Reload the page to reflect changes
      const data = await response.json();
      console.log("Booking status updated:", data);
      onBack(); // Navigate back to the bookings list

      // Show success message (you can add toast here)
      console.log(`Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      // Show error message (you can add toast here)
    } finally {
      setIsUpdating(false);
      setShowAcceptDialog(false);
      setShowRejectDialog(false);
      setNotes("");
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/bookings/${booking.booking.id}/download-receipt`,
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
      a.download = booking.booking.receipt || "receipt";
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };

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

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Booking Details #{booking.booking.id}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(booking.booking.status)}>
                {booking.booking.status}
              </Badge>
              <span className="text-sm text-gray-500">
                Assigned on {new Date(booking.assignedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(booking.booking.status === "ASSIGNED" ||
          booking.booking.status === "PAID") && (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAcceptDialog(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={isUpdating}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button
              onClick={() => setShowRejectDialog(true)}
              variant="destructive"
              disabled={isUpdating}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
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
                  <Label className="text-sm font-medium text-gray-600">
                    Full Name
                  </Label>
                  <p className="text-lg font-semibold">
                    {booking.booking.customer.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Email
                  </Label>
                  <p className="text-lg">{booking.booking.customer.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Customer ID
                  </Label>
                  <p className="text-lg">#{booking.booking.customer.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Phone Number
                  </Label>
                  <p className="text-lg">{booking.booking.phone || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Country
                  </Label>
                  <p className="text-lg">{booking.booking.country || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {booking.booking.tourPackage.title}
                  </h3>
                  <p className="text-gray-600">
                    {booking.booking.tourPackage.country}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {booking.booking.tourPackage.packageType}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${booking.booking.totalAmount.toLocaleString()}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Travel Date</span>
                  <span className="text-sm font-medium">
                    {new Date(booking.booking.travelDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Travelers</span>
                  <span className="text-sm font-medium">
                    {booking.booking.numberOfPeople}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Price per person
                  </span>
                  <span className="text-sm font-medium">
                    $
                    {(
                      booking.booking.totalAmount /
                      booking.booking.numberOfPeople
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {booking.booking.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {booking.booking.specialRequests}
                    </p>
                  </div>
                </>
              )}

              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Employee Notes
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {booking.notes}
                    </p>
                  </div>
                </>
              )}

              {booking.booking.receipt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Payment Proof
                    </p>
                    <Button
                      onClick={handleDownloadReceipt}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Accept Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this booking? You will be
              responsible for handling this customer&apos;s travel arrangements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accept-notes">Notes (Optional)</Label>
              <Textarea
                id="accept-notes"
                placeholder="Add any notes about accepting this booking..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAcceptDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate("ACCEPTED")}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? "Accepting..." : "Accept Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this booking? Please provide a
              reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-notes">Reason for Rejection *</Label>
              <Textarea
                id="reject-notes"
                placeholder="Please explain why you're rejecting this booking..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate("REJECTED")}
              disabled={isUpdating || !notes.trim()}
              variant="destructive"
            >
              {isUpdating ? "Rejecting..." : "Reject Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BookingDetailView;
