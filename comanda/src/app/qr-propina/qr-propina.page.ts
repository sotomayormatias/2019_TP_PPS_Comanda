import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from '@ionic/angular';
import { AlertController } from "@ionic/angular";


import * as firebase from "firebase";


@Component({
  selector: 'app-qr-propina',
  templateUrl: './qr-propina.page.html',
  styleUrls: ['./qr-propina.page.scss'],
})
export class QrPropinaPage implements OnInit {
  // datosEscaneados: any;
  // parsedDatosEscaneados: any;
  pedidoCliente: any;
  propina: any;
  key: any;
  preciototalAnterior: any;
  totalFinal: any;

  constructor(private scanner: BarcodeScanner,
    private baseService: FirebaseService,
    // private alertcontroler: AlertController,
    private toastcontroler: ToastController,
    private alertCtrl: AlertController

  ) { }

  ngOnInit() {

    // tomardatosPedido();
  }


  doScan() {
    this.scanner.scan().then((data) => {
      // this.datosEscaneados = data.text;
      // this.propina = JSON.parse(this.datosEscaneados.text);
      this.propina = data.text;

      if (this.propina == '5' || this.propina == '10' || this.propina == '15' || this.propina == '20') {
        this.baseService.getItems('pedidos').then(pedidos => {
          let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));

          this.pedidoCliente = pedidos.find(ped => ped.cliente == usuarioLogueado.correo && ped.estado != 'finalizado' && ped.estado != 'creado');
          if (this.pedidoCliente != undefined) {
            this.key = this.pedidoCliente.key;
            this.preciototalAnterior = this.pedidoCliente.preciototal;

            this.totalFinal = this.pedidoCliente.preciototal + (this.pedidoCliente.preciototal * parseInt(this.propina) / 100);

            this.muestroAlert();
          } else {
            this.mostrarAlertSinPedido();
          }
        });
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
      message: 'Precio pedido: $' + JSON.stringify(this.preciototalAnterior) + ' Desea agregar ' + this.propina + '%? Precio final: $' + this.totalFinal,

      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.cargarenlaBD();
            this.subidaCorrecta();
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          // icon: 'close',
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
}



