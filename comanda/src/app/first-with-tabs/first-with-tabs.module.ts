import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { TabsPageRoutingModule } from './first-with-tabs.router.module';

import { IonicModule } from '@ionic/angular';

import { FirstWithTabsPage } from './first-with-tabs.page';

// const routes: Routes = [
//   // {
//   //   path: '',
//   //   component: FirstWithTabsPage
//   // }

//   {
//     path: 'tabs',
//     component: FirstWithTabsPage,
//     children: [
//       {
//         path: 'tab1',
//         loadChildren: './home/home.module#HomePageModule'
//       },
//       {
//         path: 'tab2',
//         loadChildren: '../tab2/tab2.module#Tab2PageModule'
//       }
//     ]
//   },
//   {
//     path: '',
//     redirectTo: 'tabs/tab1',
//     pathMatch: 'full'
//   }
// ];

@NgModule({
  imports: [
    // CommonModule,
    // FormsModule,
    // IonicModule,
    // RouterModule.forChild(routes)
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [FirstWithTabsPage]
})
export class FirstWithTabsPageModule {}
