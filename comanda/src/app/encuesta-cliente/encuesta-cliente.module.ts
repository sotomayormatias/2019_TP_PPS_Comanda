import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EncuestaClientePage } from './encuesta-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestaClientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EncuestaClientePage]
})
export class EncuestaClientePageModule {}
