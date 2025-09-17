export interface Entretien {
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  datePrevu?: Date;
  dateRealisation?: Date;
  dureeEstimee?: number;
  dureeReelle?: number;
  cout?: number;
  kilometrage?: number;
  pieces?: string[];
  notes?: string;
  type?: string;
  technicien?: string;
  vehicleId?: string;
  vehicleName?: string;
}
