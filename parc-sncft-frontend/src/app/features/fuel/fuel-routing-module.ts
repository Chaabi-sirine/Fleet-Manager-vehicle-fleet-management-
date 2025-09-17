import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Fuel } from './fuel';

const routes: Routes = [{ path: '', component: Fuel }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuelRoutingModule { }
