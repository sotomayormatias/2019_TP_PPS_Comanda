import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListPedidosBartenderPage } from './list-pedidos-bartender.page';

const routes: Routes = [
  {
    path: '',
    component: ListPedidosBartenderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListPedidosBartenderPage]
})
export class ListPedidosBartenderPageModule {}
