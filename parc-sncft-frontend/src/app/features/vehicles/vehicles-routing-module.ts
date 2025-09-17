import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Vehicles } from './vehicles';

const routes: Routes = [{ path: '', component: Vehicles }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }
