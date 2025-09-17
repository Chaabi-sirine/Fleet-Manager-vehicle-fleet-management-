import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MissionsRoutingModule } from './missions-routing-module';
import { Missions } from './missions';
import { MissionsListComponent } from './missions-list/missions-list.component';


@NgModule({
  declarations: [
    Missions
  ],
  imports: [
    CommonModule,
    FormsModule,
    MissionsRoutingModule,
    MissionsListComponent
  ]
})
export class MissionsModule { }
