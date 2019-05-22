import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AbmDuesupPage } from './abm-duesup.page';

const routes: Routes = [
  {
    path: '',
    component: AbmDuesupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AbmDuesupPage]
})
export class AbmDuesupPageModule {}
