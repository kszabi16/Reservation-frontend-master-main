import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, UpdateUserProfileDto } from '../models/user-dto'
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/get-all`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, userData);
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  updateUserRole(id: number, newRole: string): Observable<any> {
    
    return this.http.put(`${this.apiUrl}/update-role/${id}`, { role: newRole });
  }

  getMyProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: UpdateUserProfileDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/update-profile`, data);
  }
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }
  toggleTrustedHost(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/toggle-trusted`, {});
}
  uploadAvatar(file: File): Observable<{avatarUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{avatarUrl: string}>(`${this.apiUrl}/avatar`, formData);
}
}