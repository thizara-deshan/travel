// src/components/Dashboard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Edit, Package, Trash2, Upload } from "lucide-react";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedBooking } from "./Dashboard";
import { ArrowLeft, Clock, MapPin, User } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ModifyBookingForm from "./ModifyBookingForm";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function BookingDetailView({
  booking,
  onBack,
}: {
  booking: DetailedBooking;
  onBack: () => void;
}) {
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleModifyBooking = () => {
    setShowModifyForm(true);
  };
  const handleDeleteBooking = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/bookings/customer/${booking.id}`,
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
      window.location.reload();
      onBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleReceiptUpload = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("receipt", selectedFile);

      const response = await fetch(
        `${apiBaseUrl}/bookings/${booking.id}/upload-receipt`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload receipt");
      }

      // Reload the page to show updated booking status
      window.location.reload();
    } catch (error) {
      console.error("Error uploading receipt:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload receipt"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Please select an image (JPEG, PNG, GIF) or PDF file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
    }
  };

  if (showModifyForm) {
    return (
      <ModifyBookingForm
        booking={booking}
        onBack={() => setShowModifyForm(false)}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Booking Details #{booking.id}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
            <span className="text-sm text-gray-500">
              Booked on {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
                <Image
                  src={booking.tourPackage.image}
                  alt={booking.tourPackage.alt}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {booking.tourPackage.title}
                  </h3>
                  <p className="text-gray-600">{booking.tourPackage.country}</p>
                  <Badge variant="outline" className="mt-2">
                    {booking.tourPackage.packageType}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700">
                {booking.tourPackage.shortDescription}
              </p>
            </CardContent>
          </Card>

          {/* Destinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.tourPackage.locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <Image
                      src={location.image}
                      alt={location.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{location.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {location.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Tour Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {booking.tourPackage.tourPlanDays.map((day, index) => (
                  <div key={day.id} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <h4 className="text-lg font-semibold">{day.title}</h4>
                    </div>
                    <div className="space-y-2 ml-11">
                      <p className="text-gray-700">{day.activity}</p>
                      <p className="text-sm text-gray-600">{day.description}</p>
                      <p className="text-sm text-blue-600 font-medium">
                        {day.endOfTheDay}
                      </p>
                    </div>
                  </div>
                ))}
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
                <User className="w-5 h-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${booking.totalAmount.toLocaleString()}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Travel Date</span>
                  <span className="text-sm font-medium">
                    {new Date(booking.travelDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Travelers</span>
                  <span className="text-sm font-medium">
                    {booking.numberOfPeople}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Price per person
                  </span>
                  <span className="text-sm font-medium">
                    ${(booking.totalAmount / booking.numberOfPeople).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">your phone</span>
                  <span className="text-sm font-medium">{booking.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">your country</span>
                  <span className="text-sm font-medium">{booking.country}</span>
                </div>
              </div>

              {booking.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {booking.specialRequests}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={handleModifyBooking}
                disabled={
                  booking.status === "ASSIGNED" ||
                  booking.status === "ACCEPTED" ||
                  booking.status === "REJECTED"
                }
              >
                <Edit className="w-4 h-4 mr-2" />
                Modify Booking
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={
                  booking.status === "ASSIGNED" ||
                  booking.status === "ACCEPTED" ||
                  booking.status === "REJECTED"
                }
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove my Booking
              </Button>
            </CardContent>
          </Card>

          {/* Wait for Assignment */}
          {booking.status === "PENDING" && (
            <Card>
              <CardHeader>
                <CardTitle>Waiting for Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your booking is currently pending. Please wait for it to be
                  assigned to one of our employees. Once assigned, you will be
                  able to upload your payment receipt.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Receipt Upload */}
          {booking.status === "ASSIGNED" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Receipt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Please make payment to following bank account and upload the
                  receipt here. Once uploaded, your booking status will change
                  to
                  <span className="font-semibold"> PAID</span>.
                </p>
                <p className="text-sm text-gray-600">Bank Account Details:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li>Account Name: BlueLanka pvt ltd</li>
                  <li>Account Number: 8011387042</li>
                  <li>Bank Name: Bank of Ceylon</li>
                  <li>SWIFT Code: ABCDEFGH</li>
                </ul>
              </CardContent>
              <CardContent>
                <form onSubmit={handleReceiptUpload} className="space-y-3">
                  <div>
                    <Label htmlFor="receipt">Payment Receipt</Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.pdf"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                      className="mt-1"
                    />
                    {uploadError && (
                      <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedFile || isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Receipt"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              booking #{booking.id} and you will lose your reservation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper function for status colors
function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "assigned":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "paid":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}
