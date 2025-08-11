import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const bookingFormSchema = z.object({
  tourPackageId: z
    .number({
      required_error: "Please select a tour package",
    })
    .min(1, "Tour package is required"),

  travelDate: z
    .string({
      required_error: "Travel date is required",
    })
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: "Travel date must be a future date",
      }
    ),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters"),

  numberOfPeople: z
    .number({
      required_error: "Number of people is required",
    })
    .min(1, "At least 1 person is required")
    .max(20, "Maximum 20 people allowed"),

  specialRequests: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export const useBookingForm = () => {
  return useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      tourPackageId: 0,
      travelDate: "",
      numberOfPeople: 1,
      specialRequests: "",
      phone: "",
      country: "",
    },
  });
};
