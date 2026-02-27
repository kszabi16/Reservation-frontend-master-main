export interface BookingDto {
  id: number;
  propertyId: number;
  guestId: number;
  startDate: string; // ISO string a backend miatt
  endDate: string;
  status: BookingStatus;
}
export interface CreateBookingDto {
  propertyId: number;
  guestId: number;
  startDate: string;
  endDate: string;
}

export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2
}
