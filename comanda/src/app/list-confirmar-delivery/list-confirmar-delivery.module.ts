import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListConfirmarDeliveryPage } from './list-confirmar-delivery.page';

const routes: Routes = [
  {
    path: '',
    component: ListConfirmarDeliveryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListConfirmarDeliveryPage]
})
export class ListConfirmarDeliveryPageModule {}
