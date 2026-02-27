export interface HostRequestDto {
  id:number
  userId: number;
  propertyId: number;
  userName: string;
  propertyTitle: string;
  isApproved: boolean;
  approvedAt?: string;
  requestedAt?: string;
}