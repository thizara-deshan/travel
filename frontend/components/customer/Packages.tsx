import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TourPackage } from "@/lib/types";
import Image from "next/image";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageDetailView } from "./PackageDetailView";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
interface TourPackagesProps {
  onSectionChange: (section: string) => void;
  setPackageId: (id: number) => void;
}

export default function TourPackages({
  onSectionChange,
  setPackageId,
}: TourPackagesProps) {
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(
    null
  );

  useEffect(() => {
    // Fetch tour packages from the API
    const fetchTourPackages = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/tour-packages/get-tour-packages`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tour packages");
        }
        const data = await response.json();
        setTourPackages(data);
      } catch (error) {
        console.error("Error fetching tour packages:", error);
      }
    };

    fetchTourPackages();
  }, []);

  // If a package is selected, show the detailed view
  if (selectedPackage) {
    return (
      <PackageDetailView
        package={selectedPackage}
        onBack={() => setSelectedPackage(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Tour Packages Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Tour Packages</h2>
        </div>
        <div className="lg:md:grid lg:md:grid-cols-3 flex flex-col gap-8">
          {tourPackages.map((pkg: TourPackage) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onSelect={() => setSelectedPackage(pkg)}
              onSectionChange={onSectionChange}
              setPackageId={setPackageId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PackageCard({
  package: pkg,
  onSelect,
  onSectionChange,
  setPackageId,
}: {
  package: TourPackage;
  onSelect: () => void;
  onSectionChange: (section: string) => void;
  setPackageId: (id: number) => void;
}) {
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const visibleDestinations = showAllDestinations
    ? pkg.locations
    : pkg.locations.slice(0, 4);

  const hasMoreDestinations = pkg.locations.length > 4;

  return (
    <Card className="w-full max-w-md overflow-hidden flex flex-col hover:drop-shadow-md cursor-pointer ">
      <div className="relative">
        <Image
          src={pkg.image}
          alt={pkg.alt}
          width={600}
          height={400}
          className="aspect-[3/2] w-full rounded-t-lg object-cover group-hover:opacity-80 transition-opacity"
        />
      </div>
      <CardHeader>
        <h3 className="text-2xl font-bold">{pkg.title}</h3>
        <p className="text-sm text-muted-foreground">{pkg.packageType}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleDestinations.map((location) => (
            <Badge key={location.id} variant="outline">
              {location.name}
            </Badge>
          ))}
          {hasMoreDestinations && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-0 h-6"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                setShowAllDestinations(!showAllDestinations);
              }}
            >
              {showAllDestinations ? (
                <>
                  Show less <ChevronUpIcon className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  +{pkg.locations.length - 4} more{" "}
                  <ChevronDownIcon className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
          {pkg.shortDescription}
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-muted-foreground">Starting from</div>
            <div className="text-xl">
              ${pkg.prices.toLocaleString()}
              <span className="text-gray-500 text-sm font-normal">
                /per person
              </span>
            </div>
          </div>
          <div className="w-full">
            <Button
              className=" w-full flex-1 bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => {
                onSectionChange("booking");
                setPackageId(pkg.id);
              }}
            >
              Book Now
            </Button>
          </div>
          <div className="w-full">
            <Button
              variant="outline"
              className="w-full flex-1 bg-blue-500 text-white hover:bg-blue-600"
              onClick={onSelect}
            >
              view details
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
