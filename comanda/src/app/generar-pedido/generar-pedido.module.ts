import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GenerarPedidoPage } from './generar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: GenerarPedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GenerarPedidoPage]
})
export class GenerarPedidoPageModule {}
