import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewBonCarburant {
  numeroBon: string;
  montant: number;
  dateEmission: string;
  station: string;
  vehiculeId: string;
  utilisateurId: string;
  utilise: boolean;
  dateUtilisation: string;
}

@Injectable({ providedIn: 'root' })
export class CarburantService {
  getAllCarburant(): Observable<any[]> {
    const url = 'http://localhost:8080/api/v1/carburant/all';
    return this.http.get<any[]>(url);
  }
  private apiUrl = 'http://localhost:8080/api/v1/carburant/bons';

  constructor(private http: HttpClient) {}

  createBonCarburant(bon: NewBonCarburant, token?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
    return this.http.post<any>(this.apiUrl, bon, { headers });
  }

  getRavitaillementsVehicule(vehiculeId: string, debut: string, fin: string): Observable<any[]> {
    const url = `http://localhost:8080/api/v1/carburant/vehicule/${vehiculeId}?debut=${debut}&fin=${fin}`;
    return this.http.get<any[]>(url);
  }
}
