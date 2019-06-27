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
  mesas: any[] = [];
  listaEspera: any[] = [];

  constructor(private scanner: BarcodeScanner,
    private baseService: FirebaseService,
    private alertCtrl: AlertController,
    private router: Router) {
    this.traerMesas();
    this.traerListaEspera();
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
          let tieneMesa: boolean = false;
          let nroMesa: number;
          this.mesas.forEach(mesa => {
            if (mesa.cliente == usuarioLogueado.correo) {
              tieneMesa = true;
              nroMesa = mesa.nromesa;
            }
          });
          if (tieneMesa) {
            this.presentAlertTieneMesa(nroMesa);
          } else {
            let estaEnLista: boolean = false;
            this.listaEspera.forEach(lista => {
              if (lista.correo == usuarioLogueado.correo) {
                estaEnLista = true;
              }
            });
            if (estaEnLista) {
              this.presentAlertEstaEnLista();
            } else {
              // PONGO AL CLIENTE EN LA LISTA DE ESPERA
              let datos: any = { 'correo': usuarioLogueado.correo, 'perfil': usuarioLogueado.perfil, 'estado': "confirmacionMozo" };
              this.baseService.addItem('listaEsperaClientes', datos);

              // LO DIRIJO A LA LISTA DE ESPERA DE CLIENTES
              this.router.navigateByUrl('/list-confirmar-cliente-mesa');
            }
          }
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
    this.traerListaEspera();
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

  async presentAlertTieneMesa(nroMesa: number) {
    const alert = await this.alertCtrl.create({
      // header: 'QR Erroneo',
      subHeader: 'Ya tiene mesa',
      message: 'Usted tiene asignada la mesa ' + nroMesa,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertEstaEnLista() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Ya esta en lista',
      message: 'Usted ya se encuentra en lista de espera',
      buttons: ['OK']
    });
    await alert.present();
  }

  traerMesas() {
    this.baseService.getItems('mesas').then(mesas => {
      this.mesas = mesas;
    });
  }

  traerListaEspera() {
    this.baseService.getItems('listaEsperaClientes').then(lista => {
      this.listaEspera = lista;
    });
  }
}
