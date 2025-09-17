import { Component, OnInit } from '@angular/core';
import { MissionsService } from '../../core/services/missions.service';

/** Modèle UI (ce que ton composant affiche) */
interface Mission {
  id: string;
  _id?: string;
  title: string;
  status: 'planifie' | 'en-cours' | 'termine' | 'annule';
  statut?: string; // si tu l’affiches dans l’UI
  startDate: Date;
  date_debut?: string; // (héritage ancien si besoin)
  endDate?: Date;
  date_fin?: string;   // (héritage ancien si besoin)
  origin: string;
  destination: string;
  itineraire?: string;
  vehicle: string;
  vehicule?: { $id?: string; [key: string]: any };
  driver: string;
  utilisateur?: { $id?: string; [key: string]: any };
  validateur?: { $id?: string; [key: string]: any };
  description?: string;
  date_creation?: string;
  date_modification?: string;
  commentaire_validation?: string;
  status_history?: any[];
  _class?: string;
    /** 👇 ajoute ceci */
  raw?: {
    id?: string;
    dateCreation?: string;
    dateModification?: string;
    dateDebut?: string;
    dateFin?: string;
    itineraire?: string;
    description?: string;
    statut?: string;
    commentaireValidation?: string;
    vehicule?: { nom?: string; [k: string]: any };
    utilisateur?: { nom?: string; [k: string]: any };
    validateur?: { nom?: string; [k: string]: any };
    statusHistory?: any[];
    _class?: string;
    [k: string]: any;
  };

}

/** Modèle de formulaire (ce que tu envoies) */
interface NewMission {
  dateDebut: string;
  dateFin: string;
  itineraire: string;
  description: string;
  statut: string; // 'EN_ATTENTE' | 'EN_COURS' | ...
  vehiculeId: string;
  utilisateurId: string; // Conducteur
  validateurId: string;  // Responsable qui valide
  commentaireValidation: string;
}

interface StatusHistory {
  status: string;
  commentaire: string;
  date: Date;
}

@Component({
  selector: 'app-missions',
  standalone: false,
  templateUrl: './missions.html',
  styleUrls: ['./missions.scss'] // <-- corrige: styleUrls (pluriel)
})
export class Missions implements OnInit {
  // Modales édition/détails
  showEditModal: boolean = false;
  missionToEdit: Mission | null = null;
  showDetailsModal: boolean = false;
  selectedMission: Mission | null = null;

