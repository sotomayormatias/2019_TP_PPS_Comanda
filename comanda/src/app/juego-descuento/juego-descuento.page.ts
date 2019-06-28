import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { AlertController } from "@ionic/angular";
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego-descuento',
  templateUrl: './juego-descuento.page.html',
  styleUrls: ['./juego-descuento.page.scss'],
})
export class JuegoDescuentoPage implements OnInit {
  numeroSecreto: number;
  numeroIngresado: number;
  contador: number = 1;
  pedidos: any[] = [];
  puedeJugar: boolean = false;
  mensajeResultado: string = '';
  imagen: string;
  deshabilitarInput: boolean = false;
  mensajeNoPuedeJugar: string = '';

  constructor(private baseService: FirebaseService,
    private alertCtrl: AlertController,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.verificarPuedeJugar();
    this.generarNumero();
    this.imagen = '../../assets/imgs/hombre_pensando.jpg';
  }

  generarNumero() {
    this.numeroSecreto = Math.floor((Math.random() * 100) + 1);
  }

  verificar() {
    if (this.numeroIngresado > this.numeroSecreto) {
      this.mensajeResultado = 'El número es más chico';
      switch (this.contador) {
        case 1:
          this.imagen = '../../assets/imgs/no_1.png';
          break;
        case 2:
          this.imagen = '../../assets/imgs/no_2.jpg';
          break;
        case 3:
          this.imagen = '../../assets/imgs/no_3.jpg';
          this.terminarJuego();
          break;
      }
    } else if (this.numeroIngresado < this.numeroSecreto) {
      this.mensajeResultado = 'El número es más grande';
      switch (this.contador) {
        case 1:
          this.imagen = '../../assets/imgs/no_1.png';
          break;
        case 2:
          this.imagen = '../../assets/imgs/no_2.jpg';
          break;
        case 3:
          this.imagen = '../../assets/imgs/no_3.jpg';
          this.terminarJuego();
          break;
      }
    } else {
      this.mensajeResultado = '¡¡¡GANASTE!!!';
      this.imagen = '../../assets/imgs/si.jpg'
      this.terminarJuego();
    }
    this.contador++;
    this.numeroIngresado = null;
  }

  verificarPuedeJugar() {
    let usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));
    this.baseService.getItems('pedidos').then(pedidos => {
      this.pedidos = pedidos;
      this.puedeJugar = this.pedidos.filter(ped => ped.cliente == usuarioLogueado.correo && (ped.estado != 'finalizado' || ped.estado != 'creado')).length > 0;

      if (!this.puedeJugar)
        this.mensajeNoPuedeJugar = 'Usted no tiene ningún pedido para poder jugar';
      else if (sessionStorage.getItem('yaJugo')){
        this.puedeJugar = sessionStorage.getItem('yaJugo') != 'si';
        this.mensajeNoPuedeJugar = 'Usted ya ha jugado';
      }
    });
  }

  terminarJuego() {
    this.deshabilitarInput = true;
    this.mensajeResultado = "";
    if (this.numeroIngresado == this.numeroSecreto) {
      this.mostrarAlertGana();
    } else {
      this.mostrarAlertPierde();
    }
  }

  async mostrarAlertGana() {
    const alert = await this.alertCtrl.create({
      header: 'Juego descuento',
      subHeader: 'Gansate!',
      message: 'Ganaste un 10% de descuento!',
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
      subHeader: 'El número era ' + this.numeroSecreto,
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

  anotarDescuento(gana: boolean) {
    let usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));
    sessionStorage.setItem('yaJugo', 'si');
    if (gana) {
      let pedido = this.pedidos.find(ped => ped.cliente == usuarioLogueado.correo && (ped.estado != 'finalizado' || ped.estado != 'creado'))
      let key = pedido.key;
      delete pedido['key'];
      pedido.juegoDescuento = true;
      this.baseService.updateItem('pedidos', key, pedido);
    }
    this.router.navigateByUrl('/home');
  }
}
