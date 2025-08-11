// src/components/ModifyBookingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { BookingFormData, useBookingForm } from "@/lib/validation/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  ArrowLeft,
  Phone,
} from "lucide-react";
import Image from "next/image";
import type { TourPackage } from "@/lib/types";
import { DetailedBooking } from "./Dashboard";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
interface ModifyBookingFormProps {
  booking: DetailedBooking;
  onBack: () => void;
}

export default function ModifyBookingForm({
  booking,
  onBack,
}: ModifyBookingFormProps) {
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useBookingForm();

  const watchedPackageId = form.watch("tourPackageId");
  const watchedPeople = form.watch("numberOfPeople");

  // Populate form with existing booking data
  useEffect(() => {
    const populateForm = () => {
      form.reset({
        tourPackageId: booking.tourPackageId,
        travelDate: new Date(booking.travelDate).toISOString().split("T")[0],
        numberOfPeople: booking.numberOfPeople,
        specialRequests: booking.specialRequests || "",
        phone: booking.phone || "",
        country: booking.country || "",
      });
      setSelectedPackage(booking.tourPackage);
    };

    populateForm();
  }, [booking, form]);

  useEffect(() => {
    const fetchTourPackages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/tour-packages/get-tour-packages`
        );
        if (response.ok) {
          const packages = await response.json();
          setTourPackages(packages);
        }
      } catch (error) {
        console.error("Failed to fetch tour packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourPackages();
  }, []);

  useEffect(() => {
    if (watchedPackageId && tourPackages.length > 0) {
      const selected = tourPackages.find((pkg) => pkg.id === watchedPackageId);
      setSelectedPackage(selected || null);
    }
  }, [watchedPackageId, tourPackages]);

  const totalAmount = selectedPackage
    ? selectedPackage.prices * watchedPeople
    : 0;

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const bookingData = {
        ...data,
        tourPackageId: selectedPackage?.id,
        totalAmount,
        travelDate: new Date(data.travelDate).toISOString(),
      };

      const response = await fetch(
        `${apiBaseUrl}/bookings/customer/${booking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bookingData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        window.location.reload(); // Reload to reflect changes
        onBack(); // Navigate back after successful modification
        console.log("Booking modified successfully:", result);
      } else {
        const errorData = await response.json();
        console.error("Booking modification failed:", errorData);
      }
    } catch (error) {
      console.error("Error modifying booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading tour packages...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Booking Details
        </Button>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Modify Booking #{booking.id}
          </h1>
          <p className="text-gray-600">Update your booking details below</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Modify your travel information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Tour Package Selection */}
                  <FormField
                    control={form.control}
                    name="tourPackageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Select Tour Package
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a tour package" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tourPackages.map((pkg) => (
                              <SelectItem
                                key={pkg.id}
                                value={pkg.id.toString()}
                              >
                                <div className="flex items-start py-2">
                                  <span className="font-medium">
                                    {pkg.title}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    - ${pkg.prices}/person
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Travel Date */}
                  <FormField
                    control={form.control}
                    name="travelDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Travel Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Select your preferred travel date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Number of People */}
                  <FormField
                    control={form.control}
                    name="numberOfPeople"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Number of People
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            placeholder="Enter number of travelers"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum 20 people per booking
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/** Country */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your country"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>
                          Please provide your country of residence
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/** phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>
                          Please provide your phone number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Special Requests */}
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Let us know about any special requirements you may
                          have
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Buttons */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Booking"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Package Preview */}
          {selectedPackage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Package</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <Image
                    width={600}
                    height={400}
                    src={selectedPackage.image}
                    alt={selectedPackage.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    {selectedPackage.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedPackage.shortDescription}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedPackage.country}</Badge>
                    <Badge variant="outline">
                      ${selectedPackage.prices}/person
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Summary */}
          {selectedPackage && watchedPeople > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Updated Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price per person</span>
                    <span>${selectedPackage.prices}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Number of people</span>
                    <span>{watchedPeople}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>New Total Amount</span>
                    <span className="text-blue-600">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  <p>
                    ${selectedPackage.prices} × {watchedPeople}{" "}
                    {watchedPeople === 1 ? "person" : "people"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
