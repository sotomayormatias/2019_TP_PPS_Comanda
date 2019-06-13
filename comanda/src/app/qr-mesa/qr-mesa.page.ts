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

  constructor(private scanner: BarcodeScanner,
              private baseService: FirebaseService,
              private alertCtrl: AlertController) {
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

  // async presentAlert() {
  //   console.log(JSON.parse(this.datosEscaneados));
  //   console.log(JSON.parse(this.datosEscaneados).mesa);
  //   const alert = await this.alertCtrl.create({
  //     header: 'Estado de mesa',
  //     subHeader: 'Mesa',
  //     message: 'nro: ' + this.datosEscaneados.mesa,
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }

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
            this.cambiarEstadoMesa();
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

  cambiarEstadoMesa() {
    this.mesaEscaneada.estado = 'ocupada';
    let key = this.mesaEscaneada.key;
    delete this.mesaEscaneada['key'];
    this.baseService.updateItem('mesas', key, this.mesaEscaneada);
  }
}
