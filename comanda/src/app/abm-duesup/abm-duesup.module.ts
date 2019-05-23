import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AbmDuesupPage } from './abm-duesup.page';

import { ReactiveFormsModule} from '@angular/forms';


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
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AbmDuesupPage]
})
export class AbmDuesupPageModule {}
