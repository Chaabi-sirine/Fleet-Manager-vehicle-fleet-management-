import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Missions } from './missions';

const routes: Routes = [{ path: '', component: Missions }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionsRoutingModule { }
