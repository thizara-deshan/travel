import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const employeeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  role: z.enum(["EMPLOYEE", "ADMIN"], {
    errorMap: () => ({ message: "Role must be either EMPLOYEE or ADMIN" }),
  }),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export const useEmployeeForm = () => {
  return useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
    },
  });
};
