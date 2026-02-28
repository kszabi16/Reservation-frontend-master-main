export interface HostRequestDto {
  id:number
  userId: number;
  propertyId: number;
  username: string;
  propertyTitle: string;
  isApproved: boolean;
  approvedAt?: string;
  requestedAt?: string;
}