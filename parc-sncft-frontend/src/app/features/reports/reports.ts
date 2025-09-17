import { Component, OnInit } from '@angular/core';

interface ReportType {
  id: string;
  title: string;
  description: string;
  type: 'operations' | 'financial' | 'maintenance' | 'hr';
  totalRecords: number;
  lastUpdate: Date;
  fileSize: string;
  topMetrics?: Array<{label: string, value: string, percentage: number}>;
  recentData?: string[][];
  tableHeaders?: string[];
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  format: 'pdf' | 'csv';
  generatedAt: Date;
  size: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports implements OnInit {
  // Filter properties
  selectedPeriod: string = 'month';
  selectedType: string = '';
  startDate: string = '';
  endDate: string = '';

  // Available reports with detailed data
  availableReports: ReportType[] = [
    {
      id: 'operations-summary',
      title: 'Résumé Opérationnel',
      description: 'Vue d\'ensemble des opérations ferroviaires',
      type: 'operations',
      totalRecords: 2847,
      lastUpdate: new Date('2025-08-07T16:30:00'),
      fileSize: '3.2 MB',
      topMetrics: [
        { label: 'Trains en service', value: '85', percentage: 85 },
        { label: 'Ponctualité', value: '92%', percentage: 92 },
        { label: 'Taux de remplissage', value: '78%', percentage: 78 },
        { label: 'Incidents résolus', value: '96%', percentage: 96 }
      ],
      recentData: [
        ['Ligne 1', 'Active', '95%', '1250'],
        ['Ligne 2', 'Active', '88%', '1050'],
        ['Ligne 3', 'Maintenance', '0%', '0'],
        ['Ligne 4', 'Active', '91%', '980']
      ],
      tableHeaders: ['Ligne', 'Statut', 'Ponctualité', 'Passagers']
    },
    {
      id: 'financial-analysis',
      title: 'Analyse Financière',
      description: 'Revenus, coûts et rentabilité détaillés',
      type: 'financial',
      totalRecords: 1653,
      lastUpdate: new Date('2025-08-07T14:20:00'),
      fileSize: '2.8 MB',
      topMetrics: [
        { label: 'Revenus mensuels', value: '2.4M€', percentage: 75 },
        { label: 'Coûts opérationnels', value: '1.8M€', percentage: 60 },
        { label: 'Marge bénéficiaire', value: '25%', percentage: 25 },
        { label: 'ROI', value: '12%', percentage: 40 }
      ],
      recentData: [
        ['Janvier', '2.2M€', '1.7M€', '22.7%'],
        ['Février', '2.1M€', '1.6M€', '23.8%'],
        ['Mars', '2.4M€', '1.8M€', '25.0%'],
        ['Avril', '2.3M€', '1.7M€', '26.1%']
      ],
      tableHeaders: ['Mois', 'Revenus', 'Coûts', 'Marge']
    },
    {
      id: 'maintenance-report',
      title: 'Rapport Maintenance',
      description: 'État et planning des maintenances',
      type: 'maintenance',
      totalRecords: 891,
      lastUpdate: new Date('2025-08-07T12:45:00'),
      fileSize: '1.9 MB',
      topMetrics: [
        { label: 'Maintenances prévues', value: '24', percentage: 80 },
        { label: 'Maintenances complétées', value: '18', percentage: 75 },
        { label: 'Pièces en stock', value: '89%', percentage: 89 },
        { label: 'Temps d\'arrêt moyen', value: '3.2h', percentage: 45 }
      ],
      recentData: [
        ['Train A1', 'Préventive', '05/08', 'Planifiée'],
        ['Train B2', 'Corrective', '07/08', 'En cours'],
        ['Train C3', 'Préventive', '10/08', 'À venir'],
        ['Train D4', 'Urgente', '08/08', 'Terminée']
      ],
      tableHeaders: ['Train', 'Type', 'Date', 'Statut']
    },
    {
      id: 'hr-dashboard',
      title: 'Tableau de Bord RH',
      description: 'Effectifs, formations et performances',
      type: 'hr',
      totalRecords: 456,
      lastUpdate: new Date('2025-08-07T11:10:00'),
      fileSize: '1.4 MB',
      topMetrics: [
        { label: 'Effectif total', value: '456', percentage: 92 },
        { label: 'Formations complétées', value: '78%', percentage: 78 },
        { label: 'Satisfaction moyenne', value: '8.2/10', percentage: 82 },
        { label: 'Taux de rétention', value: '94%', percentage: 94 }
      ],
      recentData: [
        ['Direction', '12', '2', '83%'],
        ['Conduite', '145', '8', '91%'],
        ['Maintenance', '89', '5', '87%'],
        ['Administration', '34', '1', '95%']
      ],
      tableHeaders: ['Département', 'Effectif', 'Absences', 'Performance']
    }
  ];

  recentReports: GeneratedReport[] = [
    {
      id: '1',
      name: 'Rapport_Operations_Août2025.pdf',
      type: 'Opérations',
      format: 'pdf',
      generatedAt: new Date('2025-08-07T10:30:00'),
      size: '3.2 MB',
      downloadUrl: '/downloads/operations-aout2025.pdf'
    },
    {
      id: '2',
      name: 'Analyse_Financiere_Q3_2025.csv',
      type: 'Financier',
      format: 'csv',
      generatedAt: new Date('2025-08-06T14:15:00'),
      size: '2.8 MB',
      downloadUrl: '/downloads/finance-q3-2025.csv'
    },
    {
      id: '3',
      name: 'Maintenance_Juillet2025.pdf',
      type: 'Maintenance',
      format: 'pdf',
      generatedAt: new Date('2025-08-05T09:20:00'),
      size: '1.9 MB',
      downloadUrl: '/downloads/maintenance-juillet2025.pdf'
    },
    {
      id: '4',
      name: 'RH_Dashboard_Semestre1.csv',
      type: 'Ressources Humaines',
      format: 'csv',
      generatedAt: new Date('2025-08-04T16:45:00'),
      size: '1.4 MB',
      downloadUrl: '/downloads/rh-s1-2025.csv'
    }
  ];

  // Filtered reports
  filteredReports: ReportType[] = [...this.availableReports];

  ngOnInit(): void {
    console.log('Reports module initialisé');
    this.initializeDateFilters();
    this.applyFilters();
  }

  // ============================================
  // INITIALIZATION METHODS
  // ============================================
  private initializeDateFilters(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  // ============================================
  // SUMMARY STATISTICS METHODS
  // ============================================
  getTotalReports(): number {
    return this.recentReports.length;
  }

  getTotalExports(): number {
    return this.recentReports.filter(r => r.format === 'csv').length + 
           this.recentReports.filter(r => r.format === 'pdf').length;
  }

  getAverageTime(): number {
    // Simulation du temps moyen de génération
    return 2.4;
  }

  getTotalDataSize(): string {
    // Simulation de la taille totale des données
    return '12.3 GB';
  }

  getReportsChange(): number {
    // Simulation du changement en pourcentage
    return 18;
  }

  getReportsChangeClass(): string {
    const change = this.getReportsChange();
    return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  }

  // ============================================
  // FILTER METHODS
  // ============================================
  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredReports = this.availableReports.filter(report => {
      const matchesType = !this.selectedType || report.type === this.selectedType;
      const matchesPeriod = this.matchesPeriodFilter(report);
      
      return matchesType && matchesPeriod;
    });
  }

  private matchesPeriodFilter(report: ReportType): boolean {
    if (!this.selectedPeriod || this.selectedPeriod === 'custom') {
      return true;
    }

    const now = new Date();
    const reportDate = report.lastUpdate;
    
    switch (this.selectedPeriod) {
      case 'today':
        return reportDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return reportDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return reportDate >= monthAgo;
      case 'quarter':
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        return reportDate >= quarterAgo;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return reportDate >= yearAgo;
      default:
        return true;
    }
  }

  // ============================================
  // ACTION METHODS
  // ============================================
  generateCustomReport(): void {
    console.log('Génération rapport personnalisé');
    alert('Ouverture de l\'assistant de création de rapport...');
  }

  exportAllData(): void {
    console.log('Export de toutes les données');
    alert('Export complet des données en cours...');
  }

  refreshReport(report: ReportType): void {
    console.log('Actualisation du rapport:', report.title);
    report.lastUpdate = new Date();
    alert(`Actualisation du rapport "${report.title}" terminée`);
  }

  configureReport(report: ReportType): void {
    console.log('Configuration du rapport:', report.title);
    alert(`Ouverture des paramètres pour "${report.title}"`);
  }

  viewReport(report: ReportType): void {
    console.log('Affichage détaillé du rapport:', report.title);
    alert(`Ouverture du rapport détaillé "${report.title}"`);
  }

  exportReport(report: ReportType, format: 'pdf' | 'csv'): void {
    console.log(`Export du rapport ${report.title} en format ${format}`);
    
    // Simulation de la génération
    const newReport: GeneratedReport = {
      id: Date.now().toString(),
      name: `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`,
      type: report.title,
      format: format,
      generatedAt: new Date(),
      size: report.fileSize,
      downloadUrl: `/downloads/${report.id}.${format}`
    };

    this.recentReports.unshift(newReport);
    alert(`Export "${report.title}" en ${format.toUpperCase()} terminé`);
  }

  scheduleReport(report: ReportType): void {
    console.log('Programmation du rapport:', report.title);
    alert(`Ouverture du planificateur pour "${report.title}"`);
  }

  // ============================================
  // LEGACY METHODS (for backwards compatibility)
  // ============================================
  generateReport(reportType: ReportType, format: 'pdf' | 'csv'): void {
    this.exportReport(reportType, format);
  }

  downloadReport(report: GeneratedReport): void {
    console.log('Téléchargement rapport:', report);
    alert(`Téléchargement de ${report.name} commencé`);
  }

  deleteReport(report: GeneratedReport): void {
    if (confirm(`Supprimer le rapport ${report.name} ?`)) {
      this.recentReports = this.recentReports.filter(r => r.id !== report.id);
      console.log('Rapport supprimé:', report);
    }
  }
}
