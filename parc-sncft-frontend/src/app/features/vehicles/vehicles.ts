import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VehiclesService } from '../../core/services/vehicles.service';

export type StatutVehicule = 'DISPONIBLE' | 'EN_MISSION' | 'EN_MAINTENANCE' | 'HORS_SERVICE';
export type CategorieVehicule = 'MISSION' | 'SERVICE' | 'POOL';
export type TypeDoc = 'ASSURANCE' | 'CARTE_GRISE' | 'CONTROLE_TECHNIQUE';

export interface HistoriqueKm {
  date: string;            // ISO
  kilometrage: number;
  commentaire?: string;
}

export interface DocVehicule {
  type: TypeDoc;
  numero: string;
  dateExpiration: string;  // ISO
  fichier?: string;        // URL
  estValide: boolean;
}

export interface Vehicule {
  _id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  categorie: string;
  responsable: string;
  departement: string;
  kilometrageActuel: number;
  historiqueKilometrage: HistoriqueKm[];
  statut: string;
  dateDerniereMaintenance: string;
  prochaineRevision: string;
  documents: DocVehicule[];
  _class?: string;
}

@Component({
  selector: 'app-vehicles',
  standalone: false,
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss'
})
export class Vehicles implements OnInit {
  vehicles: Vehicule[] = [
    {
  _id: 'mock-1',
      immatriculation: 'TUN-1234',
      marque: 'Mercedes',
      modele: 'Citaro',
      annee: 2020,
      categorie: 'SERVICE',
      responsable: '1',
      departement: 'Transport',
  kilometrageActuel: 85000,
  historiqueKilometrage: [],
  statut: 'DISPONIBLE',
  dateDerniereMaintenance: '2023-01-15',
  prochaineRevision: '2023-07-15',
      documents: []
    },
    {
  _id: 'mock-2',
      immatriculation: 'TUN-5678',
      marque: 'Volvo',
      modele: 'FH',
      annee: 2019,
      categorie: 'MISSION',
      responsable: '2',
      departement: 'Logistique',
  kilometrageActuel: 120000,
  historiqueKilometrage: [],
  statut: 'EN_MAINTENANCE',
  dateDerniereMaintenance: '2023-02-20',
  prochaineRevision: '2023-08-20',
      documents: []
    },
    {
  _id: 'mock-3',
      immatriculation: 'SNCFT-2045',
      marque: 'AGC',
      modele: 'Locomotive',
      annee: 2021,
      categorie: 'SERVICE',
      responsable: '3',
      departement: 'Maintenance',
  kilometrageActuel: 45000,
  historiqueKilometrage: [],
  statut: 'DISPONIBLE',
  dateDerniereMaintenance: '2023-03-10',
  prochaineRevision: '2023-09-10',
      documents: []
    },
    {
  _id: 'mock-4',
      immatriculation: 'TUN-9012',
      marque: 'Peugeot',
      modele: '308',
      annee: 2018,
      categorie: 'POOL',
      responsable: '4',
      departement: 'Commercial',
  kilometrageActuel: 75000,
  historiqueKilometrage: [],
  statut: 'DISPONIBLE',
  dateDerniereMaintenance: '2023-04-05',
  prochaineRevision: '2023-10-05',
      documents: []
    },
    {
  _id: 'mock-5',
      immatriculation: 'TUN-3456',
      marque: 'Iveco',
      modele: 'Crossway',
      annee: 2022,
      categorie: 'MISSION',
      responsable: '5',
      departement: 'Transport',
  kilometrageActuel: 25000,
  historiqueKilometrage: [],
  statut: 'EN_MAINTENANCE',
  dateDerniereMaintenance: '2023-05-12',
  prochaineRevision: '2023-11-12',
      documents: []
    }
  ];

  filteredVehicles: Vehicule[] = [];
  searchTerm = '';
  selectedStatus: 'all' | StatutVehicule = 'all';

  ngOnInit(): void {
    this.filteredVehicles = [...this.vehicles];
  }

  filterVehicles(): void {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const matchesSearch =
        vehicle.immatriculation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.marque.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.modele.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || vehicle.statut === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  filterByStatus(status: 'all' | StatutVehicule) {
    this.selectedStatus = status;
    this.filterVehicles();
  }

  isActive(status: 'all' | StatutVehicule): boolean {
    return this.selectedStatus === status;
  }

  getActiveCount(): number {
    return this.vehicles.filter(v => v.statut === 'DISPONIBLE').length;
  }

  getMaintenanceCount(): number {
    return this.vehicles.filter(v => v.statut === 'EN_MAINTENANCE').length;
  }

  getDisponibleCount(): number {
    return this.vehicles.filter(v => v.statut === 'DISPONIBLE').length;
  }

  getVehicleIcon(type: string): string {
    const icons = {
      'bus': '🚌',
      'camion': '🚛',
      'locomotive': '🚂',
      'voiture': '🚗'
    };
    return icons[type as keyof typeof icons] || '🚗';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'active': 'Actif',
      'maintenance': 'Maintenance',
      'retired': 'Hors service'
    };
    return labels[status as keyof typeof labels] || status;
  }

