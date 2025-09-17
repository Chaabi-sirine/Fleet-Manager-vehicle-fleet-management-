import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface VehicleStats {
  total: number;
  disponible: number;
  enMission: number;
  enMaintenance: number;
  horsService: number;
}

interface MissionStats {
  total: number;
  enCours: number;
  terminees: number;
  annulees: number;
}

interface EntretienStats {
  total: number;
  planifies: number;
  enCours: number;
  enRetard: number;
  termines: number;
}

interface RecentMission {
  id: string;
  titre: string;
  vehicule: string;
  conducteur: string;
  status: 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
  dateDebut: Date;
  dateFin?: Date;
  destination: string;
}

interface RecentEntretien {
  id: string;
  vehicule: string;
  type: string;
  technicien: string;
  datePrevue: Date;
  status: 'planifie' | 'en-cours' | 'termine' | 'en-retard';
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
}

interface AlerteCritique {
  id: string;
  type: 'entretien_retard' | 'vehicule_hors_service' | 'revision_technique' | 'carburant_faible' | 'utilisateur_inactif';
  titre: string;
  message: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dateCreation: Date;
  isResolved: boolean;
}

interface ActiviteRecente {
  id: string;
  action: string;
  details: string;
  utilisateur: string;
  icone: string;
  timestamp: Date;
  type: 'mission' | 'entretien' | 'vehicule' | 'utilisateur' | 'rapport';
}

// ============================================
// REPORTS & NOTIFICATIONS INTERFACES
// ============================================
interface Report {
  id: string;
  title: string;
  description: string;
  type: 'monthly' | 'weekly' | 'maintenance' | 'financial';
  status: 'ready' | 'generating' | 'scheduled';
  lastGenerated: Date;
  fileSize: string;
  filePath?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'maintenance';
  isRead: boolean;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
}

interface MissionEvolutionData {
  labels: string[];
  data: number[];
  maxValue: number;
  avgValue: number;
  trend: 'up' | 'down' | 'neutral';
}

interface ChartPoint {
  x: number;
  y: number;
}

