import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entretiens } from './entretiens';

const routes: Routes = [{ path: '', component: Entretiens }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntretiensRoutingModule { }
