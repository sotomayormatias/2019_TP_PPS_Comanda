import { Component } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { AudioService } from "../services/audio.service";
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  sounds: boolean;

  constructor(private menu: MenuController,
    private audioService: AudioService,
    private toastCtrl: ToastController,
    private fcm: FCM) {
    this.sounds = this.audioService.activo;
    let usuario = JSON.parse(sessionStorage.getItem('usuario'));
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

  toggleSound() {
    this.audioService.toggleSound();
    this.sounds = this.audioService.activo;
    if (this.sounds)
      this.presentToast('Sonido activado');
    else
      this.presentToast('Sonido desactivado');
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: 'success',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
  }

}
