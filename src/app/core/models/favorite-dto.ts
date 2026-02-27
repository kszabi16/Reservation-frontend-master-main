export interface FavoriteDto {
  id: number;
  userId: number;
  propertyId: number;
  createdAt: string;
}


export interface ToggleFavoriteResponse {
  isFavorite: boolean;
  message: string;
}