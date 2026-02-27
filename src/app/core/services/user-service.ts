import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, UpdateUserProfileDto } from '../models/user-dto'

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://localhost:4200/api/user'; 

  constructor(private http: HttpClient) {}
getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/get-all`);
  }

  createUser(userData: any): Observable<any> {
    // A C# backend-en ehhez kell majd egy [HttpPost("create")] végpont!
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
    return this.http.put<UserDto>(`${this.apiUrl}/profile`, data);
  }
}