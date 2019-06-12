import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EncuestaSupPage } from './encuesta-sup.page';

import { ModalPagePage } from '../modal-page/modal-page.page';
 import { ModalPagePageModule } from '../modal-page/modal-page.module';



const routes: Routes = [
  {
    path: '',
    component: EncuestaSupPage
  },
  {
    path: '',
    component: ModalPagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EncuestaSupPage, ModalPagePage]
})
export class EncuestaSupPageModule {}