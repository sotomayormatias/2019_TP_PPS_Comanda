import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { AlertController } from '@ionic/angular';
import * as firebase from "firebase";
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abm-cliente',
  templateUrl: './abm-cliente.page.html',
  styleUrls: ['./abm-cliente.page.scss'],
})
export class AbmClientePage implements OnInit {
  formClienteRegistrado: FormGroup;
  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;
  yaExisteCorreo: boolean = false;
  datosEscaneados: any;
  datosCliente: any;
  clientesRegistrados: any[] = [];

  constructor(
    private camera: Camera,
    private scanner: BarcodeScanner,
    private alertCtrl: AlertController,
    private router: Router,
    private baseService: FirebaseService
  ) {
    this.formClienteRegistrado = new FormGroup({
      nombreRegistrado: new FormControl('', Validators.required),
      apellidoRegistrado: new FormControl('', Validators.required),
      dniRegistrado: new FormControl('', Validators.required),
      correoRegistrado: new FormControl('', Validators.required),
      claveRegistrado: new FormControl('', Validators.required)
    });
    this.captureDataUrl = new Array<string>();
    this.traerClientesRegistrados();
  }

  ngOnInit() {
  }

  tomarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options).then((imageData) => {
      this.captureDataUrl.push('data:image/jpeg;base64,' + imageData);
      this.hayFotos = true;
      this.cantidadFotos += 1;
    }, (err) => {
      this.presentAlert(err);
    });
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
      'nombre': this.formClienteRegistrado.get('nombreRegistrado').value,
      'apellido': this.formClienteRegistrado.get('apellidoRegistrado').value,
      'dni': this.formClienteRegistrado.get('dniRegistrado').value,
      'correo': this.formClienteRegistrado.get('correoRegistrado').value,
      'clave': this.formClienteRegistrado.get('claveRegistrado').value,
      'estado': 'pendiente',
      'esAnonimo': false

    };
    
    this.clientesRegistrados.forEach(cli => {
      if (cli.correo == this.datosCliente.correo) {
        this.yaExisteCorreo = true;
      }
    });

    if (this.yaExisteCorreo) {
      this.AlertYaExisteUsuario();
    } else {
      this.baseService.addItem('clientes', this.datosCliente);

      this.captureDataUrl.forEach(foto => {
        let filename: string = (this.formClienteRegistrado.get('nombreRegistrado').value).replace(' ', '_');
        const imageRef = storageRef.child(`clientes/${filename}.jpg`);

        imageRef.putString(foto, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        })
          .catch(() => {
            errores++;
          });
      });

      if (errores == 0) {
        this.subidaExitosa("En pedido de aprobación");
        this.formClienteRegistrado.get('nombreRegistrado').setValue('');
        this.formClienteRegistrado.get('apellidoRegistrado').setValue('');
        this.formClienteRegistrado.get('dniRegistrado').setValue('');
        this.router.navigateByUrl('/login');
      } else
        this.subidaErronea("Error en al menos una foto");
    }
  }

  async subidaExitosa(mensaje) {
    const alert = await this.alertCtrl.create({
      header: 'Cliente cargado',
      subHeader: 'Esperando aprobación',
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

  async AlertYaExisteUsuario() {
    const alert = await this.alertCtrl.create({
      header: 'Usuario existente',
      message: 'Ya existe un usuario con el correo ' + this.datosCliente.correo,
      buttons: ['OK']
    });
    await alert.present();
  }

  doScan() {
    this.scanner.scan({ "formats": "PDF_417" }).then((data) => {
      this.datosEscaneados = data;
      this.cargarDatosDesdeDni(this.datosEscaneados);
    }, (err) => {
      console.log("Error: " + err);
    });
  }

  cargarDatosDesdeDni(datos: any) {
    let parsedData = datos.text.split('@');
    let nombre = parsedData[2].toString();
    let apellido = parsedData[1].toString();
    let dni: number = +parsedData[4];

    this.formClienteRegistrado.get('nombreRegistrado').setValue(nombre);
    this.formClienteRegistrado.get('apellidoRegistrado').setValue(apellido);
    this.formClienteRegistrado.get('dniRegistrado').setValue(dni);
  }

  traerClientesRegistrados() {
    this.baseService.getItems('clientes').then(cli => {
      this.clientesRegistrados = cli;
    });
  }
}