  // Propriétés pour le formulaire
  showAddModal = false;
  currentYear = new Date().getFullYear();
  newVehicle: Partial<Vehicule> = {
    immatriculation: '',
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    categorie: 'SERVICE', // valeur valide de CategorieVehicule
    responsable: '',
    departement: '',
  kilometrageActuel: 0,
  historiqueKilometrage: [],
  statut: 'DISPONIBLE', // valeur valide de StatutVehicule
  dateDerniereMaintenance: '',
  prochaineRevision: '',
    documents: []
  };

  // Options pour les select
  marques = ['Peugeot', 'Renault', 'Citroen', 'Toyota', 'Mercedes', 'BMW', 'Volkswagen', 'Ford', 'Autre'];
  // Seules les catégories backend
  categories: CategorieVehicule[] = ['MISSION', 'SERVICE', 'POOL'];
  typesCarburant = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL', 'GNV'];
  statuts = ['Actif', 'Maintenance', 'Hors service', 'En attente'];
  departements = ['Direction', 'Logistique', 'Maintenance', 'Commercial', 'Administration', 'Sécurité'];
  couleurs = ['Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Orange', 'Marron', 'Autre'];

  openAddModal(): void {
    this.showAddModal = true;
    this.resetForm();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newVehicle = {
      immatriculation: '',
      marque: '',
      modele: '',
      annee: new Date().getFullYear(),
      categorie: 'SERVICE', // valeur valide de CategorieVehicule
      responsable: '',
      departement: '',
  kilometrageActuel: 0,
  historiqueKilometrage: [],
  statut: 'DISPONIBLE', // valeur valide de StatutVehicule
  dateDerniereMaintenance: '',
  prochaineRevision: '',
      documents: []
    };
  }

  constructor(private vehiclesService: VehiclesService, private http: HttpClient) {}

