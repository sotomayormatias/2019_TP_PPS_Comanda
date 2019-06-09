import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EncuestaEmpleadoPage } from './encuesta-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestaEmpleadoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EncuestaEmpleadoPage]
})
export class EncuestaEmpleadoPageModule {}
