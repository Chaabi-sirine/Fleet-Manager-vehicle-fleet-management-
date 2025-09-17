import { Component, OnInit } from '@angular/core';
import { CarburantService } from '../../core/services/carburant.service';
import { CarteCarburantService, CarteCarburant } from '../../core/services/carte-carburant.service';

interface FuelRecord {
  id: string;
  date: Date;
  vehicle: string;
  quantity: number;
  price: number;
  station: string;
  driver: string;
}

interface NewCarburant {
  typeCarburant: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
  station: string;
  modeUtilisation: string; // BON, CARTE
  numeroPiece: string; // Numéro de bon ou de carte
  vehiculeId: string;
  missionId: string;
  utilisateurId: string;
  kilometrageActuel: number;
  dateRavitaillement: string;
  commentaire: string;
}

interface NewBonCarburant {
  numeroBon: string;
  montant: number;
  dateEmission: string;
  station: string;
  vehiculeId: string;
  utilisateurId: string;
  utilise: boolean;
  dateUtilisation: string;
}

interface ConsommationStats {
  consommationMoyenne: number;
  coutTotal: number;
  nombreRavitaillements: number;
  periodeDebut: string;
  periodeFin: string;
}

@Component({
  selector: 'app-fuel',
  standalone: false,
  templateUrl: './fuel.html',
  styleUrl: './fuel.scss'
})
export class Fuel implements OnInit {
    showRavitaillementForm = false;
    ravitaillement = {
      dateRavitaillement: '',
      quantite: 0,
      vehiculeId: '',
      station: '',
      montant: 0
    };

    // Liste des ravitaillements filtrés
    ravitaillementsVehicule: any[] = [];

    // Méthode pour charger les ravitaillements d'un véhicule sur une période
    loadRavitaillementsVehicule(vehiculeId: string, debut: string, fin: string): void {
      this.carburantService.getRavitaillementsVehicule(vehiculeId, debut, fin)
        .subscribe({
          next: (data) => {
            this.ravitaillementsVehicule = data;
            console.log('Ravitaillements récupérés:', data);
          },
          error: (err) => {
            alert('Erreur lors du chargement des ravitaillements');
            if (err && err.error) {
              console.error('Erreur détaillée:', err.error);
            }
            console.error('Erreur complète:', err);
          }
        });
    }

