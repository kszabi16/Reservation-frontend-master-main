

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'Host' | 'Guest';
  

  phoneNumber?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string; 
  isTrustedHost?: boolean;
}

export interface UpdateUserProfileDto {
  username?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
}