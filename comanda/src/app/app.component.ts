import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from './app.firebase.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Alta Dueño/Supervisor',
      url: '/abm-duesup',
      icon: 'key'
    },
    {

      title: 'Alta Mesas',
      url: '/abm-mesa',
      icon: 'help-buoy'
    },
    {
      title: 'Alta Productos',
      url: '/abm-producto',
      icon: 'beer'
    },
    {
      title: 'Alta Empleados',
      url: '/abm-empleados',
      icon: 'person'
    },
    {
      title: 'Alta de Clientes',
      url: '/abm-cliente',
      icon: 'person'
    },
    {
      title: 'Encuesta Satisfacción',
      url: '/encuesta-cliente',
      icon: 'book'
    },
    {
      title: 'Estadística Satisfacción',
      url: '/est-satisfaccion',
      icon: 'pie'
    },
    {
      title: 'Cerrar Sesion',
      url: '/login',
      icon: 'log-out'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}
