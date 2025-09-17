export interface Vehicule {
  _id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  categorie: string;
  departement: string;
  kilometrageActuel: number;
  statut: string;
  // ...ajoute d'autres champs si nécessaire...
}
