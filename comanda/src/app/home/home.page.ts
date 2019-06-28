import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private menu: MenuController, private fcm: FCM) {

    let usuario =  JSON.parse(sessionStorage.getItem('usuario'));

    if (usuario.perfil == "supervisor") {
      this.fcm.subscribeToTopic('notificacionReservas');
    } else if (usuario.perfil == "mozo") {
      this.fcm.subscribeToTopic('notificacionMesa');
    } else if (usuario.perfil == "cocinero" || usuario.perfil == "bartender") {
      this.fcm.subscribeToTopic('notificacionPedido');
    }
    


   }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

}
