import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { AlertController } from '@ionic/angular';
import * as firebase from "firebase";
import { Router } from '@angular/router';

import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
  
  apiFCM = 'https://fcm.googleapis.com/fcm/send';

  constructor(private scanner: BarcodeScanner,
              private baseService: FirebaseService,
              private alertCtrl: AlertController,
              public http: Http,
              public httpClient: HttpClient,
              private router: Router) {
    this.traerMesas();
    this.traerListaEspera();
  }

  ngOnInit() {
  }

  
  envioPost() {
    // console.log("estoy en envioPost. Pedido: ", pedido);
    // console.log("estoy en envioPost. Pedido cliente: ", pedido.cliente);
    let usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario"));

    let tituloNotif = "Aceptar - Cliente en espera";


    let bodyNotif = "El cliente " + usuarioLogueado.correo + " se agregó a la lista de espera. Ingrese para confirmar" ; 

    let header = this.initHeaders();
    let options = new RequestOptions({ headers: header, method: 'post'});
    let data =  {
      "notification": {
        "title": tituloNotif   ,
        "body": bodyNotif ,
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon"
      },
      "data": {
        "landing_page": "home",
        "price": "$3,000.00"
      },
        "to": "/topics/notificacionMesa",
        "priority": "high",
        "restricted_package_name": ""
    };

    console.log("Data: ", data);
   
    return this.http.post(this.apiFCM, data, options).pipe(map(res => res.json())).subscribe(result => {
      console.log(result);
    });

               
  }

  
 private initHeaders(): Headers {
  let apiKey = 'key=AAAA2wftesY:APA91bHz-jR4toOu4DkoWYMARt9hfF8sR9YoV0dzGCdS3SGw30JlgFFiVB7-seK3Yll9yC2Rqf22CGwoPhh-7D7rWKdM2N2gT-CgNbk7GGv9VVwx_5Ut48qjWNEItZTIXclH-mnw8St1' ;
  var headers = new Headers();
  headers.append('Authorization', apiKey);
  headers.append('Content-Type', 'application/json');
  return headers;
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
              this.envioPost();
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
