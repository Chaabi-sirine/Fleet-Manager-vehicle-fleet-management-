import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntretiensService {
  constructor(private http: HttpClient) {}

  getAllEntretiens(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/entretiens');
  }

  createEntretien(payload: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/entretiens', payload);
  }
}
