import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import * as firebase from "firebase";

@Component({
  selector: 'app-abm-duesup',
  templateUrl: './abm-duesup.page.html',
  styleUrls: ['./abm-duesup.page.scss'],
})
export class AbmDuesupPage implements OnInit {
  // Datos Dueño/Sup
  formDueSup: FormGroup;
  nombre: string;
  apellido: string;
  DNI: number;
  CUIL: string;
  perfil: string;
  correo: string;
  clave: string;

  nombreCtrl;
  apellidoCtrl;
  DNICtrl;
  CUILCtrl;
  perfilCtrl;
  correoCtrl;
  claveCtrl;

  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;
  datosEscaneados: any;
  datos: any;

  constructor(
    private camera: Camera,
    private scanner: BarcodeScanner,
    public toastController: ToastController,
    private alertCtrl: AlertController
    ) {
    this.formDueSup = new FormGroup({
      nombreCtrl: new FormControl('', Validators.required),
      apellidoCtrl: new FormControl('', Validators.required),
      DNICtrl: new FormControl('', Validators.required),
      CUILCtrl: new FormControl('', Validators.required),
      perfilCtrl: new FormControl('', Validators.required),
      correoCtrl: new FormControl('', Validators.required),
      claveCtrl: new FormControl('', Validators.required),


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

  agregarDueSup() {
    let storageRef = firebase.storage().ref();
    let errores: number = 0;
    let contador: number = 0;

    this.captureDataUrl.forEach(foto => {
      let filename: string = this.correo + "_" + contador;
      const imageRef = storageRef.child(`dueSup/${filename}.jpg`);

      let datos: any = { 'nombre': this.nombre, 
                         'apellido': this.apellido, 
                         'DNI': this.DNI, 
                         'CUIL': this.CUIL , 
                         'perfil': this.perfil };
      let datosUsuario: any = {
                         'correo': this.correo,
                         'clave': this.clave,
                         'perfil': this.perfil

      }
      console.log(datos);

      this.guardardatosDeDueSup(datos);
      this.guardardatosUsuarios(datosUsuario);

      imageRef.putString(foto, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      })
        .catch(() => {
          errores++;
        });
    });

    if (errores == 0)
      this.subidaExitosa("El alta se realizó de manera exitosa.");
    else
      this.subidaErronea("Error al realizar el alta.");
  }

  guardardatosDeDueSup(datos) {
    let storageRef = firebase.database().ref('duesup/');
    let imageData = storageRef.push();
    imageData.set(datos);
  }
  guardardatosUsuarios(datos) {
    let storageRef = firebase.database().ref('usuarios/');
    let imageData = storageRef.push();
    imageData.set(datos);
  }

  async subidaExitosa(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'success',
      showCloseButton: false,
      position: 'top',
      closeButtonText: 'Done',
      duration: 2000
    });

    toast.present();
    // clear the previous photo data in the variable
    this.captureDataUrl.length = 0;

    this.clearInputs();
  }

  async subidaErronea(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'danger',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });

    toast.present();
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
    
    // this.guardardatosDeDueSup(datos);

    this.formDueSup.get('nombreCtrl').setValue(nombre);
    this.formDueSup.get('apellidoCtrl').setValue(apellido);
    this.formDueSup.get('DNICtrl').setValue(dni);
  }

  clearInputs() {
      this.formDueSup.get('nombreCtrl').setValue("");
      this.formDueSup.get('apellidoCtrl').setValue("");
      this.formDueSup.get('DNICtrl').setValue("");
      this.formDueSup.get('CUILCtrl').setValue("");
      
      this.formDueSup.get('correoCtrl').setValue("");
      this.formDueSup.get('claveCtrl').setValue("");
      this.formDueSup.get('PerfilCtrl').setValue("");



  }

  // radioResp(questionID,answer){

  //   if


  // }

//   radioGroupChange(event) {
// console.log(“radioGroupChange”,event.detail);
// this.selectedRadioGroup = event.detail;
// }

}
