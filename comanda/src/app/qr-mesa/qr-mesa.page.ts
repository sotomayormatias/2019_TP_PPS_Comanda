import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPedidoPage } from "../modal-pedido/modal-pedido.page";

@Component({
  selector: 'app-qr-mesa',
  templateUrl: './qr-mesa.page.html',
  styleUrls: ['./qr-mesa.page.scss'],
})
export class QrMesaPage implements OnInit {
  datosEscaneados: any;
  parsedDatosEscaneados: any;
  mesaEscaneada: any;
  clienteLogueado: any;
  pedidos: any;
  idPedido: number;

  constructor(private scanner: BarcodeScanner,
    private baseService: FirebaseService,
    private alertCtrl: AlertController,
    private router: Router,
    public modalController: ModalController) {
    this.traerDatosCliente(JSON.parse(sessionStorage.getItem('usuario')).correo);
    this.traerPedidos();
  }

  ngOnInit() {
  }

  doScan() {
    this.scanner.scan().then((data) => {
      this.datosEscaneados = data;
      this.parsedDatosEscaneados = JSON.parse(this.datosEscaneados.text);
      this.mostrarInformacion();
    }, (err) => {
      console.log("Error: " + err);
    });
  }

  mostrarInformacion() {
    this.baseService.getItems('mesas').then(mesas => {
      let nroMesa = this.parsedDatosEscaneados.mesa;
      this.mesaEscaneada = mesas.find(mesa => mesa.nromesa == nroMesa);
      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
      if (usuarioLogueado.perfil == "cliente") { // Logica para cuando escanea el cliente
        if (this.mesaEscaneada.estado == 'libre') { // si la mesa esta libre
          this.presentAlertCliente();
        } else { // Si la mesa esta ocupada
          if (this.mesaEscaneada.cliente == usuarioLogueado.correo) { // Si el que escanea es el que ocupa la mesa
            if (this.verificarPedidoEnPreparacion()) { //Si ya hizo un pedido
              this.presentAlertConPedido();
            } else { // Si aun no hizo un pedido
              this.presentAlertSinPedido();
            }
          } else { // Si el que escanea no es quien ocupa la mesa
            this.presentAlertEmpleado();
          }
        }
      } else { // Logica para cuando escanea un empleado
        this.presentAlertEmpleado();
      }
    });
  }

  async presentAlertEmpleado() {
    const alert = await this.alertCtrl.create({
      header: 'Estado de mesa',
      subHeader: 'Mesa: ' + this.mesaEscaneada.nromesa,
      message: 'La mesa se encuentra ' + this.mesaEscaneada.estado,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertSinPedido() {
    const alert = await this.alertCtrl.create({
      header: 'Mesa: ' + this.mesaEscaneada.nromesa,
      subHeader: 'Mesa sin pedido',
      message: 'Todavía no ha realizado ningún pedido',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertCliente() {
    const alert = await this.alertCtrl.create({
      header: 'Estado de mesa',
      subHeader: 'Mesa: ' + this.mesaEscaneada.nromesa,
      message: 'La mesa se encuentra libre. ¿Desea ocuparla?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.ocuparMesa();
          }
        },
        {
          text: 'No',
          handler: () => {
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertConPedido() {
    const alert = await this.alertCtrl.create({
      header: 'Mesa: ' + this.mesaEscaneada.nromesa,
      subHeader: '¿Pedido o encuesta?',
      message: '¿Desea ver el status de su pedido o acceder a la encuesta de satisfacción?',
      buttons: [
        {
          text: 'Pedido',
          handler: () => {
            this.verPedido();
          }
        },
        {
          text: 'Encuesta',
          handler: () => {
            this.verEncuesta();
          }
        }
      ]
    });
    await alert.present();
  }

  ocuparMesa() {
    this.mesaEscaneada.estado = 'ocupada';
    this.mesaEscaneada.cliente = this.clienteLogueado.correo;
    let key = this.mesaEscaneada.key;
    delete this.mesaEscaneada['key'];
    this.baseService.updateItem('mesas', key, this.mesaEscaneada);
  }

  traerDatosCliente(correo: string): any {
    this.baseService.getItems('clientes').then(clientes => {
      this.clienteLogueado = clientes.find(cli => cli.correo == correo);
    });
  }

  traerPedidos() {
    this.baseService.getItems('pedidos').then(ped => {
      this.pedidos = ped;
    });
  }

  verificarPedidoEnPreparacion(): boolean {
    if (this.pedidos.filter(pedido => pedido.mesa == this.mesaEscaneada.nromesa && pedido.estado != 'cerrado').length > 0) {
      this.idPedido = this.pedidos.filter(pedido => pedido.mesa == this.mesaEscaneada.nromesa).id;
      return true;
    } else {
      return false;
    };
  }

  verPedido() {
    this.muestraModal();
  }

  verEncuesta() {
    this.router.navigateByUrl('/encuesta-cliente');
  }

  async muestraModal() {
    const modal = await this.modalController.create({
      component: ModalPedidoPage,
      componentProps: {
        pedido: this.idPedido,
      }
    });
    return await modal.present();
  }

}
