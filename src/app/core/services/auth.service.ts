import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { LoginDto } from '../models/auth-dto';
import { RegisterDto } from '../models/auth-dto';
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

  // TOKEN OLVASÁS
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ROLE lekérdezés – helyesen
  getRoleFromToken(): string | null {
  const token = this.getToken();
  if (!token) return null;

  return getRoleFromToken(token);
}

 get role(): string | null {
  return this.getRoleFromToken();
}

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.unique_name || payload?.username || null;
    } catch {
      return null;
    }
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
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

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }
}




