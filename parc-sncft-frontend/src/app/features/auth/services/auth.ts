
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type RegisterRole = 'ROLE_ADMIN' | 'ROLE_RESPONSABLE' | 'ROLE_UTILISATEUR';

export interface RegisterPayload {
  username: string;
  password: string;
  role: RegisterRole;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly registerUrl = '/utilisateurs/register';

  constructor(private http: HttpClient) {}

  /**
   * Enregistre un nouvel utilisateur
   * @param payload - { username, password, role }
   */
  register(payload: RegisterPayload): Observable<any> {
  return this.http.post(this.registerUrl, payload);
  }

  /**
   * Mappe le libellé du dropdown vers la valeur backend
   */
  static mapRoleLabelToBackend(label: string): RegisterRole {
    switch (label) {
      case 'Administrateur':
        return 'ROLE_ADMIN';
      case 'Responsable':
        return 'ROLE_RESPONSABLE';
      case 'Utilisateur':
        return 'ROLE_UTILISATEUR';
      default:
        return 'ROLE_UTILISATEUR';
    }
  }
}
