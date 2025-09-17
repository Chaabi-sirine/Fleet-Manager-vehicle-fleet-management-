import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../../services/vehicles.service';
import { Vehicule } from '../../../models/vehicule.model';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss'],
  imports: [CommonModule]
})
export class VehiclesListComponent implements OnInit {
  vehicles: Vehicule[] = [];
  loading = false;
  error: string | null = null;

  constructor(private vehiclesService: VehiclesService) {}

  // ...existing code...

  // ...existing code...
  ngOnInit(): void {
    this.loading = true;
    this.vehiclesService.getAllVehicules().subscribe({
      next: (data: any) => {
        // If your API returns { data: [...] }, use data.data, else use data directly
        const vehiclesArray = Array.isArray(data) ? data : (data?.data || []);
        this.vehicles = vehiclesArray.map((v: any) => ({
          _id: v._id,
          immatriculation: v.immatriculation ?? v.registrationNumber,
          marque: v.marque ?? v.brand,
          modele: v.modele ?? v.model,
          annee: v.annee ?? v.year,
          categorie: v.categorie ?? v.type,
          departement: v.departement ?? v.department,
          kilometrageActuel: v.kilometrageActuel ?? v.mileage,
          statut: v.statut ?? v.status
        }));
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des véhicules';
        this.loading = false;
      }
    });
  }
}
