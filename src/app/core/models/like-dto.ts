export enum LikeTargetType {
  Property = 'Property',
  Comment = 'Comment'
}

export interface LikeDto {
  id: number;
  userId: number;
  targetType: LikeTargetType;
  propertyId?: number;
  commentId?: number;
  createdAt: string;
}

export interface ToggleLikeResponse {
  isLiked: boolean;
  message: string;
}