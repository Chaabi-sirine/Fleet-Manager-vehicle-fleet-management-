import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService, ApiResponse } from './api.service';

// Interfaces pour les rapports
export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'monthly' | 'weekly' | 'maintenance' | 'financial';
  status: 'ready' | 'generating' | 'scheduled';
  lastGenerated: Date;
  fileSize: string;
  filePath?: string;
  createdBy?: string;
  parameters?: ReportParameters;
}

export interface ReportParameters {
  startDate?: Date;
  endDate?: Date;
  vehicleIds?: string[];
  departmentIds?: string[];
  includeGraphics?: boolean;
  format?: 'PDF' | 'Excel' | 'CSV';
}

export interface ReportGenerationRequest {
  type: Report['type'];
  title: string;
  description?: string;
  parameters: ReportParameters;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly endpoint = '/rapports';

  constructor(private apiService: ApiService) {}

  // ============================================
  // MÉTHODES CRUD POUR LES RAPPORTS
  // ============================================

  /**
   * Récupère la liste de tous les rapports
   * @param filters - Filtres optionnels
   * @returns Observable<ApiResponse<Report[]>>
   */
  getAllReports(filters?: {
    type?: Report['type'];
    status?: Report['status'];
    limit?: number;
    offset?: number;
  }): Observable<ApiResponse<Report[]>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.offset) params = params.set('offset', filters.offset.toString());
    }

    return this.apiService.get<Report[]>(this.endpoint, params);
  }

  /**
   * Récupère un rapport par son ID
   * @param id - ID du rapport
   * @returns Observable<ApiResponse<Report>>
   */
  getReportById(id: string): Observable<ApiResponse<Report>> {
    return this.apiService.get<Report>(`${this.endpoint}/${id}`);
  }

  /**
   * Crée un nouveau rapport
   * @param reportData - Données du rapport à créer
   * @returns Observable<ApiResponse<Report>>
   */
  createReport(reportData: ReportGenerationRequest): Observable<ApiResponse<Report>> {
    return this.apiService.post<Report>(this.endpoint, reportData);
  }

  /**
   * Met à jour un rapport existant
   * @param id - ID du rapport à mettre à jour
   * @param reportData - Nouvelles données du rapport
   * @returns Observable<ApiResponse<Report>>
   */
  updateReport(id: string, reportData: Partial<Report>): Observable<ApiResponse<Report>> {
    return this.apiService.put<Report>(`${this.endpoint}/${id}`, reportData);
  }

  /**
   * Supprime un rapport
   * @param id - ID du rapport à supprimer
   * @returns Observable<ApiResponse<void>>
   */
  deleteReport(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES POUR LES RAPPORTS
  // ============================================

  /**
   * Génère un rapport
   * @param id - ID du rapport à générer
   * @returns Observable<ApiResponse<{ jobId: string }>>
   */
  generateReport(id: string): Observable<ApiResponse<{ jobId: string }>> {
    return this.apiService.post<{ jobId: string }>(`${this.endpoint}/${id}/generate`, {});
  }

  /**
   * Télécharge un rapport généré
   * @param id - ID du rapport
   * @param format - Format du fichier (PDF, Excel, CSV)
   * @returns Observable<Blob>
   */
  downloadReport(id: string, format: 'PDF' | 'Excel' | 'CSV' = 'PDF'): Observable<Blob> {
    return this.apiService.downloadFile(`${this.endpoint}/${id}/download?format=${format}`);
  }

  /**
   * Obtient l'aperçu d'un rapport
   * @param id - ID du rapport
   * @returns Observable<ApiResponse<any>>
   */
  getReportPreview(id: string): Observable<ApiResponse<any>> {
    return this.apiService.get<any>(`${this.endpoint}/${id}/preview`);
  }

  /**
   * Vérifie le statut de génération d'un rapport
   * @param jobId - ID du job de génération
   * @returns Observable<ApiResponse<{ status: string; progress: number }>>
   */
  checkGenerationStatus(jobId: string): Observable<ApiResponse<{ status: string; progress: number }>> {
    return this.apiService.get<{ status: string; progress: number }>(`/jobs/${jobId}/status`);
  }

  /**
   * Planifie la génération automatique d'un rapport
   * @param id - ID du rapport
   * @param schedule - Configuration de la planification
   * @returns Observable<ApiResponse<void>>
   */
  scheduleReport(id: string, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    enabled: boolean;
  }): Observable<ApiResponse<void>> {
    return this.apiService.post<void>(`${this.endpoint}/${id}/schedule`, schedule);
  }

  /**
   * Récupère l'historique des générations d'un rapport
   * @param id - ID du rapport
   * @returns Observable<ApiResponse<ReportHistory[]>>
   */
  getReportHistory(id: string): Observable<ApiResponse<ReportHistory[]>> {
    return this.apiService.get<ReportHistory[]>(`${this.endpoint}/${id}/history`);
  }

  // ============================================
  // MÉTHODES DE RECHERCHE ET FILTRAGE
  // ============================================

  /**
   * Recherche des rapports par terme
   * @param searchTerm - Terme de recherche
   * @param filters - Filtres supplémentaires
   * @returns Observable<ApiResponse<Report[]>>
   */
  searchReports(searchTerm: string, filters?: {
    type?: Report['type'];
    status?: Report['status'];
  }): Observable<ApiResponse<Report[]>> {
    let params = new HttpParams().set('search', searchTerm);
    
    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.status) params = params.set('status', filters.status);
    }

    return this.apiService.get<Report[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Récupère les rapports récents
   * @param limit - Nombre de rapports à récupérer
   * @returns Observable<ApiResponse<Report[]>>
   */
  getRecentReports(limit: number = 10): Observable<ApiResponse<Report[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.apiService.get<Report[]>(`${this.endpoint}/recent`, params);
  }

  /**
   * Récupère les rapports par type
   * @param type - Type de rapport
   * @returns Observable<ApiResponse<Report[]>>
   */
  getReportsByType(type: Report['type']): Observable<ApiResponse<Report[]>> {
    const params = new HttpParams().set('type', type);
    return this.apiService.get<Report[]>(this.endpoint, params);
  }

  // ============================================
  // MÉTHODES DE TEMPLATE ET MODÈLES
  // ============================================

  /**
   * Récupère les modèles de rapports disponibles
   * @returns Observable<ApiResponse<ReportTemplate[]>>
   */
  getReportTemplates(): Observable<ApiResponse<ReportTemplate[]>> {
    return this.apiService.get<ReportTemplate[]>('/rapport-templates');
  }

  /**
   * Crée un rapport à partir d'un modèle
   * @param templateId - ID du modèle
   * @param parameters - Paramètres du rapport
   * @returns Observable<ApiResponse<Report>>
   */
  createReportFromTemplate(templateId: string, parameters: ReportParameters): Observable<ApiResponse<Report>> {
    return this.apiService.post<Report>(`/rapport-templates/${templateId}/create`, parameters);
  }
}

// ============================================
// INTERFACES SUPPLÉMENTAIRES
// ============================================

export interface ReportHistory {
  id: string;
  reportId: string;
  generatedAt: Date;
  status: 'success' | 'failed' | 'processing';
  fileSize?: string;
  filePath?: string;
  errorMessage?: string;
  generatedBy: string;
  duration?: number; // en secondes
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: Report['type'];
  requiredParameters: string[];
  optionalParameters: string[];
  outputFormats: Array<'PDF' | 'Excel' | 'CSV'>;
  previewImageUrl?: string;
}
