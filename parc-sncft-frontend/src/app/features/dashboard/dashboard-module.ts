import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './dashboard';

// Import des composants shared
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    CardComponent,
    ButtonComponent,
    StatCardComponent
  ]
})
export class DashboardModule { }
