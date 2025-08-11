"use client";
import TourPackages from "@/components/TourPackages";
import { TourPackage } from "@/lib/types";
import { PackageDetailView } from "@/components/PackageDetailView";
import { useEffect, useState } from "react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Page() {
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(
    null
  );
  const [tourData, setTourPackages] = useState<TourPackage[]>([]);

  // Fetch tour packages from the API
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

  if (selectedPackage) {
    return (
      <PackageDetailView
        package={selectedPackage}
        onBack={() => setSelectedPackage(null)}
      />
    );
  }
  return (
    <div className=" w-full top-0  py-24 lg:py-24 ">
      <div className="flex flex-col gap-8 mb-24 text-center items-center">
        <h1 className="text-5xl text-center font-bold ">
          Explore Our Sri Lanka Tour Packages
        </h1>
        <p className="md:lg:w-3/5 text-lg text-gray-700 font-medium">
          Discover a wide range of tour packages tailored to showcase the best
          of Sri Lanka, from its pristine beaches to its rich cultural heritage.
          Choose the perfect adventure, luxury escape, or family-friendly
          vacation that suits your travel style.
        </p>
      </div>
      <div className="container mx-auto pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {Array.isArray(tourData) && tourData.length > 0 ? (
          tourData.map((tourPackage: TourPackage) => (
            <TourPackages
              tourData={tourPackage}
              key={tourPackage.id}
              setSelectedPackage={setSelectedPackage}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No tour packages found.
          </p>
        )}
      </div>
    </div>
  );
}