  async submitForm(): Promise<void> {
    if (!this.validateForm()) return;

    // Mapping enums UI -> backend
    const statutBackend = (this.newVehicle.statut || '').toUpperCase().replace(' ', '_');
    const categorieBackend = (this.newVehicle.categorie || '').toUpperCase().replace(' ', '_');

    // Conversion date FR -> ISO
    function toISO(date: string): string {
      if (!date) return '';
      // Si déjà ISO, retourne tel quel
      if (date.includes('T')) return date;
      const [day, month, year] = date.split(/[\/\-]/);
      if (year && month && day) return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}T00:00:00Z`;
      return date;
    }

    // Nettoyage du kilométrage
    function cleanNumber(val: any): number {
      if (typeof val === 'string') return Number(val.replace(/\s/g, '').replace(',', '.'));
      return Number(val) || 0;
    }

    const payload = {
      immatriculation: this.newVehicle.immatriculation?.trim() ?? '',
      marque: this.newVehicle.marque?.trim() ?? '',
      modele: this.newVehicle.modele?.trim() ?? '',
      annee: this.newVehicle.annee ?? this.currentYear,
      categorie: categorieBackend,
      responsable: this.newVehicle.responsable?.trim() ?? '',
      departement: this.newVehicle.departement?.trim() ?? '',
      kilometrage_actuel: cleanNumber(this.newVehicle.kilometrageActuel),
      historique_kilometrage: this.newVehicle.historiqueKilometrage ?? [],
      statut: statutBackend,
      date_derniere_maintenance: toISO(this.newVehicle.dateDerniereMaintenance ?? ''),
      prochaine_revision: toISO(this.newVehicle.prochaineRevision ?? ''),
      documents: this.newVehicle.documents ?? [],
    };

    try {
    console.log('Payload envoyé au backend:', payload);
      // POST direct avec HttpClient pour snake_case
  const result = await this.http.post<Vehicule>('/api/v1/vehicules', payload).toPromise();
      // Fallback REST : si body vide, GET sur Location ou X-Resource-Id
  if (result) {
        // Mapping camelCase -> modèle local
        const vehicleToAdd: Vehicule = {
          _id: result._id || '',
          immatriculation: result.immatriculation,
          marque: result.marque,
          modele: result.modele,
          annee: result.annee,
          categorie: result.categorie,
          responsable: result.responsable,
          departement: result.departement,
          kilometrageActuel: result.kilometrageActuel,
          historiqueKilometrage: result.historiqueKilometrage || [],
          statut: result.statut,
          dateDerniereMaintenance: result.dateDerniereMaintenance,
          prochaineRevision: result.prochaineRevision,
          documents: result.documents || [],
          _class: result._class
        };
        this.vehicles.unshift(vehicleToAdd);
        this.filterVehicles();
        this.closeAddModal();
        alert('Véhicule créé avec succès');
      } else {
        // Fallback : essayer de récupérer l'objet via Location ou X-Resource-Id
        const xhr = (result as any)?.xhr || {};
        const location = xhr.getResponseHeader?.('Location') || xhr.headers?.['Location'];
        const resourceId = xhr.getResponseHeader?.('X-Resource-Id') || xhr.headers?.['X-Resource-Id'];
        let id = '';
        if (location) {
          const match = location.match(/\/vehicules\/(\w+)/);
          if (match) id = match[1];
        } else if (resourceId) {
          id = resourceId;
        }
        if (id) {
          // GET sur l'id récupéré
          const vehiculeResult = await this.vehiclesService.getVehicleById(id).toPromise();
          if (vehiculeResult && vehiculeResult.data) {
            const vehicleToAdd: Vehicule = {
              _id: (vehiculeResult.data as any)._id || vehiculeResult.data.id || '',
              // ... pas de id, utiliser _id
              immatriculation: vehiculeResult.data.registrationNumber,
              marque: vehiculeResult.data.brand,
              modele: vehiculeResult.data.model,
              annee: vehiculeResult.data.year,
              categorie: (vehiculeResult.data.type as CategorieVehicule).toUpperCase() as CategorieVehicule,
              responsable: this.newVehicle.responsable ?? '',
              departement: vehiculeResult.data.department,
              kilometrageActuel: vehiculeResult.data.mileage,
              historiqueKilometrage: [],
              statut: 'DISPONIBLE',
              dateDerniereMaintenance: '',
              prochaineRevision: '',
              documents: []
            };
            this.vehicles.unshift(vehicleToAdd);
            this.filterVehicles();
            this.closeAddModal();
            alert('Véhicule créé avec succès');
            return;
          }
        }
        // Si aucun id récupérable, rafraîchir la liste complète
        await this.refreshVehiclesList();
        this.closeAddModal();
        alert('Véhicule créé (liste rafraîchie)');
      }
    } catch (err: any) {
    console.error('Erreur backend:', err);
    alert('Erreur inconnue: ' + (err?.message || err?.error || JSON.stringify(err)));
      if (err.status === 409) {
        alert('Immatriculation déjà utilisée');
      } else if (err.status === 400 || err.status === 422) {
        alert(err.error?.message || 'Champs invalides');
      } else if (err.status === 401) {
        alert('Session expirée, veuillez vous reconnecter');
        // Rediriger vers login si besoin
      } else {
        alert('Erreur inconnue');
      }
    }
  }

  async refreshVehiclesList() {
    try {
      const result = await this.vehiclesService.getAllVehicles().toPromise();
      if (result && result.data) {
        this.vehicles = result.data.map((v: any) => ({
              _id: v._id || v.id || '',
              immatriculation: v.registrationNumber,
              marque: v.brand,
              modele: v.model,
              annee: v.year,
              categorie: v.type,
              responsable: '',
              departement: v.department,
              kilometrageActuel: v.mileage,
              historiqueKilometrage: [],
              statut: 'DISPONIBLE',
              dateDerniereMaintenance: '',
              prochaineRevision: '',
              documents: []
        }));
        this.filterVehicles();
      }
    } catch {
      alert('Erreur lors du rafraîchissement de la liste');
    }
  }

  validateForm(): boolean {
    if (!this.newVehicle.immatriculation?.trim()) {
      alert('L\'immatriculation est obligatoire');
      return false;
    }
    if (!this.newVehicle.marque?.trim()) {
      alert('La marque est obligatoire');
      return false;
    }
    if (!this.newVehicle.modele?.trim()) {
      alert('Le modèle est obligatoire');
      return false;
    }
    if (!this.newVehicle.annee || this.newVehicle.annee <= 0) {
      alert('L\'année doit être > 0');
      return false;
    }
  if (this.newVehicle.kilometrageActuel == null || this.newVehicle.kilometrageActuel < 0) {
      alert('Le kilométrage doit être ≥ 0');
      return false;
    }
  if (!this.categories.includes(this.newVehicle.categorie as CategorieVehicule)) {
      alert('Catégorie invalide');
      return false;
    }
    return true;
  }

  mapCategorieToType(categorie: string): string {
    const mapping: { [key: string]: string } = {
      'Voiture': 'voiture',
      'Camion': 'camion',
      'Bus': 'bus',
      'Moto': 'voiture',
      'Utilitaire': 'camion'
    };
    return mapping[categorie] || 'voiture';
  }

  mapStatutToStatus(statut: string): string {
    const mapping: { [key: string]: string } = {
      'Actif': 'active',
      'Maintenance': 'maintenance',
      'Hors service': 'retired',
      'En attente': 'maintenance'
    };
    return mapping[statut] || 'active';
  }

  calculateNextService(): string {
    const nextServiceDate = new Date();
    nextServiceDate.setMonth(nextServiceDate.getMonth() + 6);
    return nextServiceDate.toISOString().split('T')[0];
  }

  editVehicle(vehicle: Vehicule): void {
    console.log('Modifier véhicule:', vehicle);
    // TODO: Implémenter modal de modification
  }

  viewDetails(vehicle: Vehicule): void {
    console.log('Voir détails véhicule:', vehicle);
    // TODO: Implémenter page de détails
  }

  deleteVehicle(vehicle: Vehicule): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.marque} ${vehicle.modele} ?`)) {
  this.vehicles = this.vehicles.filter(v => v._id !== vehicle._id);
      this.filterVehicles();
      console.log('Véhicule supprimé:', vehicle);
    }
  }
}
