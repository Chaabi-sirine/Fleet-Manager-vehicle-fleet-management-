import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EntretiensRoutingModule } from './entretiens-routing-module';
import { Entretiens } from './entretiens';

@NgModule({
  declarations: [
    Entretiens
  ],
  imports: [
    CommonModule,
    FormsModule,
    EntretiensRoutingModule
  ]
})
export class EntretiensModule { }
