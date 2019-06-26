import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController, AlertController } from "@ionic/angular";
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-confirmar-entrega',
  templateUrl: './confirmar-entrega.page.html',
  styleUrls: ['./confirmar-entrega.page.scss'],
})
export class ConfirmarEntregaPage implements OnInit {
  pedidoEnLocal: any = null;
  pedidoDelivery: any = null;
  pedidoDetalle: any[] = [];
  hayPedidoDelivery: boolean = false;
  hayPedidoEnLocal: boolean = false;
  precioTotalAnterior: number;
  totalFinal: number;
  propinaFinal: string;
  keyPedidoDelivery: string; 

  constructor(private baseService: FirebaseService,
    private toastCtrl: ToastController,
    private scanner: BarcodeScanner,
    private alertCtrl: AlertController) {
    this.traerPedidos();
  }

  ngOnInit() {
  }

  traerPedidos() {
    let cliente = JSON.parse(sessionStorage.getItem('usuario')).correo;
    this.baseService.getItems('pedidos').then(ped => {
      this.pedidoEnLocal = ped.find(pedido => pedido.estado == "listoEntrega" && pedido.cliente == cliente);
      this.hayPedidoEnLocal = this.pedidoEnLocal != undefined;

      if (this.hayPedidoEnLocal)
        this.traerDetalle(this.pedidoEnLocal.id);
    });

    this.baseService.getItems('pedidosDelivery').then(ped => {
      this.pedidoDelivery = ped.find(pedido => pedido.estado == "listoEntrega" && pedido.cliente == cliente);
      this.hayPedidoDelivery = this.pedidoDelivery != undefined;

      if (this.hayPedidoDelivery)
        this.traerDetalle(this.pedidoDelivery.id);
        this.keyPedidoDelivery = this.pedidoDelivery.key;
    });
  }

  traerDetalle(idPedido: number) {
    this.baseService.getItems('pedidoDetalle').then(pedido => {
      this.pedidoDetalle = pedido.filter(producto => producto.id_pedido == idPedido);
    });
  }

  propina() {
    this.scanner.scan().then((data) => {
      this.propinaFinal = data.text;

      if (this.propinaFinal == '5' || this.propinaFinal == '10' || this.propinaFinal == '15' || this.propinaFinal == '20') {
        this.precioTotalAnterior = this.pedidoDelivery.preciototal;
        this.totalFinal = this.pedidoDelivery.preciototal + (this.pedidoDelivery.preciototal * parseInt(this.propinaFinal) / 100);

        this.muestroAlert();
      } else {
        this.mostrarQRErroneo();
      }
    }, (err) => {
      console.log("Error: " + err);
    });
  }

  async muestroAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Propina seleccionada: ' + this.propinaFinal + '%',
      subHeader: '¿Confirma propina?',
      message: 'Precio pedido: $' + JSON.stringify(this.precioTotalAnterior) + ' Desea agregar ' + this.propinaFinal + '%? Precio final: $' + this.totalFinal,

      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.cargarenlaBD();
            this.presentToast('Propina cargada');
            this.traerDetalle(this.pedidoDelivery.id);
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

  cargarenlaBD() {
    // let key = this.pedidoDelivery.key;
    delete this.pedidoDelivery['key'];
    this.pedidoDelivery.preciototal = this.totalFinal;
    this.baseService.updateItem('pedidosDelivery', this.keyPedidoDelivery, this.pedidoDelivery);
  }

  async mostrarQRErroneo() {
    const alert = await this.alertCtrl.create({
      header: 'El código leído no es un QR de propina',
      message: 'Debe escanear un QR valido',
      buttons: ['OK']
    });
    await alert.present();
  }

  confirmarEntrega() {
    if (this.hayPedidoEnLocal) {
      let key: string = this.pedidoEnLocal.key;
      delete this.pedidoEnLocal['key'];
      this.pedidoEnLocal.estado = 'entregado';
      this.baseService.updateItem('pedidos', key, this.pedidoEnLocal);
    }
    if (this.hayPedidoDelivery) {
      // let key: string = this.pedidoDelivery.key;
      delete this.pedidoDelivery['key'];
      this.pedidoDelivery.estado = 'cobrado';
      this.baseService.updateItem('pedidosDelivery', this.keyPedidoDelivery, this.pedidoDelivery);
    }
    this.presentToast('Entrega confirmada');
    this.traerPedidos();
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
