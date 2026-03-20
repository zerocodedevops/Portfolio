// Mock implementation for Vite Client

import type { Booking } from "../../types";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export async function getBeforeAndAfterDates(_date: Date) {
  return [];
}

export async function getAvailableSlots(
  date: Date,
  serviceId: string,
  staffId: string | null = null,
): Promise<TimeSlot[]> {
  console.log("Mock: getAvailableSlots", date, serviceId, staffId);
  // Return some mock slots
  return [
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "16:30", available: true },
  ];
}

export async function createBooking(data: {
  userId: string;
  serviceId: string;
  staffId?: string;
  date: Date;
}): Promise<
  { success: true; booking: Partial<Booking> } | { success: false; error: string }
> {
  console.log("Mock: createBooking", data);
  return {
    success: true,
    booking: {
      id: `MOCK-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      date: data.date.toISOString(),
      status: "PENDING",
      user: { name: "", email: "" },
      staff: { name: "", id: data.staffId || "" },
      service: { name: "", id: data.serviceId, price: 0, duration: 0 }
    },
  };
}
