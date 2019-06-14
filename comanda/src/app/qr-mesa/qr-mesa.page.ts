import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { AlertController } from '@ionic/angular';

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

  constructor(private scanner: BarcodeScanner,
    private baseService: FirebaseService,
    private alertCtrl: AlertController) {
    this.traerDatosCliente(JSON.parse(sessionStorage.getItem('usuario')).correo);
  }

  ngOnInit() {
  }

  doScan() {
    this.scanner.scan().then((data) => {
      this.datosEscaneados = data;
      this.parsedDatosEscaneados = JSON.parse(this.datosEscaneados.text);
      // this.presentAlert();
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
      if (usuarioLogueado.perfil == "cliente") {
        if (this.mesaEscaneada.estado == 'libre') {
          this.presentAlertCliente();
        } else {
          // TODO: aca hay que ver si el que escanea es el que esta ocupando la mesa
          this.presentAlertEmpleado();
        }
      } else {
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
}
