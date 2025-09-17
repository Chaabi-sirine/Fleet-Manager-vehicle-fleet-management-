import { Component } from '@angular/core';
import { Auth as AuthService, RegisterPayload } from './services/auth';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
  username: string = '';
  password: string = '';
  roleLabel: string = '';
  roles: string[] = ['Administrateur', 'Responsable', 'Utilisateur'];
  errorMsg: string = '';
  successMsg: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.username || !this.password || !this.roleLabel) {
      this.errorMsg = 'Tous les champs sont obligatoires.';
      return;
    }
    const payload: RegisterPayload = {
      username: this.username,
      password: this.password,
      role: AuthService.mapRoleLabelToBackend(this.roleLabel)
    };
    this.isLoading = true;
    this.authService.register(payload).subscribe({
      next: () => {
        this.successMsg = 'Utilisateur créé avec succès !';
        this.username = '';
        this.password = '';
        this.roleLabel = '';
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMsg = 'Nom d’utilisateur déjà pris.';
        } else if (err.status === 400) {
          this.errorMsg = 'Rôle invalide.';
        } else {
          this.errorMsg = 'Erreur lors de la création.';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
