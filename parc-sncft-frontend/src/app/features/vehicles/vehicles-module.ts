import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VehiclesRoutingModule } from './vehicles-routing-module';
import { Vehicles } from './vehicles';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';


@NgModule({
  declarations: [
    Vehicles
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    FormsModule,
    VehiclesListComponent
  ]
})
export class VehiclesModule { }
