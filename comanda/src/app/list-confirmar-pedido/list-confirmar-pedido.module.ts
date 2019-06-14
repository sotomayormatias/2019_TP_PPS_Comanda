import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListConfirmarPedidoPage } from './list-confirmar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: ListConfirmarPedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListConfirmarPedidoPage]
})
export class ListConfirmarPedidoPageModule {}
