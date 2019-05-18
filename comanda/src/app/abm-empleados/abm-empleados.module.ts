import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AbmEmpleadosPage } from './abm-empleados.page';

const routes: Routes = [
  {
    path: '',
    component: AbmEmpleadosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AbmEmpleadosPage]
})
export class AbmEmpleadosPageModule {}
