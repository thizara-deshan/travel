import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2, MapPin, Calendar } from "lucide-react";
import { useTourPackageForm } from "@/lib/validation/tourPackageForm";
import type { TourPackageFormValues } from "@/lib/validation/tourPackageForm";
import { useFieldArray } from "react-hook-form";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

interface CreatePackageProps {
  onSectionChange: (section: string) => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function CreatePackage({
  onSectionChange,
  user,
}: CreatePackageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useTourPackageForm();
  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  const {
    fields: tourPlanFields,
    append: appendTourPlan,
    remove: removeTourPlan,
  } = useFieldArray({
    control: form.control,
    name: "tourPlanDays",
  });

  // Import the form schema type from your validation file

  const onSubmit = async (data: TourPackageFormValues) => {
    setIsSubmitting(true);
    console.log("Form data submitted:", data);
    try {
      const response = await fetch(
        `${apiBaseUrl}/tour-packages/create-tour-package`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create tour package");
      }

      const newPackage = await response.json();
      console.log("New package created:", newPackage);
      form.reset();
      // You can add a success toast here
    } catch (error) {
      console.error("Error creating tour package:", error);
      // You can add an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 ">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
        <p className="text-blue-100 mb-6">
          Create tour packages to offer exciting experiences to our customers.
        </p>
        <Button
          variant="outline"
          className="text-white bg-blue-700 hover:bg-blue-800"
          onClick={() => onSectionChange("tour-packages")}
        >
          View Tour Packages
        </Button>
      </div>

      {/* Form Section */}
      <div className=" max-w-6xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Create New Tour Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Quick Escape to Sri Lanka"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Sri Lanka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="packageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Type</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="2 Nights 3 Days Package"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1299"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Image Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="/sigiriya.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Alt Text</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Beautiful Sigiriya Rock Fortress"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Descriptions */}
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief overview of the tour package..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the tour package, what's included, highlights..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Locations Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Locations
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendLocation({ name: "", description: "", image: "" })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Location
                    </Button>
                  </div>

                  {locationFields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Location {index + 1}</h4>
                        {locationFields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeLocation(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`locations.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Sigiriya Rock Fortress"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`locations.${index}.image`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="/sigiriya.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`locations.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Location Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Description of this location..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}
                </div>

                {/* Tour Plan Days Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Tour Plan Days
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendTourPlan({
                          title: "",
                          activity: "",
                          description: "",
                          endOfTheDay: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Day
                    </Button>
                  </div>

                  {tourPlanFields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-blue-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Day {index + 1}</h4>
                        {tourPlanFields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTourPlan(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`tourPlanDays.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Day 1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tourPlanDays.${index}.activity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Main Activity</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Airport to Kandy via Pinnawala"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`tourPlanDays.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Detailed description of the day's activities..."
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tourPlanDays.${index}.endOfTheDay`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End of Day Summary</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Overnight stay at Kandy."
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? "Creating..." : "Create Package"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
