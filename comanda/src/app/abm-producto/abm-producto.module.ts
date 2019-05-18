import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AbmProductoPage } from './abm-producto.page';

const routes: Routes = [
  {
    path: '',
    component: AbmProductoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AbmProductoPage]
})
export class AbmProductoPageModule {}
