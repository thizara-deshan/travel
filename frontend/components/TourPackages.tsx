// src/components/Packages.tsx
"use client";
import Image from "next/image";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { TourPackage } from "@/lib/types";
import { useState } from "react";

export default function Packages({
  tourData,
  setSelectedPackage,
}: {
  tourData: TourPackage;
  setSelectedPackage: (pkg: TourPackage) => void;
}) {
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const visibleDestinations = showAllDestinations
    ? tourData.locations
    : tourData.locations.slice(0, 4);

  const hasMoreDestinations = tourData.locations.length > 4;

  return (
    <Card className="w-full max-w-md  flex flex-col hover:drop-shadow-md">
      <div className="relative ">
        <Image
          src={tourData.image}
          alt={tourData.alt}
          width={600}
          height={400}
          className="aspect-[3/2] w-full rounded-t-lg object-cover group-hover:opacity-80 transition-opacity"
        />
      </div>
      <CardHeader>
        <h3 className="text-2xl font-bold">{tourData.title}</h3>
        <p className="text-sm text-muted-foreground">{tourData.packageType}</p>
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
              onClick={() => setShowAllDestinations(!showAllDestinations)}
            >
              {showAllDestinations ? (
                <>
                  Show less <ChevronUpIcon className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  +{tourData.locations.length - 4} more{" "}
                  <ChevronDownIcon className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
          {tourData.description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-muted-foreground">Starting from</div>
            <div className="text-xl">
              ${tourData.prices.toLocaleString()}
              <span className=" text-gray-500 text-sm font-normal">
                /per person
              </span>
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setSelectedPackage(tourData)}
            >
              view details
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
