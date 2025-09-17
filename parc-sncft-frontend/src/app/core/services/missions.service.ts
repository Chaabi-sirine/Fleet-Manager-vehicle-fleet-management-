import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EvolutionMission {
  mois: string;
  missions: number;
}
import { Mission } from '../models/mission.model';

@Injectable({ providedIn: 'root' })
export class MissionsService {
  private apiUrl = 'http://localhost:8080/api/v1/missions';
  private evolutionUrl = 'http://localhost:8080/api/v1/missions/evolution';
  getEvolutionMissions(): Observable<EvolutionMission[]> {
    return this.http.get<EvolutionMission[]>(this.evolutionUrl);
  }

  constructor(private http: HttpClient) {}

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.apiUrl);
  }

  getMissionById(id: string): Observable<Mission> {
    return this.http.get<Mission>(`${this.apiUrl}/${id}`);
  }

  createMission(mission: Mission): Observable<Mission> {
    return this.http.post<Mission>(this.apiUrl, mission);
  }

  updateMission(id: string, mission: Mission): Observable<Mission> {
    return this.http.put<Mission>(`${this.apiUrl}/${id}`, mission);
  }

  deleteMission(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
