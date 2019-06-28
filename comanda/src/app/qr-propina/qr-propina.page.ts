import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from '@ionic/angular';
import { AlertController } from "@ionic/angular";
import { AudioService } from "../services/audio.service";

import * as firebase from "firebase";


@Component({
  selector: 'app-qr-propina',
  templateUrl: './qr-propina.page.html',
  styleUrls: ['./qr-propina.page.scss'],
})
export class QrPropinaPage implements OnInit {
  pedidoCliente: any;
  propina: any;
  key: any;
  preciototalAnterior: any;
  totalFinal: any;
  existePedido: boolean = false;
  pedidoDetalle: any[] = [];
  precioComidaMasBarata: number = 9999999999;
  precioBebidaMasBarata: number = 9999999999;

  constructor(private scanner: BarcodeScanner,
    private baseService: FirebaseService,
    private toastcontroler: ToastController,
    private alertCtrl: AlertController,
    private audioService: AudioService
  ) {
    this.traerPedido();
  }

  ngOnInit() {
  }


  doScan() {
    this.scanner.scan().then((data) => {
      this.propina = data.text;

      if (this.propina == '5' || this.propina == '10' || this.propina == '15' || this.propina == '20') {
        if (this.existePedido) {
          this.key = this.pedidoCliente.key;

          this.totalFinal = this.pedidoCliente.preciototal + (this.pedidoCliente.preciototal * parseInt(this.propina) / 100);

          this.muestroAlert();
        } else {
          this.mostrarAlertSinPedido();
        }
      } else {
        this.mostrarQRErroneo();
      }
    }, (err) => {
      alert("Error: " + err);
    });
  }

  async mostrarQRErroneo() {
    const alert = await this.alertCtrl.create({
      header: 'El código leído no es un QR de propina',
      message: 'Debe escanear un QR valido',
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarAlertSinPedido() {
    const alert = await this.alertCtrl.create({
      header: 'No existe pedido',
      message: 'Su pedido debe estar aceptado, en preparación o entregado',
      buttons: ['OK']
    });
    await alert.present();
  }

  async muestroAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Propina seleccionada: ' + this.propina + '%',
      subHeader: '¿Confirma propina?',
      message: 'Precio pedido: $' + JSON.stringify(this.pedidoCliente.preciototal) + ' Desea agregar ' + this.propina + '%? Precio final: $' + this.totalFinal,

      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.audioService.play('clink');
            this.cargarenlaBD();
            this.subidaCorrecta();
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  async subidaCorrecta() {
    const toast = await this.toastcontroler.create({
      message: 'Precio Final: $' + this.totalFinal,
      color: 'success',
      showCloseButton: true,
      position: 'middle',
      closeButtonText: 'OK'
    });
    toast.present();
  }

  async subidaErronea(mensaje: string) {
    const toast = await this.toastcontroler.create({
      message: mensaje,
      color: 'danger',
      showCloseButton: false,
      position: 'top',
      closeButtonText: 'Done',
      duration: 3000
    });
    toast.present();
  }

  cargarenlaBD() {
    firebase.database().ref('pedidos/' + this.key)
      .update({
        preciototal: this.totalFinal
      });
  }

  traerPedido() {
    this.baseService.getItems('pedidos').then(pedidos => {
      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
      this.pedidoCliente = pedidos.find(ped => ped.cliente == usuarioLogueado.correo && ped.estado != 'finalizado' && ped.estado != 'creado');
      if (this.pedidoCliente != undefined) {
        this.preciototalAnterior = this.pedidoCliente.preciototal;
        this.existePedido = true;
        this.baseService.getItems('pedidoDetalle').then(detalles => {
          this.pedidoDetalle = detalles.filter(det => det.id_pedido == this.pedidoCliente.id);
          if (this.pedidoCliente.juegoComida || this.pedidoCliente.juegoBebida || this.pedidoCliente.juegoDescuento)
            this.baseService.getItems('productos').then(productos => {
              this.pedidoDetalle.forEach(det => {
                let producto = productos.find(prd => prd.nombre == det.producto);
                if (producto.quienPuedever == 'cocinero') {
                  if (producto.precio < this.precioComidaMasBarata) {
                    this.precioComidaMasBarata = producto.precio;
                  }
                } else
                  if (producto.quienPuedever == 'bartender') {
                    if (producto.precio < this.precioBebidaMasBarata) {
                      this.precioBebidaMasBarata = producto.precio;
                    }
                  }
              });
              this.aplicarDescuento();
            });
        });
      }
    });
  }

  aplicarDescuento() {
    if (this.pedidoCliente.juegoDescuento)
      this.pedidoCliente.preciototal -= this.pedidoCliente.preciototal * 10 / 100;
    if (this.pedidoCliente.juegoBebida)
      this.pedidoCliente.preciototal -= this.precioBebidaMasBarata;
    if (this.pedidoCliente.juegoComida)
      this.pedidoCliente.preciototal -= this.precioComidaMasBarata;
  }
}



