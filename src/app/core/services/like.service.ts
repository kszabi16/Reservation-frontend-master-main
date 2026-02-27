import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LikeDto, LikeTargetType, ToggleLikeResponse } from '../models/like-dto';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = `${environment.apiUrl}/like`;

  constructor(private http: HttpClient) {}

  /** Váltás: Lájk hozzáadása vagy elvétele */
  toggleLike(userId: number, targetType: LikeTargetType, propertyId?: number, commentId?: number): Observable<ToggleLikeResponse> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('targetType', targetType);

    if (propertyId) params = params.set('propertyId', propertyId);
    if (commentId) params = params.set('commentId', commentId);

    return this.http.post<ToggleLikeResponse>(`${this.apiUrl}/toggle`, {}, { params });
  }

  /** Egy bejelentkezett felhasználó összes lájkjának lekérése */
  getLikesByUser(userId: number): Observable<LikeDto[]> {
    return this.http.get<LikeDto[]>(`${this.apiUrl}/user/${userId}`);
  }
}