import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListPedidosCocinaPage } from './list-pedidos-cocina.page';

const routes: Routes = [
  {
    path: '',
    component: ListPedidosCocinaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListPedidosCocinaPage]
})
export class ListPedidosCocinaPageModule {}
