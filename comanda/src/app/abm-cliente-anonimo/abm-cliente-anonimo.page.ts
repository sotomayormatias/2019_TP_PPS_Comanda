import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators , FormControl } from '@angular/forms';
// import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
// import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
// import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { AlertController } from '@ionic/angular';
import * as firebase from "firebase";
import { FirebaseService } from '../services/firebase.service';
import { Router } from "@angular/router";
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-abm-cliente-anonimo',
  templateUrl: './abm-cliente-anonimo.page.html',
  styleUrls: ['./abm-cliente-anonimo.page.scss'],
})
export class AbmClienteAnonimoPage implements OnInit {
  formClienteAnonimo: FormGroup;
  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;
  esAnonimo: boolean = true;
  datosEscaneados: any;
  datosCliente: any;
  datosUsuario: any;
  nombreAnonimo: any;
  nombreAnon: any;

  constructor(
    private alertCtrl: AlertController,
    private baseService: FirebaseService,
    public events: Events,
    private router: Router
  ) {
  
    this.formClienteAnonimo = new FormGroup({
      nombreAnonimo: new FormControl('', Validators.required)
    });
    this.captureDataUrl = new Array<string>();
  }

  ngOnInit() {
  }

  async presentAlert(err) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Error!',
      message: err,
      buttons: ['OK']
    });

    await alert.present();
  }

  agregarCliente() {
    let storageRef = firebase.storage().ref();
    let errores: number = 0;

    this.datosCliente = {
        'nombre': this.formClienteAnonimo.get('nombreAnonimo').value,
        'esAnonimo': true
    };

    this.guardardatosDeCliente(this.datosCliente);

   

    if (errores == 0) {
      this.subidaExitosa("Logueo ANONIMO ok");
      
      this.router.navigateByUrl('/home');
    } else
      this.subidaErronea("Error en al menos una foto");
  }

  guardardatosDeCliente(datos) {
    
    let clave = '1234';
    let perfil = 'clienteAnonimo';

    this.datosUsuario = {
      'clave': clave,
      'correo': this.nombreAnon ,
      'perfil': perfil
    };

    
    this.baseService.addItem('usuarios', this.datosUsuario );
    this.events.publish('usuarioLogueado', 'clienteAnonimo');

  }

  async subidaExitosa(mensaje) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Éxito',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
    // clear the previous photo data in the variable
    this.captureDataUrl.length = 0;
  }

  async subidaErronea(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Éxito',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  // doScan() {
  //   this.scanner.scan({ "formats": "PDF_417" }).then((data) => {
  //     this.datosEscaneados = data;
  //     this.cargarDatosDesdeDni(this.datosEscaneados);
  //   }, (err) => {
  //     console.log("Error: " + err);
  //   });
  // }

  // cargarDatosDesdeDni(datos: any) {
  //   let parsedData = datos.text.split('@');
  //   let nombre = parsedData[2].toString();
  //   let apellido = parsedData[1].toString();
  //   let dni: number = +parsedData[4];
    
  //   this.formClienteAnonimo.get('nombreAnonimo').setValue(nombre);
  
  // }
}