    submitRavitaillementForm() {
      const data = {
        dateRavitaillement: this.ravitaillement.dateRavitaillement,
        quantite: this.ravitaillement.quantite,
        vehiculeId: this.ravitaillement.vehiculeId,
        station: this.ravitaillement.station,
        montant: this.ravitaillement.montant
      };
      fetch('http://localhost:8080/api/v1/carburant/ravitaillement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(async response => {
        if (response.ok) {
          alert('Ravitaillement enregistré avec succès !');
          this.showRavitaillementForm = false;
          this.ravitaillement = {
            dateRavitaillement: '',
            quantite: 0,
            vehiculeId: '',
            station: '',
            montant: 0
          };
        } else {
          const errorText = await response.text();
          alert(`Erreur lors de l'enregistrement du ravitaillement :\n${errorText}`);
        }
      })
      .catch((err) => {
        alert('Erreur lors de l\'enregistrement du ravitaillement : ' + err);
      });
    }
  showCarteForm = false;
  newCarteCarburant: CarteCarburant = {
    numeroCarte: '',
    dateExpiration: '',
    vehiculeId: '',
    solde: 0,
    code: '',
    active: true,
    plafondMensuel: 0,
    fournisseur: ''
  };

  constructor(private carburantService: CarburantService, private carteCarburantService: CarteCarburantService) {}
  toggleCarteForm(): void {
    this.showCarteForm = !this.showCarteForm;
    if (this.showCarteForm) {
      this.resetCarteForm();
    }
  }

  resetCarteForm(): void {
    this.newCarteCarburant = {
      numeroCarte: '',
      dateExpiration: '',
      vehiculeId: '',
      solde: 0,
      code: '',
      active: true,
      plafondMensuel: 0,
      fournisseur: ''
    };
  }

  submitCarteForm(): void {
    // Envoi à l'API
    this.carteCarburantService.createCarteCarburant(this.newCarteCarburant).subscribe({
      next: (response) => {
        alert('Carte carburant créée avec succès !');
        this.toggleCarteForm();
      },
      error: (err) => {
        alert('Erreur lors de la création de la carte carburant');
        console.error('Erreur API:', err);
      }
    });
  }
  showInlineBonForm = false;

  toggleInlineBonForm(): void {
    this.showInlineBonForm = !this.showInlineBonForm;
    if (this.showInlineBonForm) {
      this.resetBonForm();
    }
  }
  viewBon(bon: NewBonCarburant): void {
    alert('Détails du bon:\n' + JSON.stringify(bon, null, 2));
  }

  editBon(index: number): void {
    // Pré-remplit le formulaire avec le bon à éditer
    const bon = this.bonsCarburant[index];
    this.newBonCarburant = { ...bon };
    this.showAddBonModal = true;
    // Optionnel: supprimer le bon de la liste pour éviter doublon après édition
    this.bonsCarburant.splice(index, 1);
  }

  deleteBon(index: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce bon carburant ?')) {
      this.bonsCarburant.splice(index, 1);
    }
  }
  getVehiculeNom(id: string): string {
    const v = this.vehiculesDisponibles.find(v => v.id === id);
    return v ? v.nom : '-';
  }

  getBeneficiaireNom(id: string): string {
    const c = this.conducteurs.find(c => c.id === id);
    return c ? c.nom : '-';
  }
  bonsCarburant: NewBonCarburant[] = [];
  // ...existing code...
  totalConsumption = 2340;
  activeCards = 12;
  pendingRecords = 3;

  fuelRecords: FuelRecord[] = [
    {
      id: '1',
      date: new Date('2025-08-07'),
      vehicle: 'TUN-1234',
      quantity: 80,
      price: 120.50,
      station: 'Agil Tunis Centre',
      driver: 'Ahmed Ben Ali'
    },
    {
      id: '2',
      date: new Date('2025-08-06'),
      vehicle: 'TUN-5678',
      quantity: 150,
      price: 225.75,
      station: 'Shell Autoroute',
      driver: 'Mohamed Trabelsi'
    },
    {
      id: '3',
      date: new Date('2025-08-06'),
      vehicle: 'TUN-9012',
      quantity: 45,
      price: 67.80,
      station: 'Total Manouba',
      driver: 'Karim Bouazizi'
    }
  ];

  // Propriétés pour les formulaires
  showAddCarburantModal = false;
  showAddBonModal = false;
  
  newCarburant: NewCarburant = {
    typeCarburant: 'Diesel',
    quantite: 0,
    prixUnitaire: 0,
    montantTotal: 0,
    station: '',
    modeUtilisation: 'CARTE',
    numeroPiece: '',
    vehiculeId: '',
    missionId: '',
    utilisateurId: '',
    kilometrageActuel: 0,
    dateRavitaillement: '',
    commentaire: ''
  };

  newBonCarburant: NewBonCarburant = {
    numeroBon: '',
    montant: 0,
    dateEmission: '',
    station: '',
    vehiculeId: '',
    utilisateurId: '',
    utilise: false,
    dateUtilisation: ''
  };

  // Options pour les select
  typesCarburant = ['Diesel', 'Essence', 'Électrique', 'Hybride', 'GPL', 'GNV'];
  modesUtilisation = ['BON', 'CARTE'];
  stations = [
    'Agil Tunis Centre',
    'Shell Autoroute',
    'Total Manouba',
    'Esso Lac',
    'Agil Sfax',
    'Total Sousse',
    'Shell Bizerte'
  ];
  vehiculesDisponibles = [
    { id: '1', nom: 'Bus Mercedes TUN-1234' },
    { id: '2', nom: 'Camion Volvo TUN-5678' },
    { id: '3', nom: 'Locomotive SNCFT-2045' },
    { id: '4', nom: 'Voiture Peugeot TUN-9012' },
    { id: '5', nom: 'Bus Iveco TUN-3456' }
  ];
  missionsDisponibles = [
    { id: '1', nom: 'Transport Tunis - Sfax' },
    { id: '2', nom: 'Livraison Matériel Technique' },
    { id: '3', nom: 'Maintenance Locomotive' },
    { id: '4', nom: 'Formation Nouveaux Conducteurs' }
  ];
  conducteurs = [
    { id: '1', nom: 'Ahmed Ben Ali' },
    { id: '2', nom: 'Mohamed Trabelsi' },
    { id: '3', nom: 'Karim Bouazizi' },
    { id: '4', nom: 'Instructeur Salah' },
    { id: '5', nom: 'Youssef Mansouri' }
  ];

  ngOnInit(): void {
    console.log('Fuel module initialisé');
    // Charger tous les ravitaillements depuis MongoDB
    this.carburantService.getAllCarburant().subscribe({
      next: (data) => {
        this.ravitaillementsVehicule = data;
        console.log('Tous les ravitaillements:', data);
      },
      error: (err) => {
        alert('Erreur lors du chargement des ravitaillements');
        console.error('Erreur complète:', err);
      }
    });
  }

  // Méthodes pour le formulaire de ravitaillement
  addFuelRecord(): void {
    this.showAddCarburantModal = true;
    this.resetCarburantForm();
  }

  closeCarburantModal(): void {
    this.showAddCarburantModal = false;
    this.resetCarburantForm();
  }

  resetCarburantForm(): void {
    this.newCarburant = {
      typeCarburant: 'Diesel',
      quantite: 0,
      prixUnitaire: 0,
      montantTotal: 0,
      station: '',
      modeUtilisation: 'CARTE',
      numeroPiece: '',
      vehiculeId: '',
      missionId: '',
      utilisateurId: '',
      kilometrageActuel: 0,
      dateRavitaillement: '',
      commentaire: ''
    };
  }

  submitCarburantForm(): void {
    if (this.validateCarburantForm()) {
      // Calculer le montant total si pas déjà fait
      if (this.newCarburant.montantTotal === 0) {
        this.newCarburant.montantTotal = this.newCarburant.quantite * this.newCarburant.prixUnitaire;
      }

      // Générer un ID temporaire
      const newId = (Math.max(...this.fuelRecords.map(r => parseInt(r.id))) + 1).toString();
      
      // Trouver les noms des entités
      const vehicule = this.vehiculesDisponibles.find(v => v.id === this.newCarburant.vehiculeId);
      const conducteur = this.conducteurs.find(c => c.id === this.newCarburant.utilisateurId);
      
      // Créer le nouveau record
      const recordToAdd: FuelRecord = {
        id: newId,
        date: new Date(this.newCarburant.dateRavitaillement),
        vehicle: vehicule ? vehicule.nom.split(' ').pop()! : 'N/A', // Récupère la plaque
        quantity: this.newCarburant.quantite,
        price: this.newCarburant.montantTotal,
        station: this.newCarburant.station,
        driver: conducteur ? conducteur.nom : 'Conducteur non spécifié'
      };

      // Ajouter à la liste
      this.fuelRecords.unshift(recordToAdd);
      
      // Fermer le modal
      this.closeCarburantModal();
      
      console.log('Nouveau ravitaillement ajouté:', recordToAdd);
    }
  }

  validateCarburantForm(): boolean {
    if (!this.newCarburant.dateRavitaillement) {
      alert('La date de ravitaillement est obligatoire');
      return false;
    }
    if (!this.newCarburant.vehiculeId) {
      alert('Le véhicule est obligatoire');
      return false;
    }
    if (!this.newCarburant.utilisateurId) {
      alert('Le conducteur est obligatoire');
      return false;
    }
    if (this.newCarburant.quantite <= 0) {
      alert('La quantité doit être supérieure à 0');
      return false;
    }
    if (this.newCarburant.prixUnitaire <= 0) {
      alert('Le prix unitaire doit être supérieur à 0');
      return false;
    }
    if (!this.newCarburant.station.trim()) {
      alert('La station est obligatoire');
      return false;
    }
    if (this.newCarburant.modeUtilisation === 'BON' && !this.newCarburant.numeroPiece.trim()) {
      alert('Le numéro de bon est obligatoire pour ce mode de paiement');
      return false;
    }
    return true;
  }

  // Méthodes pour le formulaire de bon carburant
  addBonCarburant(): void {
    this.showAddBonModal = true;
    this.resetBonForm();
  }

  closeBonModal(): void {
    this.showAddBonModal = false;
    this.resetBonForm();
  }

  resetBonForm(): void {
    this.newBonCarburant = {
      numeroBon: '',
      montant: 0,
      dateEmission: '',
      station: '',
      vehiculeId: '',
      utilisateurId: '',
      utilise: false,
      dateUtilisation: ''
    };
  }

  submitBonForm(): void {
    if (this.validateBonForm()) {
      this.carburantService.createBonCarburant(this.newBonCarburant).subscribe({
        next: (response) => {
          alert('Bon carburant créé avec succès !');
          // Ajoute le bon à la liste locale
          this.bonsCarburant.unshift(response);
          console.log('Réponse API:', response);
          this.closeBonModal();
        },
        error: (err) => {
          alert('Erreur lors de la création du bon carburant');
          console.error('Erreur API:', err);
        }
      });
    }
  }

  validateBonForm(): boolean {
    if (!this.newBonCarburant.numeroBon.trim()) {
      alert('Le numéro de bon est obligatoire');
      return false;
    }
    if (this.newBonCarburant.montant <= 0) {
      alert('Le montant doit être supérieur à 0');
      return false;
    }
    if (!this.newBonCarburant.dateEmission) {
      alert('La date d\'émission est obligatoire');
      return false;
    }
    if (!this.newBonCarburant.station.trim()) {
      alert('La station est obligatoire');
      return false;
    }
    return true;
  }

  // Méthodes utilitaires
  calculateMontantTotal(): void {
    if (this.newCarburant.quantite > 0 && this.newCarburant.prixUnitaire > 0) {
      this.newCarburant.montantTotal = this.newCarburant.quantite * this.newCarburant.prixUnitaire;
    }
  }

  onModeUtilisationChange(): void {
    this.newCarburant.numeroPiece = '';
  }

  viewRecord(record: FuelRecord): void {
    console.log('Voir enregistrement:', record);
  }

  editRecord(record: FuelRecord): void {
    console.log('Modifier enregistrement:', record);
  }
}
