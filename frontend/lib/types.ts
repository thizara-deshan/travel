export type Destination = {
  id: number;
  name: string;
  description: string;
  image: string;
  tourPackageId: number;
  createdAt: string;
  updatedAt: string;
};

export type TourPlanDay = {
  id: number;
  title: string;
  activity: string;
  description: string;
  endOfTheDay: string;
  tourPackageId: number;
};

export type TourPackage = {
  id: number;
  title: string;
  country: string;
  packageType: string;
  prices: number;
  image: string;
  alt: string;
  shortDescription: string;
  description: string;
  locations: Destination[];
  tourPlanDays: TourPlanDay[];
};

export interface BookingData {
  destination: string;
  package: string;
  startDate: string;
  endDate: string;
  travelers: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export interface MenuItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  id: string;
}

export interface MenuItemforSuperAdmin {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  id: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface Customer {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "CUSTOMER" | "EMPLOYEE" | "SUPER_ADMIN"; // Adjust roles as needed
  createdAt?: string; // optional if present in your real data
  updatedAt?: string;
}

export enum Role {
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum BookingStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  ASSIGNED = "ASSIGNED",
  PAID = "PAID",
}

export enum AssignmentStatus {
  ASSIGNED = "ASSIGNED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// Base Booking interface
export interface BaseBooking {
  id: number;
  userId: number;
  tourPackageId: number;
  bookingDate: Date;
  travelDate: Date;
  phone?: string | null;
  country?: string | null;
  numberOfPeople: number;
  totalAmount: number;
  status: BookingStatus;
  specialRequests?: string | null;
  receipt?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Unassigned Booking - includes customer and tour package details
export interface UnassignedBooking extends BaseBooking {
  // Relations
  customer: Customer;
  tourPackage?: TourPackage;
  // No assignment relationship
  assignment?: null;
}

// Assignment details interface
export interface AssignmentDetails {
  id: number;
  bookingId: number;
  employeeId: number;
  assignedAt: Date;
  status: AssignmentStatus;
  notes?: string | null;
}

// Assigned Booking - the assignment record with booking and employee details
export interface AssignedBooking {
  id: number;
  bookingId: number;
  employeeId: number;
  assignedAt: Date;
  status: AssignmentStatus;
  notes?: string | null;

  // Relations
  booking: BaseBooking & {
    customer: Customer;
    tourPackage?: TourPackage;
  };
  employee: Employee;
}
