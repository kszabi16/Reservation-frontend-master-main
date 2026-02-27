export interface CommentDto {
  id: number;
  propertyId: number;
  userId: number;
  userName?: string;
  content: string;
  rating: number;
  createdAt: string;
  parentId?: number | null;
}

export interface CreateCommentDto {
  propertyId: number;
  content: string;
  parentId?: number | null;
  rating: number;
}