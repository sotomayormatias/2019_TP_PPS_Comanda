import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EstSatisfaccionPage } from './est-satisfaccion.page';

const routes: Routes = [
  {
    path: '',
    component: EstSatisfaccionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EstSatisfaccionPage]
})
export class EstSatisfaccionPageModule {}
