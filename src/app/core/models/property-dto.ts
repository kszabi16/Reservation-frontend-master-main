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
  imageUrl?: string;
  imageUrls?: string[];
}
export interface CreatePropertyDto {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  capacity: number;
}
