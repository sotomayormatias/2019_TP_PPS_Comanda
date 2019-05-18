import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstWithTabsPage } from './first-with-tabs.page';
// import { HomePage } from './../home/home.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: FirstWithTabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: ''
            // loadChildren: './home/home.module#HomePageModule'
            // loadChildren: './home/'
            // loadChildren: '../login/login.module#LoginPageModule'


          }
        ]
      },
    
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
