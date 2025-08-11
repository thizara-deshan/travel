import React from "react";

import { TourPackage } from "@/lib/types";
import Image from "next/image";
import { MapPinIcon, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";

export function PackageDetailView({
  package: pkg,
  onBack,
}: {
  package: TourPackage;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-10 pb-6 ">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 ">
        <Button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 rounded transition-colors"
          type="button"
        >
          ← Back
        </Button>
      </div>
      <div className="relative w-full h-[40vh] lg:h-[75vh] mb-1">
        <Image
          src={pkg.image || "/logo.png"}
          alt={pkg.alt || "Package Image"}
          width={1924}
          height={1080}
          className="  w-full h-full object-cover rounded-lg"
        />
      </div>
      <main className="flex-1 container  p-1 pb-8 ">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-12">
            <section className="mb-8 px-4">
              <h2 className="text-3xl font-semibold mb-4">Tour Overview</h2>
              <p className="text-gray-600 justify-center pl-2">
                {pkg?.description}
              </p>
            </section>
            <section className="mb-8 px-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-col  ">
                    <span className="text-base text-opacity-75 font-bold text-white">
                      Starting from
                    </span>
                    <span className="text-3xl font-semibold text-white ">
                      ${pkg?.prices}{" "}
                      <span className="text-sm  text-white text-opacity-75">
                        /per person
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-white mt-4 sm:mt-0">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>{pkg?.tourPlanDays.length} Days</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      <span>{pkg?.locations.length} Destinations</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                *Price varies based on hotels and accommodation preferences.
              </p>
            </section>

            <section className="mb-8 px-4">
              <h2 className="text-3xl font-semibold mb-4">Destinations</h2>
              <ul className="list-disc text-lg list-inside pl-2 text-gray-600 mb-4 space-y-3">
                {pkg?.locations.map((location) => {
                  return (
                    <li key={location.id} className="flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5 text-gray-700 mr-2" />
                      <span>{location.name}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="mb-8 px-2">
              <h2 className="text-3xl font-semibold mb-4">Itinerary</h2>
              <Tabs defaultValue="day1">
                <TabsList className="grid h-auto w-full grid-cols-5  ">
                  {pkg?.tourPlanDays.map((item, index) => (
                    <TabsTrigger
                      key={index}
                      value={`day${index + 1}`}
                      className="text-sm"
                    >
                      Day {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {pkg?.tourPlanDays.map((item, index) => (
                  <TabsContent key={index} value={`day${index + 1}`}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Day {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className=" space-y-4 ">
                          <li className="flex flex-col gap-4  space-x-2 text-base font-medium">
                            {item.activity}
                            <p className="px-5 text-sm text-gray-600">
                              {item.description}{" "}
                            </p>
                          </li>
                          <li className="font-medium">{item.endOfTheDay}</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
