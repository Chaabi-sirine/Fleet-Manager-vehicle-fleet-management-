export interface HistoriqueKilometrage {
  periode: string; // ex: '2025-08' (mois ISO)
  km: number;
  note?: string;
}

export interface DocumentVehicule {
  nom: string;
  type: string;
  reference: string;
  url?: string;
  dateExpiration?: string; // ISO
}

export type StatutVehicule = 'DISPONIBLE' | 'EN_MISSION' | 'EN_MAINTENANCE';

export interface Vehicule {
  _id?: string;
  immatriculation: string;
  marque: string;
  modele: string;
  statut: StatutVehicule;
  dateAchat?: string; // ISO
  kilometrageActuel?: number;
  historiqueKilometrage?: HistoriqueKilometrage[];
  documents?: DocumentVehicule[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isActive?: boolean;
}
