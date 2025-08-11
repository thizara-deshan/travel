// src/components/Dashboard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { BaseBooking, TourPackage } from "@/lib/types";
import { useEffect, useState } from "react";
import { Calendar, DollarSign, Package, Users } from "lucide-react";
import { BookingDetailView } from "./BookingDetailView";
import { CardHeader, CardTitle } from "@/components/ui/card";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface DashboardProps {
  onSectionChange: (section: string) => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}
export interface DetailedBooking extends BaseBooking {
  tourPackage: TourPackage;
  phone: string;
  country: string;
}

export default function Dashboard({ onSectionChange, user }: DashboardProps) {
  const [bookings, setBookings] = useState<BaseBooking[]>([]);
  const [selectedBooking, setSelectedBooking] =
    useState<DetailedBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiBaseUrl}/bookings/get-bookings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        console.log("Fetched bookings:", data);
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Fetch detailed booking data
  const handleBookingClick = async (bookingId: number) => {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(
        `${apiBaseUrl}/bookings/${bookingId}/details`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch booking details");
      }

      const data = await response.json();
      setSelectedBooking(data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };
  if (selectedBooking) {
    return (
      <BookingDetailView
        booking={selectedBooking}
        onBack={() => setSelectedBooking(null)}
      />
    );
  }
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
        <p className="text-blue-100 mb-6">
          Ready to explore new destinations? Let&apos;s plan your next
          adventure.
        </p>
        <Button
          className="bg-white text-blue-600 hover:bg-blue-50"
          onClick={() => onSectionChange("booking")}
        >
          Book Now
        </Button>
      </div>

      {/* My Bookings Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-900">My Bookings</h2>
          <Badge variant="outline" className="text-sm">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your journey by booking your first adventure!
              </p>
              <Button onClick={() => onSectionChange("packages")}>
                Browse Packages
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => handleBookingClick(booking.id)}
                isLoading={isLoadingDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onClick,
  isLoading,
}: {
  booking: BaseBooking;
  onClick: () => void;
  isLoading: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "paid":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg  border-l-4 border-l-blue-500"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
          <Badge className={`${getStatusColor(booking.status)} border`}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Travel Date</p>
              <p className="text-sm font-medium">
                {new Date(booking.travelDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Travelers</p>
              <p className="text-sm font-medium">{booking.numberOfPeople}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-green-600">
              ${booking.totalAmount.toLocaleString()}
            </span>
          </div>
          <Button variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? "Loading..." : "View Details"}
          </Button>
        </div>

        {booking.specialRequests && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 mb-1">Special Requests</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {booking.specialRequests}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
