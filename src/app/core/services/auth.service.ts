import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { LoginDto, RegisterDto } from '../models/auth-dto';
import { AuthResponse } from '../models/auth-response';
import { getRoleFromToken } from '../utils/jwt.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, dto).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token))
    );
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, dto).pipe(
      tap(res => {
        if (res.token) localStorage.setItem(this.tokenKey, res.token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) { base64 += '='; }
      
      const payload = JSON.parse(atob(base64));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  getRoleFromToken(): string | null {
    if (!this.isLoggedIn()) return null;
    
    const token = this.getToken();
    if (!token) return null;

    return getRoleFromToken(token);
  }

  get role(): string | null {
    return this.getRoleFromToken();
  }

  getUsernameFromToken(): string | null {
    if (!this.isLoggedIn()) return null; 

    const token = this.getToken();
    if (!token) return null;

    try {
      let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) { base64 += '='; }

      const decodedStr = decodeURIComponent(
        window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      
      const payload = JSON.parse(decodedStr);
      return payload?.unique_name || payload?.username || null;
    } catch {
      return null;
    }
  }

  getUserIdFromToken(): number | null {
    if (!this.isLoggedIn()) return null; 

    const token = this.getToken();
    if (!token) return null;
    try {
      let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) { base64 += '='; }
      const payload = JSON.parse(atob(base64));
      return Number(
        payload.nameid ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      );
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}