interface GraphiqueData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  
  constructor(private router: Router) {}

  // ============================================
  // REFRESH FUNCTIONALITY
  // ============================================
  isRefreshing = false;

  ngOnInit(): void {
    // Initialization logic if needed
  }

  refreshDashboard(): void {
    this.isRefreshing = true;
    
    // Simulate data refresh with realistic timing
    setTimeout(() => {
      this.simulateDataRefresh();
      this.isRefreshing = false;
    }, 1200);
  }

  private simulateDataRefresh(): void {
    // Simulate slight variations in the data
    this.vehicleStats.disponible = Math.max(15, Math.min(25, this.vehicleStats.disponible + (Math.random() - 0.5) * 4));
    this.missionStats.enCours = Math.max(2, Math.min(8, this.missionStats.enCours + (Math.random() - 0.5) * 2));
    this.entretienStats.enRetard = Math.max(3, Math.min(12, this.entretienStats.enRetard + (Math.random() - 0.5) * 2));
  }

  // ============================================
  // STATISTIQUES PRINCIPALES (KPI)
  // ============================================
  vehicleStats: VehicleStats = {
    total: 32,
    disponible: 19,
    enMission: 8,
    enMaintenance: 3,
    horsService: 2
  };

  missionStats: MissionStats = {
    total: 156,
    enCours: 5,
    terminees: 143,
    annulees: 8
  };

  entretienStats: EntretienStats = {
    total: 89,
    planifies: 12,
    enCours: 3,
    enRetard: 7,
    termines: 67
  };

  alertesCritiques = 4;
  consommationCarburant = 2847;
  coutMoyenMission = 385;
  totalUtilisateurs = 28;

  // ============================================
  // DONNÉES DYNAMIQUES
  // ============================================
  recentMissions: RecentMission[] = [
    {
      id: 'M001',
      titre: 'Transport Passagers Ligne A-B',
      vehicule: 'Bus Mercedes Citaro',
      conducteur: 'Ahmed Ben Salah',
      status: 'EN_COURS',
      dateDebut: new Date('2024-01-15T08:30:00'),
      destination: 'Tunis → Sfax'
    },
    {
      id: 'M002',
      titre: 'Transport Marchandises',
      vehicule: 'Locomotive Diesel L-2023',
      conducteur: 'Mohamed Triki',
      status: 'TERMINEE',
      dateDebut: new Date('2024-01-15T06:15:00'),
      dateFin: new Date('2024-01-15T14:45:00'),
      destination: 'Sousse → Gabès'
    },
    {
      id: 'M003',
      titre: 'Service Maintenance Mobile',
      vehicule: 'Camion Atelier CAT-05',
      conducteur: 'Fatma Karray',
      status: 'EN_COURS',
      dateDebut: new Date('2024-01-15T09:00:00'),
      destination: 'Intervention Gare Centrale'
    }
  ];

  recentEntretiens: RecentEntretien[] = [
    {
      id: 'E001',
      vehicule: 'Train Régional TR-005',
      type: 'Maintenance Préventive',
      technicien: 'Karim Hajri',
      datePrevue: new Date('2024-01-16T14:00:00'),
      status: 'planifie',
      priorite: 'moyenne'
    },
    {
      id: 'E002',
      vehicule: 'Bus Iveco Crossway',
      type: 'Révision Technique',
      technicien: 'Sami Bouaziz',
      datePrevue: new Date('2024-01-15T16:30:00'),
      status: 'en-cours',
      priorite: 'haute'
    },
    {
      id: 'E003',
      vehicule: 'Locomotive Électrique LE-2024',
      type: 'Réparation Système Freinage',
      technicien: 'Nadia Cherif',
      datePrevue: new Date('2024-01-14T10:00:00'),
      status: 'en-retard',
      priorite: 'critique'
    }
  ];

  alertes: AlerteCritique[] = [
    {
      id: 'A001',
      type: 'entretien_retard',
      titre: 'Maintenance en retard',
      message: 'Le véhicule Bus Mercedes Citaro nécessite une maintenance depuis le 03/08/2025',
      description: 'Entretien préventif programmé il y a 5 jours',
      severity: 'high',
      dateCreation: new Date('2024-01-10'),
      isResolved: false
    },
    {
      id: 'A002',
      type: 'revision_technique',
      titre: 'Révision technique expirée',
      message: 'Train Régional R3 - Révision technique expirée depuis 2 jours',
      description: 'Contrôle technique requis avant reprise service',
      severity: 'critical',
      dateCreation: new Date('2024-01-13'),
      isResolved: false
    },
    {
      id: 'A003',
      type: 'vehicule_hors_service',
      titre: 'Véhicule hors service',
      message: 'Locomotive L2 indisponible - Panne système électrique',
      description: 'Intervention technique requise en urgence',
      severity: 'high',
      dateCreation: new Date('2024-01-14'),
      isResolved: false
    },
    {
      id: 'A004',
      type: 'carburant_faible',
      titre: 'Niveau carburant critique',
      message: 'Réservoir Station A - Niveau critique (< 10%)',
      description: 'Ravitaillement urgent requis',
      severity: 'medium',
      dateCreation: new Date('2024-01-15'),
      isResolved: false
    }
  ];

  activitesRecentes: ActiviteRecente[] = [
    {
      id: 'ACT001',
      action: 'Nouvelle mission créée',
      details: 'Transport Passagers Ligne A-B - Départ 08:30',
      utilisateur: 'Ahmed Ben Salah',
      icone: '🚌',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'mission'
    },
    {
      id: 'ACT002',
      action: 'Maintenance terminée',
      details: 'Révision technique Bus Iveco - Durée: 2h30',
      utilisateur: 'Sami Bouaziz',
      icone: '🔧',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'entretien'
    },
    {
      id: 'ACT003',
      action: 'Véhicule ajouté',
      details: 'Nouveau Bus Mercedes Citaro - Immatriculation: TN-1234-A',
      utilisateur: 'Fatma Karray',
      icone: '🚐',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'vehicule'
    },
    {
      id: 'ACT004',
      action: 'Utilisateur connecté',
      details: 'Connexion système - Poste: Dispatching',
      utilisateur: 'Mohamed Triki',
      icone: '👤',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: 'utilisateur'
    }
  ];

  // ============================================
  // REPORTS & NOTIFICATIONS SYSTEM
  // ============================================
  
  availableReports: Report[] = [
    {
      id: 'monthly-01',
      title: 'Rapport Mensuel',
      description: 'Synthèse complète des activités et performances du mois',
      type: 'monthly',
      status: 'ready',
      lastGenerated: new Date('2024-01-15'),
      fileSize: '2.4 MB'
    },
    {
      id: 'weekly-01',
      title: 'Rapport Hebdomadaire',
      description: 'Analyse détaillée des opérations de la semaine',
      type: 'weekly',
      status: 'generating',
      lastGenerated: new Date('2024-01-08'),
      fileSize: '847 KB'
    },
    {
      id: 'maintenance-01',
      title: 'Rapport Maintenance',
      description: 'État et planification des interventions techniques',
      type: 'maintenance',
      status: 'ready',
      lastGenerated: new Date('2024-01-10'),
      fileSize: '1.8 MB'
    },
    {
      id: 'financial-01',
      title: 'Rapport Financier',
      description: 'Analyse des coûts et revenus par département',
      type: 'financial',
      status: 'scheduled',
      lastGenerated: new Date('2024-01-05'),
      fileSize: '3.2 MB'
    }
  ];

  recentNotifications: Notification[] = [
    {
      id: 'notif-001',
      title: 'Maintenance Critique',
      message: 'Le véhicule Bus Mercedes #B-2024 nécessite une intervention immédiate. Système de freinage défaillant détecté.',
      type: 'alert',
      isRead: false,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      priority: 'urgent'
    },
    {
      id: 'notif-002',
      title: 'Mission Terminée',
      message: 'La mission Transport Passagers Ligne A-B a été complétée avec succès. Durée: 2h15min.',
      type: 'success',
      isRead: false,
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      priority: 'medium'
    },
    {
      id: 'notif-003',
      title: 'Nouvelle Réservation',
      message: 'Réservation urgente reçue pour Transport Marchandises - Départ prévu dans 3 heures.',
      type: 'info',
      isRead: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      priority: 'high'
    },
    {
      id: 'notif-004',
      title: 'Entretien Programmé',
      message: 'Rappel: Maintenance préventive du Train Régional TR-005 prévue demain à 14h00.',
      type: 'maintenance',
      isRead: true,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      priority: 'medium'
    },
    {
      id: 'notif-005',
      title: 'Alerte Carburant',
      message: 'Niveau de carburant faible détecté sur Locomotive L-2023. Ravitaillement recommandé.',
      type: 'alert',
      isRead: false,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      priority: 'high'
    }
  ];

  // ============================================
  // CHART DATA
  // ============================================
  missionEvolutionData: MissionEvolutionData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    data: [12, 19, 15, 25, 22, 18, 20],
    maxValue: 25,
    avgValue: 18.7,
    trend: 'up'
  };

  // Mission chart tooltip properties
  showMissionTooltip = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipValue = 0;
  tooltipDate = '';

  // ============================================
  // UTILITY METHODS
  // ============================================
  getCurrentTime(): Date {
    return new Date();
  }

  formatDateShort(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getVehicleStatusPercentage(status: keyof VehicleStats): number {
    if (status === 'total') return 100;
    return Math.round((this.vehicleStats[status] / this.vehicleStats.total) * 100);
  }

  getMissionStatusLabel(status: string): string {
    switch (status) {
      case 'EN_COURS': return 'En Cours';
      case 'TERMINEE': return 'Terminée';
      case 'ANNULEE': return 'Annulée';
      default: return status;
    }
  }

  getEntretienStatusLabel(status: string): string {
    switch (status) {
      case 'planifie': return 'Planifié';
      case 'en-cours': return 'En Cours';
      case 'termine': return 'Terminé';
      case 'en-retard': return 'En Retard';
      default: return status;
    }
  }

  // ============================================
  // NAVIGATION METHODS (Actions Rapides)
  // ============================================
  nouvelleMission(): void {
    this.triggerActionFeedback();
    this.router.navigate(['/missions'], { queryParams: { action: 'create' } });
  }

  ajouterVehicule(): void {
    this.triggerActionFeedback();
    this.router.navigate(['/vehicles'], { queryParams: { action: 'create' } });
  }

  planifierEntretien(): void {
    this.triggerActionFeedback();
    this.router.navigate(['/entretiens'], { queryParams: { action: 'create' } });
  }

  creerUtilisateur(): void {
    this.triggerActionFeedback();
    this.router.navigate(['/users'], { queryParams: { action: 'create' } });
  }

  ajouterBonCarburant(): void {
    this.triggerActionFeedback();
    this.router.navigate(['/fuel'], { queryParams: { action: 'create' } });
  }

  private triggerActionFeedback(): void {
    // Visual feedback for user actions
    console.log('Action triggered successfully');
  }

  // ============================================
  // ALERT MANAGEMENT
  // ============================================
  voirDetailsAlerte(alerte: AlerteCritique): void {
    console.log('Viewing alert details:', alerte.titre);
  }

  dismissAlerte(alerte: AlerteCritique): void {
    const index = this.alertes.indexOf(alerte);
    if (index > -1) {
      this.alertes.splice(index, 1);
      this.alertesCritiques = this.alertes.length;
    }
  }

  // ============================================
  // CHART METHODS
  // ============================================
  getMissionChartPeriod(): string {
    return '15-21 Janvier 2024';
  }

  getMissionAreaPath(): string {
    const points = this.getMissionDataPoints();
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} 250`;
    points.forEach(point => {
      path += ` L ${point.x} ${point.y}`;
    });
    path += ` L ${points[points.length - 1].x} 250 Z`;
    
    return path;
  }

  getMissionLinePath(): string {
    const points = this.getMissionDataPoints();
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    points.forEach(point => {
      path += ` L ${point.x} ${point.y}`;
    });
    
    return path;
  }

  getMissionDataPoints(): ChartPoint[] {
    const width = 700;
    const height = 180;
    const margin = 20;
    const data = this.missionEvolutionData.data;
    const maxValue = Math.max(...data);
    
    return data.map((value, index) => ({
      x: margin + (index * (width - 2 * margin)) / (data.length - 1),
      y: margin + (height - 2 * margin) - ((value / maxValue) * (height - 2 * margin))
    }));
  }

  getMissionPeaks(): ChartPoint[] {
    const points = this.getMissionDataPoints();
    const data = this.missionEvolutionData.data;
    const peaks: ChartPoint[] = [];

    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] >= 30) {
        peaks.push(points[i]);
      }
    }

    return peaks;
  }

  getMissionValleys(): ChartPoint[] {
    const points = this.getMissionDataPoints();
    const data = this.missionEvolutionData.data;
    const valleys: ChartPoint[] = [];

    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] < data[i - 1] && data[i] < data[i + 1] && data[i] <= 15) {
        valleys.push(points[i]);
      }
    }

    return valleys;
  }

  getMissionDailyAverage(): number {
    return Math.round(this.missionEvolutionData.avgValue * 10) / 10;
  }

  getMissionMaxValue(): number {
    return this.missionEvolutionData.maxValue;
  }

  getMissionTrend(): string {
    switch (this.missionEvolutionData.trend) {
      case 'up': return '↗ En hausse';
      case 'down': return '↘ En baisse';
      default: return '→ Stable';
    }
  }

  getMissionTrendClass(): string {
    switch (this.missionEvolutionData.trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-neutral';
    }
  }

  showTooltip(event: MouseEvent, value: number, label: string): void {
    this.showMissionTooltip = true;
    this.tooltipX = event.clientX - 300; // Ajuster la position
    this.tooltipY = event.clientY - 100;
    this.tooltipValue = value;
    this.tooltipDate = label;
  }

  hideTooltip(): void {
    this.showMissionTooltip = false;
  }

  // ============================================
  // REPORTS METHODS
  // ============================================

  generateAllReports(): void {
    this.availableReports.forEach(report => {
      if (report.status === 'ready') {
        report.status = 'generating';
      }
    });
    
    // Simulate report generation
    setTimeout(() => {
      this.availableReports.forEach(report => {
        if (report.status === 'generating') {
          report.status = 'ready';
          report.lastGenerated = new Date();
        }
      });
    }, 2000);
  }

  openReport(report: Report): void {
    console.log('Opening report:', report.title);
    // Implementation for opening report details
  }

  downloadReport(report: Report, event: Event): void {
    event.stopPropagation();
    console.log('Downloading report:', report.title);
    // Implementation for downloading report
  }

  viewReport(report: Report, event: Event): void {
    event.stopPropagation();
    console.log('Viewing report:', report.title);
    // Implementation for viewing report preview
  }

  getReportIcon(type: string): string {
    switch (type) {
      case 'monthly':
        return 'M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z';
      case 'weekly':
        return 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z';
      case 'maintenance':
        return 'M22,21H2V19H3V4A1,1 0 0,1 4,3H20A1,1 0 0,1 21,4V19H22V21Z';
      case 'financial':
        return 'M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z';
      default:
        return 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z';
    }
  }

  getReportStatusText(status: string): string {
    switch (status) {
      case 'ready': return 'Prêt';
      case 'generating': return 'En cours';
      case 'scheduled': return 'Planifié';
      default: return 'Inconnu';
    }
  }

  // ============================================
  // NOTIFICATIONS METHODS
  // ============================================

  markAllAsRead(): void {
    this.recentNotifications.forEach(notification => {
      notification.isRead = true;
    });
  }

  getNotificationCount(type: 'unread' | 'today' | 'urgent'): number {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (type) {
      case 'unread':
        return this.recentNotifications.filter(n => !n.isRead).length;
      case 'today':
        return this.recentNotifications.filter(n => n.timestamp >= todayStart).length;
      case 'urgent':
        return this.recentNotifications.filter(n => n.priority === 'urgent' && !n.isRead).length;
      default:
        return 0;
    }
  }

  readNotification(notification: Notification): void {
    notification.isRead = true;
    console.log('Reading notification:', notification.title);
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    notification.isRead = true;
  }

  dismissNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    const index = this.recentNotifications.indexOf(notification);
    if (index > -1) {
      this.recentNotifications.splice(index, 1);
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'alert':
        return 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z';
      case 'info':
        return 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z';
      case 'success':
        return 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z';
      case 'maintenance':
        return 'M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z';
      default:
        return 'M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2ZM13,17H11V15H13V17ZM13,13H11V7H13V13Z';
    }
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'À l\'instant';
    } else if (minutes < 60) {
      return `il y a ${minutes}min`;
    } else if (hours < 24) {
      return `il y a ${hours}h`;
    } else {
      return `il y a ${days}j`;
    }
  }
}
