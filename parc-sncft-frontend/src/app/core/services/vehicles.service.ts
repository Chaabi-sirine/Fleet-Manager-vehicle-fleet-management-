import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService, ApiResponse } from './api.service';

// Interfaces pour les véhicules
export interface Vehicle {
  id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  mileage: number;
  fuelType: FuelType;
  capacity: number; // Nombre de passagers ou tonnes de charge
  department: string;
  assignedDriver?: string;
  purchaseDate: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  insuranceExpiryDate?: Date;
  technicalInspectionDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  images?: string[];
  specifications?: VehicleSpecifications;
}

export type VehicleType = 'bus' | 'train' | 'truck' | 'car' | 'maintenance' | 'emergency';
export type VehicleStatus = 'disponible' | 'en_mission' | 'en_maintenance' | 'hors_service' | 'reserve';
export type FuelType = 'essence' | 'diesel' | 'electrique' | 'hybride' | 'gaz';

export interface VehicleSpecifications {
  engine: string;
  transmission: string;
  color: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  features?: string[];
}

export interface CreateVehicleRequest {
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  fuelType: FuelType;
  capacity: number;
  department: string;
  purchaseDate: Date;
  specifications?: VehicleSpecifications;
}

export interface UpdateVehicleRequest {
  registrationNumber?: string;
  brand?: string;
  model?: string;
  year?: number;
  type?: VehicleType;
  status?: VehicleStatus;
  mileage?: number;
  fuelType?: FuelType;
  capacity?: number;
  department?: string;
  assignedDriver?: string;
  specifications?: Partial<VehicleSpecifications>;
}

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private readonly endpoint = '/vehicules';

  constructor(private apiService: ApiService) {}

  // ============================================
  // MÉTHODES CRUD POUR LES VÉHICULES
  // ============================================

  /**
   * Récupère la liste de tous les véhicules
   * @param filters - Filtres optionnels
   * @returns Observable<ApiResponse<Vehicle[]>>
   */
  getAllVehicles(filters?: {
    type?: VehicleType;
    status?: VehicleStatus;
    department?: string;
    fuelType?: FuelType;
    search?: string;
    limit?: number;
    offset?: number;
  }): Observable<ApiResponse<Vehicle[]>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.department) params = params.set('department', filters.department);
      if (filters.fuelType) params = params.set('fuelType', filters.fuelType);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.offset) params = params.set('offset', filters.offset.toString());
    }

    return this.apiService.get<Vehicle[]>(this.endpoint, params);
  }

  /**
   * Récupère un véhicule par son ID
   * @param id - ID du véhicule
   * @returns Observable<ApiResponse<Vehicle>>
   */
  getVehicleById(id: string): Observable<ApiResponse<Vehicle>> {
    return this.apiService.get<Vehicle>(`${this.endpoint}/${id}`);
  }

  /**
   * Crée un nouveau véhicule
   * @param vehicleData - Données du véhicule à créer
   * @returns Observable<ApiResponse<Vehicle>>
   */
  createVehicle(vehicleData: CreateVehicleRequest): Observable<ApiResponse<Vehicle>> {
    return this.apiService.post<Vehicle>(this.endpoint, vehicleData);
  }

  /**
   * Met à jour un véhicule existant
   * @param id - ID du véhicule à mettre à jour
   * @param vehicleData - Nouvelles données du véhicule
   * @returns Observable<ApiResponse<Vehicle>>
   */
  updateVehicle(id: string, vehicleData: UpdateVehicleRequest): Observable<ApiResponse<Vehicle>> {
    return this.apiService.put<Vehicle>(`${this.endpoint}/${id}`, vehicleData);
  }

  /**
   * Supprime un véhicule
   * @param id - ID du véhicule à supprimer
   * @returns Observable<ApiResponse<void>>
   */
  deleteVehicle(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // ============================================
  // GESTION DU STATUT DES VÉHICULES
  // ============================================

  /**
   * Met à jour le statut d'un véhicule
   * @param id - ID du véhicule
   * @param status - Nouveau statut
   * @param reason - Raison du changement de statut
   * @returns Observable<ApiResponse<Vehicle>>
   */
  updateVehicleStatus(id: string, status: VehicleStatus, reason?: string): Observable<ApiResponse<Vehicle>> {
    return this.apiService.patch<Vehicle>(`${this.endpoint}/${id}/status`, { status, reason });
  }

  /**
   * Assigne un conducteur à un véhicule
   * @param vehicleId - ID du véhicule
   * @param driverId - ID du conducteur
   * @returns Observable<ApiResponse<Vehicle>>
   */
  assignDriver(vehicleId: string, driverId: string): Observable<ApiResponse<Vehicle>> {
    return this.apiService.patch<Vehicle>(`${this.endpoint}/${vehicleId}/driver`, { driverId });
  }

  /**
   * Libère un véhicule (retire l'assignation du conducteur)
   * @param vehicleId - ID du véhicule
   * @returns Observable<ApiResponse<Vehicle>>
   */
  unassignDriver(vehicleId: string): Observable<ApiResponse<Vehicle>> {
    return this.apiService.patch<Vehicle>(`${this.endpoint}/${vehicleId}/driver`, { driverId: null });
  }

  // ============================================
  // GESTION DE LA MAINTENANCE
  // ============================================

  /**
   * Met à jour le kilométrage d'un véhicule
   * @param id - ID du véhicule
   * @param mileage - Nouveau kilométrage
   * @returns Observable<ApiResponse<Vehicle>>
   */
  updateMileage(id: string, mileage: number): Observable<ApiResponse<Vehicle>> {
    return this.apiService.patch<Vehicle>(`${this.endpoint}/${id}/mileage`, { mileage });
  }

  /**
   * Récupère l'historique de maintenance d'un véhicule
   * @param id - ID du véhicule
   * @returns Observable<ApiResponse<MaintenanceRecord[]>>
   */
  getMaintenanceHistory(id: string): Observable<ApiResponse<MaintenanceRecord[]>> {
    return this.apiService.get<MaintenanceRecord[]>(`${this.endpoint}/${id}/maintenance`);
  }

  /**
   * Planifie une maintenance
   * @param vehicleId - ID du véhicule
   * @param maintenanceData - Données de la maintenance
   * @returns Observable<ApiResponse<MaintenanceRecord>>
   */
  scheduleMaintenance(vehicleId: string, maintenanceData: {
    type: string;
    scheduledDate: Date;
    description?: string;
    estimatedDuration?: number; // en heures
    priority: 'low' | 'medium' | 'high' | 'critical';
  }): Observable<ApiResponse<MaintenanceRecord>> {
    return this.apiService.post<MaintenanceRecord>(`${this.endpoint}/${vehicleId}/maintenance`, maintenanceData);
  }

  // ============================================
  // GESTION DES DOCUMENTS
  // ============================================

  /**
   * Upload d'images pour un véhicule
   * @param vehicleId - ID du véhicule
   * @param images - Fichiers images
   * @returns Observable<ApiResponse<{ imageUrls: string[] }>>
   */
  uploadVehicleImages(vehicleId: string, images: File[]): Observable<ApiResponse<{ imageUrls: string[] }>> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });
    
    return this.apiService.uploadFile<{ imageUrls: string[] }>(
      `${this.endpoint}/${vehicleId}/images`, 
      images[0], // Premier fichier requis pour la méthode
      { additionalImages: images.slice(1) } // Fichiers supplémentaires
    );
  }

  /**
   * Upload des documents d'un véhicule (assurance, contrôle technique, etc.)
   * @param vehicleId - ID du véhicule
   * @param documentType - Type de document
   * @param file - Fichier document
   * @returns Observable<ApiResponse<{ documentUrl: string }>>
   */
  uploadVehicleDocument(vehicleId: string, documentType: string, file: File): Observable<ApiResponse<{ documentUrl: string }>> {
    return this.apiService.uploadFile<{ documentUrl: string }>(
      `${this.endpoint}/${vehicleId}/documents/${documentType}`, 
      file
    );
  }

  // ============================================
  // STATISTIQUES ET RAPPORTS
  // ============================================

  /**
   * Récupère les statistiques des véhicules
   * @returns Observable<ApiResponse<VehicleStats>>
   */
  getVehicleStats(): Observable<ApiResponse<VehicleStats>> {
    return this.apiService.get<VehicleStats>(`${this.endpoint}/stats`);
  }

  /**
   * Récupère les véhicules disponibles pour une mission
   * @param startDate - Date de début de mission
   * @param endDate - Date de fin de mission
   * @param vehicleType - Type de véhicule requis
   * @returns Observable<ApiResponse<Vehicle[]>>
   */
  getAvailableVehicles(startDate: Date, endDate: Date, vehicleType?: VehicleType): Observable<ApiResponse<Vehicle[]>> {
    let params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    if (vehicleType) {
      params = params.set('type', vehicleType);
    }

    return this.apiService.get<Vehicle[]>(`${this.endpoint}/available`, params);
  }

  /**
   * Récupère les véhicules nécessitant une maintenance
   * @param urgencyLevel - Niveau d'urgence
   * @returns Observable<ApiResponse<Vehicle[]>>
   */
  getVehiclesNeedingMaintenance(urgencyLevel?: 'due' | 'overdue' | 'upcoming'): Observable<ApiResponse<Vehicle[]>> {
    let params = new HttpParams();
    if (urgencyLevel) {
      params = params.set('urgency', urgencyLevel);
    }
    
    return this.apiService.get<Vehicle[]>(`${this.endpoint}/maintenance-needed`, params);
  }

  // ============================================
  // RECHERCHE ET FILTRAGE
  // ============================================

  /**
   * Recherche des véhicules par terme
   * @param searchTerm - Terme de recherche
   * @returns Observable<ApiResponse<Vehicle[]>>
   */
  searchVehicles(searchTerm: string): Observable<ApiResponse<Vehicle[]>> {
    const params = new HttpParams().set('search', searchTerm);
    return this.apiService.get<Vehicle[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Récupère les véhicules par département
   * @param department - Nom du département
   * @returns Observable<ApiResponse<Vehicle[]>>
   */
  getVehiclesByDepartment(department: string): Observable<ApiResponse<Vehicle[]>> {
    const params = new HttpParams().set('department', department);
    return this.apiService.get<Vehicle[]>(this.endpoint, params);
  }

  /**
   * Exporte la liste des véhicules
   * @param format - Format d'export (Excel, CSV)
   * @param filters - Filtres à appliquer
   * @returns Observable<Blob>
   */
  exportVehicles(format: 'Excel' | 'CSV' = 'Excel', filters?: {
    type?: VehicleType;
    status?: VehicleStatus;
    department?: string;
  }): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    
    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.department) params = params.set('department', filters.department);
    }

    return this.apiService.downloadFile(`${this.endpoint}/export?${params.toString()}`);
  }
}

// ============================================
// INTERFACES SUPPLÉMENTAIRES
// ============================================

export interface VehicleStats {
  totalVehicles: number;
  availableVehicles: number;
  vehiclesInMission: number;
  vehiclesInMaintenance: number;
  vehiclesOutOfService: number;
  vehiclesByType: { [type: string]: number };
  vehiclesByDepartment: { [department: string]: number };
  averageAge: number;
  totalMileage: number;
  upcomingMaintenances: number;
  overdueMaintenances: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description?: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  technicianId?: string;
  cost?: number;
  parts?: MaintenancePart[];
  notes?: string;
  duration?: number; // en heures
  mileageAtMaintenance?: number;
}

export interface MaintenancePart {
  name: string;
  quantity: number;
  unitCost: number;
  supplier?: string;
  partNumber?: string;
}
