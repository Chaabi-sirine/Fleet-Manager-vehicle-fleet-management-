/**
 * Structure : Relation des Entités
 *
 * 1. Véhicules :
 *    - Un véhicule peut être affecté à plusieurs missions (par son vehicleId).
 *    - Être lié à des consommations de carburant.
 *    - Avoir un historique de kilométrage (via les entretiens ou les données spécifiques).
 *    - Avoir des entretiens.
 *    - Relation : One-to-Many (Véhicule → Missions, Carburants, Entretiens).
 *
 * 2. Missions :
 *    - Une mission est associée à un véhicule (via vehicleId).
 *    - Est assignée à un utilisateur/responsable (via assigneeId).
 *    - Relation : One-to-Many (Mission → Véhicule, Utilisateur).
 *
 * 3. Carburant :
 *    - Une consommation de carburant est liée à un véhicule (via vehicleId).
 *    - Relation : One-to-Many (Véhicule → Consommations de carburant).
 *
 * 4. Entretiens :
 *    - Un entretien est associé à un véhicule (via vehicleId).
 *    - Relation : One-to-Many (Véhicule → Entretiens).
 *
 * 5. Utilisateurs :
 *    - Peuvent être responsables ou assignés à des missions (via assigneeId dans la mission).
 *    - Peuvent avoir des rôles spécifiques (conducteur, administrateur, responsable).
 *    - Relation : One-to-Many (Utilisateur → Missions assignées).
 *
 * 6. Rapports :
 *    - Les rapports rassemblent des données sur les véhicules (missions, carburant, entretiens),
 *      sur les missions réalisées dans une période donnée, sur les utilisateurs et leurs performances.
 *
 * Exemple de workflow d'intégration :
 * 1. Ajout d'un véhicule : POST /api/v1/vehicules
 * 2. Création d'une mission : POST /api/v1/missions
 * 3. Consommation de carburant : POST /api/v1/carburant
 * 4. Suivi des entretiens : POST /api/v1/entretiens
 * 5. Génération de rapports : GET /api/v1/rapports?type=...&startDate=...&endDate=...
 *
 * Les relations dans MongoDB sont matérialisées par des références d’IDs.
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  
  // URL de base du backend Spring Boot
  public readonly baseUrl = 'http://localhost:8080/api/v1';
  // Configuration des endpoints de l'API
  public readonly endpoints = {
    // Endpoints principaux
    rapports: '/rapports',
    utilisateurs: '/utilisateurs',
    vehicules: '/vehicules',
    missions: '/missions',
    entretiens: '/entretiens',
    
    // Endpoints spécialisés
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh-token',
      profile: '/auth/profile'
    },
    
    rapports_ops: {
      generate: (id: string) => `/rapports/${id}/generate`,
      download: (id: string, format = 'PDF') => `/rapports/${id}/download?format=${format}`,
      preview: (id: string) => `/rapports/${id}/preview`,
      schedule: (id: string) => `/rapports/${id}/schedule`,
      history: (id: string) => `/rapports/${id}/history`,
      templates: '/rapport-templates',
      createFromTemplate: (templateId: string) => `/rapport-templates/${templateId}/create`
    },
    
    utilisateurs_ops: {
      search: '/utilisateurs/search',
      stats: '/utilisateurs/stats',
      recentActivity: '/utilisateurs/recent-activity',
      activity: (id: string) => `/utilisateurs/${id}/activity`,
      permissions: (id: string) => `/utilisateurs/${id}/permissions`,
      resetPassword: (id: string) => `/utilisateurs/${id}/reset-password`,
      avatar: (id: string) => `/utilisateurs/${id}/avatar`,
      status: (id: string) => `/utilisateurs/${id}/status`,
      role: (id: string) => `/utilisateurs/${id}/role`,
      export: '/utilisateurs/export'
    },
    
    vehicules_ops: {
      search: '/vehicules/search',
      stats: '/vehicules/stats',
      available: '/vehicules/available',
      maintenanceNeeded: '/vehicules/maintenance-needed',
      status: (id: string) => `/vehicules/${id}/status`,
      driver: (id: string) => `/vehicules/${id}/driver`,
      mileage: (id: string) => `/vehicules/${id}/mileage`,
      maintenance: (id: string) => `/vehicules/${id}/maintenance`,
      images: (id: string) => `/vehicules/${id}/images`,
      documents: (id: string, docType: string) => `/vehicules/${id}/documents/${docType}`,
      export: '/vehicules/export'
    },
    
    // Endpoints système
    system: {
      health: '/health',
      version: '/version',
      stats: '/system/stats'
    },
    
    // Endpoints de jobs/tâches asynchrones
    jobs: {
      status: (jobId: string) => `/jobs/${jobId}/status`,
      cancel: (jobId: string) => `/jobs/${jobId}/cancel`,
      list: '/jobs'
    },
    
    // Endpoints de roles et permissions
    roles: '/roles',
    permissions: '/permissions'
  };

  // Configuration des paramètres HTTP
  public readonly httpConfig = {
    timeout: 30000, // 30 secondes
    retryCount: 1,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  // Formats de données supportés
  public readonly formats = {
    export: ['Excel', 'CSV', 'PDF'] as const,
    report: ['PDF', 'Excel', 'CSV'] as const,
    image: ['jpg', 'jpeg', 'png', 'gif'] as const,
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx'] as const
  };

  // Limites par défaut
  public readonly defaults = {
    pageSize: 20,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    searchMinLength: 3,
    refreshInterval: 30000 // 30 secondes
  };

  constructor() {}

  /**
   * Construit une URL complète pour un endpoint
   * @param endpoint - Endpoint ou fonction d'endpoint
   * @param params - Paramètres pour les endpoints dynamiques
   * @returns URL complète
   */
  buildEndpointUrl(endpoint: string | Function, ...params: any[]): string {
    if (typeof endpoint === 'function') {
      return endpoint(...params);
    }
    return endpoint;
  }

  /**
   * Valide si un format est supporté
   * @param format - Format à valider
   * @param type - Type de format (export, report, etc.)
   * @returns boolean
   */
  isFormatSupported(format: string, type: keyof typeof this.formats): boolean {
    const supportedFormats = this.formats[type] as readonly string[];
    return supportedFormats.includes(format);
  }

  /**
   * Obtient la configuration pour un type d'opération
   * @param operation - Type d'opération
   * @returns Configuration spécifique
   */
  getOperationConfig(operation: 'upload' | 'download' | 'search' | 'export') {
    const configs = {
      upload: {
        maxFileSize: this.defaults.maxFileSize,
        supportedFormats: [...this.formats.image, ...this.formats.document],
        timeout: 60000 // 1 minute pour les uploads
      },
      download: {
        responseType: 'blob' as const,
        timeout: 120000 // 2 minutes pour les downloads
      },
      search: {
        minSearchLength: this.defaults.searchMinLength,
        debounceTime: 300
      },
      export: {
        supportedFormats: this.formats.export,
        timeout: 180000 // 3 minutes pour les exports
      }
    };

    return configs[operation];
  }
}
