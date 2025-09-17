import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string;
  private readonly defaultHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    // URL de base de l'API
    this.baseUrl = environment.apiUrl || 'http://localhost:8080/api/v1';
    
    // Headers par défaut
    this.defaultHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  /**
   * Méthode GET générique
   * @param endpoint - L'endpoint de l'API (ex: '/utilisateurs', '/rapports')
   * @param params - Paramètres de requête optionnels
   * @param options - Options supplémentaires
   * @returns Observable<ApiResponse<T>>
   */
  get<T>(endpoint: string, params?: HttpParams, options: any = {}): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = {
      headers: this.mergeHeaders(options.headers),
      params: params || new HttpParams()
    };

    return this.http.get<ApiResponse<T>>(url, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Méthode POST générique
   * @param endpoint - L'endpoint de l'API
   * @param data - Données à envoyer (body JSON)
   * @param options - Options supplémentaires
   * @returns Observable<ApiResponse<T>>
   */
  post<T>(endpoint: string, data: any, options: any = {}): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = {
      headers: this.mergeHeaders(options.headers)
    };

    return this.http.post<ApiResponse<T>>(url, data, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Méthode PUT générique
   * @param endpoint - L'endpoint de l'API
   * @param data - Données à mettre à jour (body JSON)
   * @param options - Options supplémentaires
   * @returns Observable<ApiResponse<T>>
   */
  put<T>(endpoint: string, data: any, options: any = {}): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = {
      headers: this.mergeHeaders(options.headers)
    };

    return this.http.put<ApiResponse<T>>(url, data, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Méthode DELETE générique
   * @param endpoint - L'endpoint de l'API
   * @param options - Options supplémentaires
   * @returns Observable<ApiResponse<T>>
   */
  delete<T>(endpoint: string, options: any = {}): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = {
      headers: this.mergeHeaders(options.headers)
    };

    return this.http.delete<ApiResponse<T>>(url, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Méthode PATCH générique
   * @param endpoint - L'endpoint de l'API
   * @param data - Données partielles à mettre à jour
   * @param options - Options supplémentaires
   * @returns Observable<ApiResponse<T>>
   */
  patch<T>(endpoint: string, data: any, options: any = {}): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = {
      headers: this.mergeHeaders(options.headers)
    };

    return this.http.patch<ApiResponse<T>>(url, data, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Upload de fichiers
   * @param endpoint - L'endpoint de l'API
   * @param file - Fichier à uploader
   * @param additionalData - Données supplémentaires
   * @returns Observable<ApiResponse<T>>
   */
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const headers = new HttpHeaders({
      'Accept': 'application/json'
      // Ne pas définir 'Content-Type' pour les uploads de fichiers
    });

    return this.http.post<ApiResponse<T>>(url, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Download de fichiers
   * @param endpoint - L'endpoint de l'API
   * @param filename - Nom du fichier à télécharger
   * @returns Observable<Blob>
   */
  downloadFile(endpoint: string, filename?: string): Observable<Blob> {
    const url = this.buildUrl(endpoint);
    
    return this.http.get(url, {
      responseType: 'blob',
      headers: this.defaultHeaders
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================
  // MÉTHODES UTILITAIRES PRIVÉES
  // ============================================

  /**
   * Construit l'URL complète à partir de l'endpoint
   * @param endpoint - L'endpoint relatif
   * @returns URL complète
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Fusionne les headers par défaut avec les headers personnalisés
   * @param customHeaders - Headers personnalisés
   * @returns Headers fusionnés
   */
  private mergeHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    if (!customHeaders) {
      return this.defaultHeaders;
    }
    
    let mergedHeaders = this.defaultHeaders;
    customHeaders.keys().forEach(key => {
      const values = customHeaders.getAll(key);
      if (values) {
        mergedHeaders = mergedHeaders.set(key, values);
      }
    });
    
    return mergedHeaders;
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param error - Erreur HTTP
   * @returns Observable<never>
   */
  private handleError(error: any): Observable<never> {
    console.error('Erreur API:', error);
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide (400)';
          break;
        case 401:
          errorMessage = 'Non autorisé (401)';
          break;
        case 403:
          errorMessage = 'Accès interdit (403)';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée (404)';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur (500)';
          break;
        case 502:
          errorMessage = 'Bad Gateway (502)';
          break;
        case 503:
          errorMessage = 'Service non disponible (503)';
          break;
        default:
          errorMessage = `Erreur HTTP: ${error.status}`;
      }
      
      if (error.error?.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }
    
    return throwError(() => ({
      error: true,
      message: errorMessage,
      status: error.status,
      originalError: error
    }));
  }

  // ============================================
  // MÉTHODES DE CONFIGURATION
  // ============================================

  /**
   * Met à jour l'URL de base de l'API
   * @param newBaseUrl - Nouvelle URL de base
   */
  setBaseUrl(newBaseUrl: string): void {
    // Cette méthode pourrait être utilisée pour changer dynamiquement l'URL de l'API
    console.warn('La modification dynamique de l\'URL de base n\'est pas recommandée en production');
  }

  /**
   * Ajoute un header par défaut
   * @param key - Nom du header
   * @param value - Valeur du header
   */
  addDefaultHeader(key: string, value: string): void {
    // Cette méthode pourrait être utilisée pour ajouter des headers d'authentification
    console.warn('Ajout de header par défaut:', key);
  }

  /**
   * Vérifie si l'API est accessible
   * @returns Observable<boolean>
   */
  checkApiHealth(): Observable<boolean> {
    return this.get<{ status: string }>('/health').pipe(
      map(response => response.success && response.data?.status === 'OK'),
      catchError(() => throwError(() => false))
    );
  }
}
