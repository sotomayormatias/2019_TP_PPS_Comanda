import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AbmClienteAnonimoPage } from './abm-cliente-anonimo.page';

const routes: Routes = [
  {
    path: '',
    component: AbmClienteAnonimoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AbmClienteAnonimoPage]
})
export class AbmClienteAnonimoPageModule {}
