// Zerovanity shared domain types

export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";

export interface BookingUser {
  name: string;
  email: string;
}

export interface StaffMember {
  id: string;
  name: string;
  available?: boolean;
  services?: ServiceItem[];
  avatar?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  title?: string;
  price: number;
  duration: number;
  category?: string;
  description?: string;
}

export interface Booking {
  id: string;
  date: string;
  endTime?: string;
  time?: string;
  status: BookingStatus;
  user: BookingUser;
  staff: { name: string; id: string };
  service: { name: string; id: string; price: number; duration: number };
  services?: ServiceItem[];
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailabilitySchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface PaymentDetails {
  cardLast4: string;
  amount: number;
  currency: string;
  timestamp: string;
}

export interface BookingFormData {
  staff: Pick<StaffMember, "id" | "name">[];
  services: ServiceItem[];
}

/** Icon component type used in Landing page feature cards */
export type IconComponent = React.ComponentType<{ className?: string }>;
