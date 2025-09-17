import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CarteCarburant {
  numeroCarte: string;
  dateExpiration: string;
  vehiculeId: string;
  solde: number;
  code?: string;
  active?: boolean;
  plafondMensuel?: number;
  fournisseur?: string;
}

@Injectable({ providedIn: 'root' })
export class CarteCarburantService {
  private apiUrl = 'http://localhost:8080/api/v1/carburant/cartes';

  constructor(private http: HttpClient) {}

  createCarteCarburant(carte: CarteCarburant, token?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
    return this.http.post<any>(this.apiUrl, carte, { headers });
  }
}
