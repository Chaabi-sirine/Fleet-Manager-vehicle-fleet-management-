export interface Mission {
  _id?: string;
  date_debut: string;
  date_fin: string;
  itineraire: string;
  description: string;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
  date_creation?: string;
  date_modification?: string;
  commentaire_validation?: string;
  vehicule: any; // DBRef, à adapter si tu as un modèle véhicule
  utilisateur: any; // DBRef, à adapter si tu as un modèle utilisateur
  validateur?: any; // DBRef, à adapter si tu as un modèle utilisateur
  status_history?: any[];
  _class?: string;
}
