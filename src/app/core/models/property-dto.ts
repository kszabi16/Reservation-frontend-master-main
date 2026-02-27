export interface PropertyDto {
  id: number;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  capacity: number;
  hostId: number;
  isApproved: boolean;
  averageRating?: number;
  reviewCount?: number;
}
export interface CreatePropertyDto {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  capacity: number;
}
