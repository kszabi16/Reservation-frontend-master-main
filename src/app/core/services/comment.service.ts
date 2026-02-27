import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommentDto, CreateCommentDto } from '../models/comment-dto';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comment`;

  constructor(private http: HttpClient) {}

  /** Egy adott szálláshoz tartozó összes komment lekérése */
  getCommentsByProperty(propertyId: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.apiUrl}/property/${propertyId}`);
  }

  /** Új komment írása */
  createComment(dto: CreateCommentDto): Observable<CommentDto> {
    return this.http.post<CommentDto>(this.apiUrl, dto);
  }

  /** Saját komment törlése */
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}