  constructor(private missionsService: MissionsService) {}

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedMission = null;
  }

  editMission(mission: Mission): void {
    this.missionToEdit = { ...mission };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.missionToEdit = null;
  }

  // Données UI
  missions: Mission[] = [
    {
      id: '001',
      title: 'Transport Tunis - Sfax',
      status: 'en-cours',
      startDate: new Date('2025-08-07T08:00:00'),
      origin: 'Tunis',
      destination: 'Sfax',
      vehicle: 'Bus Mercedes TUN-1234',
      driver: 'Ahmed Ben Ali',
      description: 'Transport passagers ligne régulière'
    },
    {
      id: '002',
      title: 'Livraison Matériel Technique',
      status: 'planifie',
      startDate: new Date('2025-08-08T10:00:00'),
      origin: 'Tunis',
      destination: 'Sousse',
      vehicle: 'Camion Volvo TUN-5678',
      driver: 'Mohamed Trabelsi'
    },
    {
      id: '003',
      title: 'Maintenance Locomotive',
      status: 'termine',
      startDate: new Date('2025-08-06T06:00:00'),
      endDate: new Date('2025-08-06T18:00:00'),
      origin: 'Dépôt Tunis',
      destination: 'Atelier Central',
      vehicle: 'Locomotive SNCFT-2045',
      driver: 'Karim Bouazizi'
    },
    {
      id: '004',
      title: 'Formation Nouveaux Conducteurs',
      status: 'planifie',
      startDate: new Date('2025-08-10T09:00:00'),
      origin: 'Centre Formation',
      destination: 'Circuit Test',
      vehicle: 'Bus Formation TUN-9999',
      driver: 'Instructeur Salah'
    }
  ];

  filteredMissions: Mission[] = [];
  selectedStatus: 'all' | 'planifie' | 'en-cours' | 'termine' = 'all';

  // Formulaire
  showAddModal = false;
  newMission: NewMission = {
    dateDebut: '',
    dateFin: '',
    itineraire: '',
    description: '',
    statut: 'EN_ATTENTE',
    vehiculeId: '',
    utilisateurId: '',
    validateurId: '',
    commentaireValidation: ''
  };

  // Options select (mock)
  statuts = ['EN_ATTENTE', 'EN_COURS', 'TERMINEE', 'VALIDEE', 'ANNULEE'];
  vehiculesDisponibles = [
    { id: '1', nom: 'Bus Mercedes TUN-1234' },
    { id: '2', nom: 'Camion Volvo TUN-5678' },
    { id: '3', nom: 'Locomotive SNCFT-2045' },
    { id: '4', nom: 'Voiture Peugeot TUN-9012' },
    { id: '5', nom: 'Bus Iveco TUN-3456' }
  ];
  conducteurs = [
    { id: '1', nom: 'Ahmed Ben Ali' },
    { id: '2', nom: 'Mohamed Trabelsi' },
    { id: '3', nom: 'Karim Bouazizi' },
    { id: '4', nom: 'Instructeur Salah' },
    { id: '5', nom: 'Youssef Mansouri' }
  ];
  validateurs = [
    { id: '1', nom: 'Chef Transport - Farid Hamdi' },
    { id: '2', nom: 'Responsable Logistique - Sonia Ben Youssef' },
    { id: '3', nom: 'Directeur Opérations - Nabil Cherif' }
  ];

  ngOnInit(): void {
    // Utilise la forme fonctionnelle pour éviter l’overload TS2769
    this.missionsService.getMissions().subscribe(
      (data: any[]) => {
        // data = tableau de DTO backend (camelCase)
        this.missions = (data || []).map((dto) => this.dtoToUI(dto));
        this.filteredMissions = [...this.missions];
        console.log('Missions récupérées depuis le backend:', data);
      },
      (err) => {
        console.error('Erreur lors de la récupération des missions:', err);
        this.filteredMissions = [];
      }
    );
    console.log('Composant Missions chargé, tentative de récupération des missions.');
  }

  /** ---- Mapping DTO backend (camelCase) → modèle UI ----
   *  Attend un objet { id, dateDebut, dateFin, itineraire, description, statut, vehicule, utilisateur, ... }
   */
  private dtoToUI(dto: any): Mission {
    const title = dto?.itineraire
      ? `Mission ${dto.itineraire}`
      : (dto?.description ? this.truncate(dto.description, 50) : 'Mission SNCFT');

    return {
      id: dto?.id || dto?._id || '',
      _id: dto?._id,
      title,
      status: this.mapStatutToStatus(dto?.statut) as Mission['status'],
      startDate: dto?.dateDebut ? new Date(dto.dateDebut) : new Date(),
      endDate: dto?.dateFin ? new Date(dto.dateFin) : undefined,
      origin: this.extractOrigin(dto?.itineraire) || 'Trajet non spécifié',
      destination: this.extractDestination(dto?.itineraire) || 'Destination non spécifiée',
      vehicle: dto?.vehicule?.nom || 'Véhicule non spécifié',
      driver: dto?.utilisateur?.nom || 'Conducteur non spécifié',
      description: dto?.description || 'Aucune description',
      // champs "legacy" si tu les utilises encore dans le template:
      date_debut: dto?.dateDebut,
      date_fin: dto?.dateFin,
      itineraire: dto?.itineraire,
      statut: dto?.statut,
      commentaire_validation: dto?.commentaireValidation
    };
  }

  filterByStatus(status: 'all' | 'planifie' | 'en-cours' | 'termine'): void {
    this.selectedStatus = status;
    if (status === 'all') {
      this.filteredMissions = [...this.missions];
    } else {
      this.filteredMissions = this.missions.filter(mission => mission.status === status);
    }
  }

  getStatusCount(status: string): number {
    return this.missions.filter(mission => mission.status === status).length;
  }

  getStatusLabel(status: string): string {
    const labels = {
      'planifie': 'Planifiée',
      'en-cours': 'En Cours',
      'termine': 'Terminée',
      'annule': 'Annulée'
    };
    return (labels as any)[status] || status;
  }

  createMission(): void {
    this.showAddModal = true;
    this.resetForm();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newMission = {
      dateDebut: '',
      dateFin: '',
      itineraire: '',
      description: '',
      statut: 'EN_ATTENTE',
      vehiculeId: '',
      utilisateurId: '',
      validateurId: '',
      commentaireValidation: ''
    };
  }

  submitForm(): void {
    if (!this.validateForm()) return;

    // ✅ corrige: on envoie en camelCase attendu par Spring (Mission.java)
    const missionToSend = {
      dateDebut: new Date(this.newMission.dateDebut).toISOString(),
      dateFin: new Date(this.newMission.dateFin).toISOString(),
      itineraire: this.newMission.itineraire,
      description: this.newMission.description,
      statut: this.newMission.statut as 'EN_ATTENTE' | 'EN_COURS' | 'TERMINEE' | 'VALIDEE' | 'ANNULEE',
      vehicule: { id: this.newMission.vehiculeId },
      utilisateur: { id: this.newMission.utilisateurId },
      validateur: this.newMission.validateurId ? { id: this.newMission.validateurId } : null,
      commentaireValidation: this.newMission.commentaireValidation
    };

    this.missionsService.createMission(missionToSend as any).subscribe(
      (createdMission: any) => {
        // createdMission est un DTO backend camelCase
        const missionUI = this.dtoToUI(createdMission);

        // fallback pour le nom UI si backend ne renvoie pas vehicule/utilisateur nom
        const vehicule = this.vehiculesDisponibles.find(v => v.id === this.newMission.vehiculeId);
        const conducteur = this.conducteurs.find(c => c.id === this.newMission.utilisateurId);
        missionUI.vehicle = missionUI.vehicle !== 'Véhicule non spécifié' ? missionUI.vehicle : (vehicule?.nom || missionUI.vehicle);
        missionUI.driver  = missionUI.driver  !== 'Conducteur non spécifié' ? missionUI.driver  : (conducteur?.nom || missionUI.driver);

        this.missions.unshift(missionUI);
        this.filterByStatus(this.selectedStatus);
        this.closeAddModal();
        console.log('Mission créée sur le backend:', createdMission);
        alert('Mission créée avec succès !');
      },
      (err) => {
        console.error('Erreur lors de la création de la mission:', err);
        alert('Erreur lors de la création de la mission.');
      }
    );
  }

  validateForm(): boolean {
    if (!this.newMission.dateDebut) {
      alert('La date de début est obligatoire');
      return false;
    }
    if (!this.newMission.dateFin) {
      alert('La date de fin est obligatoire');
      return false;
    }
    if (!this.newMission.itineraire.trim()) {
      alert("L'itinéraire est obligatoire");
      return false;
    }
    if (!this.newMission.vehiculeId) {
      alert('Le véhicule est obligatoire');
      return false;
    }
    if (!this.newMission.utilisateurId) {
      alert('Le conducteur est obligatoire');
      return false;
    }
    const dateDebut = new Date(this.newMission.dateDebut);
    const dateFin = new Date(this.newMission.dateFin);
    if (dateFin <= dateDebut) {
      alert('La date de fin doit être postérieure à la date de début');
      return false;
    }
    return true;
  }

  generateMissionTitle(): string {
    if (this.newMission.itineraire.includes(' - ')) {
      return `Mission ${this.newMission.itineraire}`;
    } else if (this.newMission.description) {
      return this.truncate(this.newMission.description, 50);
    }
    return 'Mission SNCFT';
  }

  extractOrigin(itineraire: string): string {
    if (itineraire && itineraire.includes(' - ')) {
      return itineraire.split(' - ')[0].trim();
    }
    return 'Point de départ';
  }

  extractDestination(itineraire: string): string {
    if (itineraire && itineraire.includes(' - ')) {
      const parts = itineraire.split(' - ');
      return parts[parts.length - 1].trim();
    }
    return 'Destination';
  }

  mapStatutToStatus(statut: string): string {
    const mapping: { [key: string]: string } = {
      'EN_ATTENTE': 'planifie',
      'EN_COURS': 'en-cours',
      'TERMINEE': 'termine',
      'VALIDEE': 'termine',
      'ANNULEE': 'annule'
    };
    return mapping[statut] || 'planifie';
  }

  viewMission(mission: Mission): void {
    this.selectedMission = mission;
    this.showDetailsModal = true;
  }

  startMission(mission: Mission): void {
    if (confirm(`Démarrer la mission "${mission.title}" ?`)) {
      mission.status = 'en-cours';
      console.log('Mission démarrée:', mission);
    }
  }

  completeMission(mission: Mission): void {
    if (confirm(`Terminer la mission "${mission.title}" ?`)) {
      mission.status = 'termine';
      mission.endDate = new Date();
      console.log('Mission terminée:', mission);
    }
  }

  // --- util ---
  private truncate(s: string, n: number): string {
    return s.length > n ? s.slice(0, n) + '…' : s;
  }
}
