import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FuelRoutingModule } from './fuel-routing-module';
import { Fuel } from './fuel';


@NgModule({
  declarations: [
    Fuel
  ],
  imports: [
    CommonModule,
    FormsModule,
    FuelRoutingModule
  ]
})
export class FuelModule { }
