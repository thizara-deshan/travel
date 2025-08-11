import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const tourPackageFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be at most 255 characters"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters"),
  packageType: z
    .string()
    .min(3, "Package type must be at least 3 characters")
    .max(100, "Package type must be at most 100 characters"),
  prices: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  image: z.string().min(3, "Image URL must be at least 3 characters"),
  alt: z
    .string()
    .min(3, "Alt text must be at least 3 characters")
    .max(255, "Alt text must be at most 255 characters"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(500, "Short description must be at most 500 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  locations: z
    .array(
      z.object({
        name: z.string().min(2, "Location name must be at least 2 characters"),
        description: z
          .string()
          .min(10, "Location description must be at least 10 characters"),
        image: z.string(),
      })
    )
    .min(1, "At least one location is required"),
  tourPlanDays: z
    .array(
      z.object({
        title: z.string().min(2, "Day title must be at least 2 characters"),
        activity: z.string().min(5, "Activity must be at least 5 characters"),
        description: z
          .string()
          .min(10, "Day description must be at least 10 characters"),
        endOfTheDay: z
          .string()
          .min(3, "End of the day summary must be at least 3 characters"),
      })
    )
    .min(1, "At least one tour plan day is required"),
});

export type TourPackageFormValues = z.infer<typeof tourPackageFormSchema>;

export const useTourPackageForm = () =>
  useForm<TourPackageFormValues>({
    resolver: zodResolver(tourPackageFormSchema),
    defaultValues: {
      title: "",
      country: "",
      packageType: "",
      prices: 0,
      image: "",
      alt: "",
      shortDescription: "",
      description: "",
      locations: [{ name: "", description: "", image: "" }],
      tourPlanDays: [
        { title: "", activity: "", description: "", endOfTheDay: "" },
      ],
    },
  });
