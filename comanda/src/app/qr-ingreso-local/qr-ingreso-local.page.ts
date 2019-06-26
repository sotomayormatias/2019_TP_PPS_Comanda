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

      // VERIFICO CODIGO QR
      if (this.datosEscaneados == "IngresoLocal" || this.datosEscaneados.text == "IngresoLocal") {
        let usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario"));

        if (usuarioLogueado.perfil == "cliente" || usuarioLogueado.perfil == "clienteAnonimo") {

          // PONGO AL CLIENTE EN LA LISTA DE ESPERA
          let datos: any = { 'correo': usuarioLogueado.correo, 'perfil': usuarioLogueado.perfil, 'estado': "confirmacionMozo" };
          this.baseService.addItem('listaEsperaClientes', datos);

          // LO DIRIJO A LA LISTA DE ESPERA DE CLIENTES
          this.router.navigateByUrl('/list-confirmar-cliente-mesa');
        } else {
          // VOY A MOSTRAR ESTADISTICAS DE CLIENTES
          this.router.navigateByUrl('/est-satisfaccion');
        }
      } else {
        this.presentAlertQRErroneo();
      }
    }, (err) => {
      console.log("Error: " + err);
    });
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
}
