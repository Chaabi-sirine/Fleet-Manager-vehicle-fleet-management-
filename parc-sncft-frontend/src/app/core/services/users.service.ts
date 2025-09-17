import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService, ApiResponse } from './api.service';

// Interfaces pour les utilisateurs
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt?: Date;
  avatar?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  department: string;
  password?: string; // Optionnel si géré par un autre système
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  department?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  /**
   * Inscrit un nouvel utilisateur via /utilisateurs/register
   * @param userData - Données de l'utilisateur à inscrire
   * @returns Observable<ApiResponse<User>>
   */
  registerUser(userData: any): Observable<ApiResponse<User>> {
    return this.apiService.post<User>('/utilisateurs/register', userData);
  }
  private readonly endpoint = '/api/v1/utilisateurs';

  constructor(private apiService: ApiService) {}

  // ============================================
  // MÉTHODES CRUD POUR LES UTILISATEURS
  // ============================================

  /**
   * Récupère la liste de tous les utilisateurs
   * @param filters - Filtres optionnels
   * @returns Observable<ApiResponse<User[]>>
   */
  getAllUsers(filters?: {
    role?: string;
    department?: string;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Observable<ApiResponse<User[]>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.role) params = params.set('role', filters.role);
      if (filters.department) params = params.set('department', filters.department);
      if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.offset) params = params.set('offset', filters.offset.toString());
    }

    return this.apiService.get<User[]>(this.endpoint, params);
  }

  /**
   * Récupère un utilisateur par son ID
   * @param id - ID de l'utilisateur
   * @returns Observable<ApiResponse<User>>
   */
  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.apiService.get<User>(`${this.endpoint}/${id}`);
  }

  /**
   * Crée un nouvel utilisateur
   * @param userData - Données de l'utilisateur à créer
   * @returns Observable<ApiResponse<User>>
   */
  createUser(userData: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.apiService.post<User>(this.endpoint, userData);
  }

  /**
   * Met à jour un utilisateur existant
   * @param id - ID de l'utilisateur à mettre à jour
   * @param userData - Nouvelles données de l'utilisateur
   * @returns Observable<ApiResponse<User>>
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.apiService.put<User>(`${this.endpoint}/${id}`, userData);
  }

  /**
   * Supprime un utilisateur
   * @param id - ID de l'utilisateur à supprimer
   * @returns Observable<ApiResponse<void>>
   */
  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES POUR LES UTILISATEURS
  // ============================================

  /**
   * Active ou désactive un utilisateur
   * @param id - ID de l'utilisateur
   * @param isActive - État d'activation
   * @returns Observable<ApiResponse<User>>
   */
  toggleUserStatus(id: string, isActive: boolean): Observable<ApiResponse<User>> {
    return this.apiService.patch<User>(`${this.endpoint}/${id}/status`, { isActive });
  }

  /**
   * Réinitialise le mot de passe d'un utilisateur
   * @param id - ID de l'utilisateur
   * @returns Observable<ApiResponse<{ temporaryPassword: string }>>
   */
  resetUserPassword(id: string): Observable<ApiResponse<{ temporaryPassword: string }>> {
    return this.apiService.post<{ temporaryPassword: string }>(`${this.endpoint}/${id}/reset-password`, {});
  }

  /**
   * Met à jour l'avatar d'un utilisateur
   * @param id - ID de l'utilisateur
   * @param avatarFile - Fichier image de l'avatar
   * @returns Observable<ApiResponse<{ avatarUrl: string }>>
   */
  updateUserAvatar(id: string, avatarFile: File): Observable<ApiResponse<{ avatarUrl: string }>> {
    return this.apiService.uploadFile<{ avatarUrl: string }>(`${this.endpoint}/${id}/avatar`, avatarFile);
  }

  // ============================================
  // GESTION DES RÔLES
  // ============================================

  /**
   * Récupère tous les rôles disponibles
   * @returns Observable<ApiResponse<UserRole[]>>
   */
  getAllRoles(): Observable<ApiResponse<UserRole[]>> {
    return this.apiService.get<UserRole[]>('/roles');
  }

  /**
   * Assigne un rôle à un utilisateur
   * @param userId - ID de l'utilisateur
   * @param roleId - ID du rôle
   * @returns Observable<ApiResponse<User>>
   */
  assignUserRole(userId: string, roleId: string): Observable<ApiResponse<User>> {
    return this.apiService.patch<User>(`${this.endpoint}/${userId}/role`, { roleId });
  }

  /**
   * Récupère les permissions d'un utilisateur
   * @param id - ID de l'utilisateur
   * @returns Observable<ApiResponse<string[]>>
   */
  getUserPermissions(id: string): Observable<ApiResponse<string[]>> {
    return this.apiService.get<string[]>(`${this.endpoint}/${id}/permissions`);
  }

  // ============================================
  // RECHERCHE ET STATISTIQUES
  // ============================================

  /**
   * Recherche des utilisateurs par terme
   * @param searchTerm - Terme de recherche
   * @returns Observable<ApiResponse<User[]>>
   */
  searchUsers(searchTerm: string): Observable<ApiResponse<User[]>> {
    const params = new HttpParams().set('search', searchTerm);
    return this.apiService.get<User[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Récupère les utilisateurs par département
   * @param department - Nom du département
   * @returns Observable<ApiResponse<User[]>>
   */
  getUsersByDepartment(department: string): Observable<ApiResponse<User[]>> {
    const params = new HttpParams().set('department', department);
    return this.apiService.get<User[]>(this.endpoint, params);
  }

  /**
   * Récupère les statistiques des utilisateurs
   * @returns Observable<ApiResponse<UserStats>>
   */
  getUserStats(): Observable<ApiResponse<UserStats>> {
    return this.apiService.get<UserStats>(`${this.endpoint}/stats`);
  }

  /**
   * Récupère les utilisateurs récemment actifs
   * @param limit - Nombre d'utilisateurs à récupérer
   * @returns Observable<ApiResponse<User[]>>
   */
  getRecentlyActiveUsers(limit: number = 10): Observable<ApiResponse<User[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.apiService.get<User[]>(`${this.endpoint}/recent-activity`, params);
  }

  // ============================================
  // AUDIT ET HISTORIQUE
  // ============================================

  /**
   * Récupère l'historique d'activité d'un utilisateur
   * @param id - ID de l'utilisateur
   * @param limit - Nombre d'enregistrements à récupérer
   * @returns Observable<ApiResponse<UserActivity[]>>
   */
  getUserActivity(id: string, limit?: number): Observable<ApiResponse<UserActivity[]>> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    
    return this.apiService.get<UserActivity[]>(`${this.endpoint}/${id}/activity`, params);
  }

  /**
   * Exporte la liste des utilisateurs
   * @param format - Format d'export (Excel, CSV)
   * @param filters - Filtres à appliquer
   * @returns Observable<Blob>
   */
  exportUsers(format: 'Excel' | 'CSV' = 'Excel', filters?: {
    role?: string;
    department?: string;
    isActive?: boolean;
  }): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    
    if (filters) {
      if (filters.role) params = params.set('role', filters.role);
      if (filters.department) params = params.set('department', filters.department);
      if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
    }

    return this.apiService.downloadFile(`${this.endpoint}/export?${params.toString()}`);
  }
}

// ============================================
// INTERFACES SUPPLÉMENTAIRES
// ============================================

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByDepartment: { [department: string]: number };
  usersByRole: { [role: string]: number };
  recentRegistrations: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  resource?: string;
  method?: string;
}
