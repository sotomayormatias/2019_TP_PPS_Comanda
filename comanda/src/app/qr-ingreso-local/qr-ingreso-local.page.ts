import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { AlertController } from '@ionic/angular';
import * as firebase from "firebase";
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-ingreso-local',
  templateUrl: './qr-ingreso-local.page.html',
  styleUrls: ['./qr-ingreso-local.page.scss'],
})
export class QrIngresoLocalPage implements OnInit {
  datosEscaneados: any;
  parsedDatosEscaneados: any;
  mesaEscaneada: any;

  constructor(private scanner: BarcodeScanner,
              private baseService: FirebaseService,
              private alertCtrl: AlertController,
              private router: Router) {
  }

  ngOnInit() {
  }

  doScan() {
    this.scanner.scan().then((data) => {

    this.datosEscaneados = data.text;

    console.log('Data:', data);
    console.log('DatosEscaneados: ', this.datosEscaneados );
    // this.parsedDatosEscaneados = JSON.parse(this.datosEscaneados.text);

    // VERIFICO CODIGO QR
    if ( this.datosEscaneados == "IngresoLocal" ||
          this.datosEscaneados.text == "IngresoLocal"
    ) {
      let usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario"));
      // this.presentAlertIngresoLocal();

      if (usuarioLogueado.perfil == "cliente") {
        // this.presentAlertCliente();
        // PONGO AL CLIENTE EN LA LISTA DE ESPERA
        let datos: any = { 'correo': usuarioLogueado.correo, 'perfil': usuarioLogueado.perfil, 'key': usuarioLogueado.key, 'estado': "confirmacionMozo" };
        // let datosUsuario: any = { 'clave': this.clave, 'correo': this.correo, 'perfil': this.templeado }
        this.clienteListaEspera(datos);
        // LO DIRIJO A LA LISTA DE ESPERA DE CLIENTES
        this.router.navigateByUrl('/list-confirmar-cliente-mesa');
      } else {
        // VOY A MOSTRAR ESTADISTICAS DE CLIENTES
        this.router.navigateByUrl('/est-satisfaccion');
      }
    } else {
      this.presentAlertQRErroneo();
    }

    // this.presentAlert();
    // this.mostrarInformacion();
  }, (err) => {
    console.log("Error: " + err);
  });
  }


  clienteListaEspera(datos) {
    let storageRef = firebase.database().ref('listaEsperaClientes/');
    let imageData = storageRef.push();
    imageData.set(datos);

  }

  async presentAlertQRErroneo() {
  const alert = await this.alertCtrl.create({
  header: 'QR Erroneo',
  subHeader: 'El codigo QR no pertenece a ingreso de mesa',
  message: 'Por favor apunte al código QR de Ingreso Local',
  buttons: ['OK']
  });
  await alert.present();
  }



  async presentAlertIngresoLocal() {
    const alert = await this.alertCtrl.create({
      header: 'Ingreso Local',
      subHeader: 'Estoy en Ingreso Local',
      message: 'Ingreso Local',
      buttons: ['OK']
      });
    await alert.present();
  }

  async presentAlertCliente() {
    const alert = await this.alertCtrl.create({
      header: 'Alert Cliente',
      subHeader: 'Estoy en Alert Cliente',
      message: 'Alert Cliente',
      buttons: ['OK']
      });
    await alert.present();
  }

  async presentAlertSuperVisor() {
    const alert = await this.alertCtrl.create({
      header: 'Alert Supervisor',
      subHeader: 'Estoy en Alert Supervisor',
      message: 'Alert Supervisor',
      buttons: ['OK']
      });
    await alert.present();
  }
  // async presentAlertCliente() {
  // const alert = await this.alertCtrl.create({
  // header: 'Estado de mesa',
  // subHeader: 'Mesa: ' + this.mesaEscaneada.nromesa,
  // message: 'La mesa se encuentra libre. ¿Desea ocuparla?',
  // buttons: [
  // {
  // text: 'Sí',
  // handler: () => {
  //   this.cambiarEstadoMesa();
  // }
  // },
  // {
  // text: 'No',
  // handler: () => {
  //   return true;
  // }
  // }
  // ]
  // });
  // await alert.present();
  // }

  cambiarEstadoMesa() {
  this.mesaEscaneada.estado = 'ocupada';
  let key = this.mesaEscaneada.key;
  delete this.mesaEscaneada.key;
  this.baseService.updateItem('mesas', key, this.mesaEscaneada);
  }
}
