import { Component, OnInit } from '@angular/core';
import { EntretiensService } from '../../core/services/entretiens.service';
import { Entretien } from '../../core/models/entretien.model';

interface NewEntretien {
  id: string;
  date: string;
  typeEntretien: string;
  description: string;
  vehicule: { id: string };
}

interface Alerte {
  id: string;
  type: 'maintenance_due' | 'piece_manquante' | 'retard' | 'urgence';
  title: string;
  message: string;
  vehicleId: string;
  vehicleName: string;
  priority: 'info' | 'warning' | 'error' | 'critical';
  createdAt: Date;
  isRead: boolean;
}

@Component({
  selector: 'app-entretiens',
  standalone: false,
  templateUrl: './entretiens.html',
  styleUrl: './entretiens.scss'
})
export class Entretiens implements OnInit {
  constructor(private entretiensService: EntretiensService) {}
  // Filters
  selectedStatus: string = '';
  selectedType: string = '';
  selectedPriority: string = '';
  selectedTechnician: string = '';
  dateRange: string = 'month';

  // Data
  entretiens: Entretien[] = [];

  alertes: Alerte[] = [
    {
      id: '1',
      type: 'maintenance_due',
      title: 'Maintenance programmée',
      message: 'Train Express T1 - Révision dans 2 jours',
      vehicleId: 'V001',
      vehicleName: 'Train Express T1',
      priority: 'warning',
      createdAt: new Date('2025-08-08T10:00:00'),
      isRead: false
    },
    {
      id: '2',
      type: 'urgence',
      title: 'Intervention urgente requise',
      message: 'Train Marchandises M1 - Problème système de couplage',
      vehicleId: 'V005',
      vehicleName: 'Train Marchandises M1',
      priority: 'critical',
      createdAt: new Date('2025-08-08T08:30:00'),
      isRead: false
    },
    {
      id: '3',
      type: 'piece_manquante',
      title: 'Pièce en rupture de stock',
      message: 'Cylindre moteur indisponible - commande urgente nécessaire',
      vehicleId: 'V002',
      vehicleName: 'Train Régional R5',
      priority: 'error',
      createdAt: new Date('2025-08-08T07:15:00'),
      isRead: true
    },
    {
      id: '4',
      type: 'retard',
      title: 'Retard de maintenance',
      message: 'Train Urbain U2 - Maintenance reportée de 3 jours',
      vehicleId: 'V004',
      vehicleName: 'Train Urbain U2',
      priority: 'info',
      createdAt: new Date('2025-08-07T16:20:00'),
      isRead: true
    }
  ];

  // Filtered data
  filteredEntretiens: Entretien[] = [...this.entretiens];
  filteredAlertes: Alerte[] = [...this.alertes];

  // View state
  activeView: 'planning' | 'suivi' | 'historique' | 'alertes' = 'planning';

  // Propriétés pour le formulaire d'entretien
  showAddModal = false;
  newEntretien: NewEntretien = {
    id: '',
    date: '',
    typeEntretien: 'preventif',
    description: '',
  vehicule: { id: '' }
  };

  // Options pour les select
  typesEntretien = [
    'preventif',
    'correctif', 
    'urgence',
    'revision',
    'diagnostic',
    'nettoyage',
    'reparation',
    'controle'
  ];

  // Liste des véhicules pour le select
  vehiculesDisponibles = [
    { id: 'V001', name: 'Train Express T1' },
    { id: 'V002', name: 'Train Régional R5' },
    { id: 'V003', name: 'Train Rapide TR3' },
    { id: 'V004', name: 'Train Urbain U2' },
    { id: 'V005', name: 'Train Marchandises M1' },
    { id: 'V006', name: 'Locomotive L1' },
    { id: 'V007', name: 'Rame Suburbaine S2' },
    { id: 'V008', name: 'Train Intercités I3' }
  ];

  ngOnInit(): void {
    console.log('Entretiens module initialisé');
    // Charger la liste des entretiens depuis le backend
    this.entretiensService.getAllEntretiens().subscribe({
      next: (data) => {
        this.entretiens = data;
        this.applyFilters();
        console.log('Entretiens chargés:', data);
      },
      error: (err) => {
        alert('Erreur lors du chargement des entretiens');
        console.error('Erreur complète:', err);
      }
    });
  }

  // ============================================
  // VIEW MANAGEMENT
  // ============================================
  setActiveView(view: 'planning' | 'suivi' | 'historique' | 'alertes'): void {
    this.activeView = view;
    this.applyFilters();
  }

