import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmarEntregaPage } from './confirmar-entrega.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmarEntregaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfirmarEntregaPage]
})
export class ConfirmarEntregaPageModule {}
