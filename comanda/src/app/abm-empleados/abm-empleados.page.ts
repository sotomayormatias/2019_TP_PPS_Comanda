import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';
import * as firebase from "firebase";
import { ToastController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-abm-empleados',
  templateUrl: './abm-empleados.page.html',
  styleUrls: ['./abm-empleados.page.scss'],
})
export class AbmEmpleadosPage implements OnInit {
  formEmpleado: FormGroup;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: number;
  templeado: string;
  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;
  datosEscaneados: any;
  datos: any;
  correo: any;
  clave: any;

  constructor(
    private camera: Camera,
    private scanner: BarcodeScanner,
    public toastController: ToastController,
    private alertCtrl: AlertController,
    private baseService: FirebaseService
    ) {
    this.formEmpleado = new FormGroup({
      nombreCtrl: new FormControl('', Validators.required),
      apellidoCtrl: new FormControl('', Validators.required),
      dniCtrl: new FormControl('', Validators.required),
      cuilCtrl: new FormControl('', Validators.required),
      templeadoCtrl: new FormControl('', Validators.required),
      correoCtrl: new FormControl('', Validators.required),
      claveCtrl: new FormControl('', Validators.required)
    });
    this.captureDataUrl = new Array<string>();
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

  agregarEmpleado() {
    // let usuario = JSON.parse(sessionStorage.getItem('usuario'));
    let storageRef = firebase.storage().ref();
    let errores: number = 0;
    let contador: number = 0;

    this.captureDataUrl.forEach(foto => {
      let filename: string = this.nombre + "_" + contador;
      const imageRef = storageRef.child(`empleados/${filename}.jpg`);

      let datos: any = { 'nombre': this.nombre, 'apellido': this.apellido, 'dni': this.dni, 'cuil': this.cuil, 'templeado': this.templeado };
      // let datosUsuario: any = { 'clave': this.clave, 'correo': this.correo, 'perfil': this.templeado }
      this.guardardatosDeProducto(datos);

      // let datosUsuario = { 'clave': this.clave, 'correo': this.correo, 'perfil': this.templeado};
      // this.guardarDatosUsuario(datosUsuario);

      imageRef.putString(foto, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      })
        .catch(() => {
          errores++;
        });
    });
   

    if (errores == 0)
      this.subidaExitosa("Las imagenes se han subido correctamente");
    else
      this.subidaErronea("Error en al menos una foto");
  }

  guardardatosDeProducto(datos) {
    // console.log("estoy en guardar datos empleados");
    let storageRef = firebase.database().ref('empleados/');
    let imageData = storageRef.push();
    imageData.set(datos);
    this.baseService.addItem('usuarios', { 'clave': this.clave, 'correo': this.correo, 'perfil': this.templeado });
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

    this.clearInputs();
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
    
    this.formEmpleado.get('nombreCtrl').setValue(nombre);
    this.formEmpleado.get('apellidoCtrl').setValue(apellido);
    this.formEmpleado.get('dniCtrl').setValue(dni);
  }

  clearInputs() {
      this.formEmpleado.get('nombreCtrl').setValue("");
      this.formEmpleado.get('apellidoCtrl').setValue("");
      this.formEmpleado.get('dniCtrl').setValue("");
      this.formEmpleado.get('cuilCtrl').setValue("");
      this.formEmpleado.get('templeadoCtrl').setValue("");


  }
}