  // ============================================
  // FILTER METHODS
  // ============================================
  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredEntretiens = this.entretiens.filter(entretien => {
      const matchesStatus = !this.selectedStatus || entretien.status === this.selectedStatus;
  const matchesType = !this.selectedType || entretien.type === this.selectedType;
      const matchesPriority = !this.selectedPriority || entretien.priority === this.selectedPriority;
  const matchesTechnician = !this.selectedTechnician || entretien.technicien === this.selectedTechnician;
      const matchesView = this.matchesViewFilter(entretien);
      
      return matchesStatus && matchesType && matchesPriority && matchesTechnician && matchesView;
    });

    this.filteredAlertes = this.alertes.filter(alerte => {
      if (this.activeView !== 'alertes') return true;
      return true; // Pour l'instant, on affiche toutes les alertes
    });
  }

  private matchesViewFilter(entretien: Entretien): boolean {
    const today = new Date();
    
    switch (this.activeView) {
      case 'planning':
        return entretien.status === 'planifie' || entretien.status === 'reporte';
      case 'suivi':
        return entretien.status === 'en-cours';
      case 'historique':
        return entretien.status === 'termine' || entretien.status === 'annule';
      case 'alertes':
        return true; // Les entretiens sont toujours visibles dans la vue alertes
      default:
        return true;
    }
  }

  // ============================================
  // STATISTICS METHODS
  // ============================================
  getTotalEntretiens(): number {
    return this.entretiens.length;
  }

  getEntretiensEnCours(): number {
    return this.entretiens.filter(e => e.status === 'en-cours').length;
  }

  getEntretiensPlanifies(): number {
    return this.entretiens.filter(e => e.status === 'planifie').length;
  }

  getAlertesNonLues(): number {
    return this.alertes.filter(a => !a.isRead).length;
  }

  getCoutMoyenEntretien(): number {
  // Exemple : calculer le nombre total d'entretiens
  const total = this.entretiens.length;
    return Math.round(total / this.entretiens.length);
  }

  // ============================================
  // ACTION METHODS
  // ============================================
  planifierEntretien(): void {
    this.openAddModal();
  }

  // ============================================
  // FORM METHODS
  // ============================================
  openAddModal(): void {
    this.showAddModal = true;
    this.resetForm();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newEntretien = {
      id: '',
      date: new Date().toISOString().split('T')[0],
      typeEntretien: 'preventif',
      description: '',
  vehicule: { id: '' }
    };
  }

  submitForm(): void {
    if (this.validateForm()) {
      // Générer un ID temporaire
  // Générer un nouvel _id n'est pas nécessaire, MongoDB le fait côté backend
      
      // Trouver le véhicule sélectionné
  const vehiculeSelectionne = this.vehiculesDisponibles.find(v => v.id === this.newEntretien.vehicule.id);
      
      // Créer le nouvel entretien
  const entretienToAdd: Entretien = {
    id: Date.now(),
    title: `${this.getTypeLabel(this.newEntretien.typeEntretien)} - ${vehiculeSelectionne?.name}`,
    description: this.newEntretien.description,
  type: this.newEntretien.typeEntretien,
    vehicleId: this.newEntretien.vehicule.id,
    vehicleName: vehiculeSelectionne?.name || 'Véhicule inconnu',
    status: 'planifie',
    priority: this.determinePriority(this.newEntretien.typeEntretien),
    datePrevu: new Date(this.newEntretien.date + 'T09:00:00'),
    dateRealisation: undefined,
    dureeEstimee: this.estimateDuration(this.newEntretien.typeEntretien),
    dureeReelle: undefined,
    technicien: 'À assigner',
    pieces: [],
    cout: 0,
    kilometrage: 0,
    notes: '',
    // Ajoutez d'autres propriétés si besoin
  };

      // Prépare le payload pour le backend
      const payload = {
        date: this.newEntretien.date,
        typeEntretien: this.newEntretien.typeEntretien,
        description: this.newEntretien.description,
        vehicule: {
          id: this.newEntretien.vehicule.id
        }
      };
      // Appel HTTP POST vers le backend
  this.entretiensService.createEntretien(payload).subscribe({
        next: (response: any) => {
          this.entretiens.unshift(entretienToAdd);
          this.applyFilters();
          this.closeAddModal();
          alert('Entretien planifié avec succès et enregistré sur le serveur');
        },
        error: (err: any) => {
          alert('Erreur lors de l\'enregistrement sur le serveur');
          console.error(err);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.newEntretien.date) {
      alert('La date est obligatoire');
      return false;
    }
    
    const selectedDate = new Date(this.newEntretien.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('La date ne peut pas être antérieure à aujourd\'hui');
      return false;
    }
    
  if (!this.newEntretien.typeEntretien) {
      alert('Le type d\'entretien est obligatoire');
      return false;
    }
    
    if (!this.newEntretien.description.trim()) {
      alert('La description est obligatoire');
      return false;
    }
    
    if (this.newEntretien.description.trim().length < 10) {
      alert('La description doit contenir au moins 10 caractères');
      return false;
    }
    
  if (!this.newEntretien.vehicule || !this.newEntretien.vehicule.id) {
      alert('Vous devez sélectionner un véhicule');
      return false;
    }
    
    return true;
  }

  determinePriority(type: string): 'basse' | 'moyenne' | 'haute' | 'critique' {
    const priorityMap: { [key: string]: 'basse' | 'moyenne' | 'haute' | 'critique' } = {
      'preventif': 'moyenne',
      'correctif': 'haute',
      'urgence': 'critique',
      'revision': 'moyenne',
      'nettoyage': 'basse',
      'reparation': 'haute',
      'controle': 'moyenne'
    };
    return priorityMap[type] || 'moyenne';
  }

  estimateDuration(type: string): number {
    const durationMap: { [key: string]: number } = {
      'preventif': 4,
      'correctif': 8,
      'urgence': 12,
      'revision': 6,
      'diagnostic': 2,
      'nettoyage': 3,
      'reparation': 10,
      'controle': 2
    };
  return durationMap[type] || 4;
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  commencerEntretien(entretien: Entretien): void {
    if (entretien.status === 'planifie') {
      entretien.status = 'en-cours';
  // Si besoin, utiliser une propriété MongoDB ou ignorer
      console.log('Entretien commencé:', entretien);
      this.applyFilters();
  alert(`Entretien commencé : ${entretien.title || entretien.description}`);
    }
  }

  terminerEntretien(entretien: Entretien): void {
    if (entretien.status === 'en-cours') {
      entretien.status = 'termine';
      // Simulation de la durée réelle
  // Si besoin, utiliser une propriété MongoDB ou ignorer
      console.log('Entretien terminé:', entretien);
      this.applyFilters();
  alert(`Entretien terminé : ${entretien.title || entretien.description}`);
    }
  }

  reporterEntretien(entretien: Entretien): void {
    if (entretien.status === 'planifie') {
      entretien.status = 'reporte';
      console.log('Entretien reporté:', entretien);
      this.applyFilters();
  alert(`Entretien reporté : ${entretien.title || entretien.description}`);
    }
  }

  voirDetails(entretien: Entretien): void {
    console.log('Voir détails entretien:', entretien);
  alert(`Détails de l'entretien : ${entretien.title || entretien.description}`);
  }

  modifierEntretien(entretien: Entretien): void {
    console.log('Modifier entretien:', entretien);
  alert(`Modification de l'entretien : ${entretien.title || entretien.description}`);
  }

  supprimerEntretien(entretien: Entretien): void {
  if (confirm(`Supprimer l'entretien : ${entretien.title || entretien.description} ?`)) {
      this.entretiens = this.entretiens.filter(e => e.id !== entretien.id);
      this.applyFilters();
      console.log('Entretien supprimé:', entretien);
    }
  }

  // ============================================
  // ALERT METHODS
  // ============================================
  marquerAlerteLue(alerte: Alerte): void {
    alerte.isRead = true;
    console.log('Alerte marquée comme lue:', alerte);
  }

  supprimerAlerte(alerte: Alerte): void {
    this.alertes = this.alertes.filter(a => a.id !== alerte.id);
    this.applyFilters();
    console.log('Alerte supprimée:', alerte);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================
  getStatusLabel(status?: string): string {
    const labels: { [key: string]: string } = {
      'planifie': 'Planifié',
      'en-cours': 'En cours',
      'termine': 'Terminé',
      'reporte': 'Reporté',
      'annule': 'Annulé'
    };
    return status ? (labels[status] || status) : '';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'preventif': 'Préventif',
      'correctif': 'Correctif',
      'urgence': 'Urgence',
      'revision': 'Révision'
    };
    return labels[type] || type;
  }

  getPriorityLabel(priority?: string): string {
    const labels: { [key: string]: string } = {
      'basse': 'Basse',
      'moyenne': 'Moyenne',
      'haute': 'Haute',
      'critique': 'Critique'
    };
    return priority ? (labels[priority] || priority) : '';
  }

  formatDuree(heures: number): string {
    const h = Math.floor(heures);
    const m = Math.round((heures - h) * 60);
    return m > 0 ? `${h}h${m}m` : `${h}h`;
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCout(cout: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND'
    }).format(cout);
  }
}
