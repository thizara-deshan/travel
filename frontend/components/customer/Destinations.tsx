// src/components/Destinations.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, ArrowLeft, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Types based on your Prisma model
import type { Destination, TourPackage } from "@/lib/types";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
interface DetailedDestination extends Destination {
  tourPackage: TourPackage[];
}

function DestinationCard({
  destination,
  className = "",
  onClick,
}: {
  destination: Destination;
  className?: string;
  onClick: () => void;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl drop-shadow-lg group cursor-pointer ${className}`}
      data-aos="fade-up"
      onClick={onClick}
    >
      <Image
        src={destination.image}
        alt={`${destination.name}`}
        width={1920}
        height={1080}
        quality={75}
        className="w-full h-72 object-cover brightness-75 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4">
        <h2 className="text-white text-xl font-semibold">{destination.name}</h2>
        <p className="text-white/80 line-clamp-2">{destination.description}</p>
      </div>
      <div className="absolute bottom-0 right-0 p-4">
        <ExternalLink className="text-white hover:scale-105" size={24} />
      </div>
    </div>
  );
}

function DestinationDetailView({
  destination,
  onBack,
}: {
  destination: DetailedDestination;
  onBack: () => void;
}) {
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(
    destination.tourPackage?.[0] || null
  );

  // Get unique package types from all packages

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
          Back to Destinations
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {destination.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src={destination.image}
              alt={destination.name}
              width={800}
              height={400}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          {/* Destination Description */}
          <Card>
            <CardHeader>
              <CardTitle>About {destination.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {destination.description}
              </p>
            </CardContent>
          </Card>

          {/* Available Tour Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Available Tour Packages
                </div>
                <Badge variant="secondary">
                  {destination.tourPackage?.length || 0} packages
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {destination.tourPackage && destination.tourPackage.length > 0 ? (
                <div className="space-y-4">
                  {destination.tourPackage.map((tourPackage) => (
                    <div
                      key={tourPackage.id}
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        selectedPackage?.id === tourPackage.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "hover:shadow-md hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPackage(tourPackage)}
                    >
                      <div className="flex items-start gap-4">
                        <Image
                          src={tourPackage.image}
                          alt={tourPackage.title}
                          width={100}
                          height={100}
                          className="w-25 h-25 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                {tourPackage.title}
                              </h3>
                              <p className="text-gray-600 mb-3 text-sm">
                                {tourPackage.shortDescription}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-blue-600">
                                ${tourPackage.prices}
                              </p>
                              <p className="text-sm text-gray-500">
                                per person
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {tourPackage.country}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {tourPackage.packageType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    No tour packages available for this destination
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Package Details */}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Available Packages</p>
                  <p className="text-lg font-bold text-blue-600">
                    {destination.tourPackage?.length || 0}
                  </p>
                </div>
              </div>

              <Separator />

              {selectedPackage && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Selected Package</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedPackage.prices}
                  </p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Range */}
          {destination.tourPackage && destination.tourPackage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Price Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Starting from</span>
                    <span className="text-sm font-medium">
                      $
                      {Math.min(
                        ...destination.tourPackage.map((pkg) => pkg.prices)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Up to</span>
                    <span className="text-sm font-medium">
                      $
                      {Math.max(
                        ...destination.tourPackage.map((pkg) => pkg.prices)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<DetailedDestination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch destinations data
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${apiBaseUrl}/tour-packages/get-destinations`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }

        const data = await response.json();
        console.log("Fetched destinations:", data);
        setDestinations(data || []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Fetch detailed destination data
  const handleDestinationClick = async (destinationId: number) => {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(
        `${apiBaseUrl}/tour-packages/get-destinations/${destinationId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch destination details");
      }

      const data = await response.json();
      console.log("Fetched destination details:", data);
      setSelectedDestination(data);
    } catch (error) {
      console.error("Error fetching destination details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // If detailed destination is selected, show detailed view
  if (selectedDestination) {
    return (
      <DestinationDetailView
        destination={selectedDestination}
        onBack={() => setSelectedDestination(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading destinations...</p>
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No destinations found
        </h3>
        <p className="text-gray-600">
          Check back later for amazing destinations to explore!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isLoadingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">
              Loading destination details...
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((destination, index) => {
          const rowIndex = Math.floor(index / 2);
          const isOddRow = rowIndex % 2 === 0;
          const colSpan = isOddRow
            ? index % 2 === 1
              ? "md:col-span-2"
              : ""
            : index % 2 === 0
            ? "md:col-span-2"
            : "";

          return (
            <DestinationCard
              key={destination.id}
              destination={destination}
              className={`${colSpan}`}
              onClick={() => handleDestinationClick(destination.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
