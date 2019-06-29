import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from "@ionic/angular";
import { FirebaseService } from "../services/firebase.service";
import { Router } from '@angular/router';
import { AudioService } from "../services/audio.service";

var tiempo;

@Component({
  selector: 'app-juego-bebida',
  templateUrl: './juego-bebida.page.html',
  styleUrls: ['./juego-bebida.page.scss'],
})
export class JuegoBebidaPage implements OnInit {
  deshabilitarInput: boolean = false;
  palabraIngresada: string;
  puedeJugar: boolean = true;
  palabras: any = ['COCHE', 'PERRO', 'CABEZA', 'MILANESA', 'PARTIDO', 'CASCABEL', 'FACTURA', 'RELOJ', 'BUFANDA', 'TIJERA', 'BOTELLA'];
  palabraOrdenada: any = this.traerPalabraAleatoria(0, (this.palabras.length - 1));
  palabraDesordenada: any;
  palabrasAcertadas: number = 0;
  pedidos: any[] = [];
  mensajeNoPuedeJugar: string;

  constructor(public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public baseService: FirebaseService,
    public router: Router,
    public audioService: AudioService) {
    this.inicializarContador();
    this.desordenarPalabra();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.verificarPuedeJugar();
  }

  inicializarContador() {
    var seconds = 30;
    tiempo = setInterval(function () {
      seconds -= 1;
      document.getElementById("second").innerHTML = seconds.toString();
      if (seconds == 0) {
        clearInterval(tiempo);
        document.getElementById("second").innerHTML = '0';
        let element: HTMLElement = document.getElementById('btn') as HTMLElement;
        element.click();
      }
    }, 1000);
  }

  verificar() {
    if (this.palabraIngresada.toUpperCase() == this.palabraOrdenada) {
      this.muestroToastCorrecto();
      this.palabrasAcertadas += 1;
    } else {
      this.muestroToastIncorrecto();
    }
    if (this.palabrasAcertadas == 5) {
      this.mostrarAlertGana();
      this.audioService.play('ganador');
      this.deshabilitarInput = true;
      clearInterval(tiempo);
    } else {
      this.palabraOrdenada = this.traerPalabraAleatoria(0, (this.palabras.length - 1));
      this.desordenarPalabra();
    }
    this.palabraIngresada = '';
  }

  async muestroToastCorrecto() {
    // Hacemos uso de Toast Controller para lanzar mensajes flash.
    let toast = await this.toastCtrl.create({
      message: 'Acertaste!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  async muestroToastIncorrecto() {
    // Hacemos uso de Toast Controller para lanzar mensajes flash.
    let toast = await this.toastCtrl.create({
      message: 'No, no es esa!',
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  async mostrarAlertGana() {
    const alert = await this.alertCtrl.create({
      header: 'Juego Bebida',
      subHeader: 'Gansate!',
      message: 'Ganaste una bebida gratis!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.anotarDescuento(true);
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarAlertPierde() {
    const alert = await this.alertCtrl.create({
      header: 'Perdiste!',
      subHeader: 'No llegaste a acertar 5 palabras',
      message: 'La próxima vez será',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.anotarDescuento(false);
          }
        }
      ]
    });
    await alert.present();
  }

  verificarPuedeJugar() {
    let usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));
    this.baseService.getItems('pedidos').then(pedidos => {
      this.pedidos = pedidos;
      this.puedeJugar = this.pedidos.filter(ped => ped.cliente == usuarioLogueado.correo && (ped.estado != 'finalizado' || ped.estado != 'creado')).length > 0;

      if (!this.puedeJugar)
        this.mensajeNoPuedeJugar = 'Usted no tiene ningún pedido para poder jugar';
      else if (sessionStorage.getItem('yaJugo')) {
        this.puedeJugar = sessionStorage.getItem('yaJugo') != 'si';
        this.mensajeNoPuedeJugar = 'Usted ya ha jugado';
      }
    });
  }

  anotarDescuento(gana: boolean) {
    let usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));
    sessionStorage.setItem('yaJugo', 'si');
    if (gana) {
      let pedido = this.pedidos.find(ped => ped.cliente == usuarioLogueado.correo && (ped.estado != 'finalizado' || ped.estado != 'creado'))
      let key = pedido.key;
      delete pedido['key'];
      pedido.juegoBebida = true;
      this.baseService.updateItem('pedidos', key, pedido);
    }
    this.router.navigateByUrl('/home');
  }

  traerPalabraAleatoria(primer, ultimo) {
    let numberOfName = Math.round(Math.random() * (ultimo - primer) + (primer));
    return this.palabras[numberOfName];
  }

  desordenarPalabra(): any {
    var copiaPalabra = this.palabraOrdenada.split("");
    var long = copiaPalabra.length;

    for (var i = long - 1; i > 0; i--) {
      var temporal = Math.floor(Math.random() * (i + 1));
      var tmp = copiaPalabra[i];
      copiaPalabra[i] = copiaPalabra[temporal];
      copiaPalabra[temporal] = tmp;
    }
    this.palabraDesordenada = copiaPalabra.join("");
  }

  perder() {
    this.mostrarAlertPierde();
    this.deshabilitarInput = true;
    this.audioService.play('perdedor');
  }
}
