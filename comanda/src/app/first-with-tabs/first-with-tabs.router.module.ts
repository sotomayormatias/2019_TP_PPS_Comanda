import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstWithTabsPage } from './first-with-tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: FirstWithTabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: './home/home.module#HomePageModule'
            // loadChildren: '../login/login.module#LoginPageModule'


          }
        ]
      },
      {
        path: 'tabimage',
        children: [
          {
            path: '',
            loadChildren: '../tabimage/tabimage.module#TabimagePageModule'
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: '../tab3/tab3.module#Tab3PageModule'
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
