import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';
import * as firebase from "firebase";

@Component({
  selector: 'app-abm-empleados',
  templateUrl: './abm-empleados.page.html',
  styleUrls: ['./abm-empleados.page.scss'],
})
export class AbmEmpleadosPage implements OnInit {

   formEmpleado: FormGroup;
  nombre: string;
  apellido: string;
  DNI: number;
  CUIL: string;
  TEMPLEADO: string;
  nombreCtrl;
  apellidoCtrl;
  DNICtrl;
  CUILCtrl;

  captureDataUrl: Array<string>;
  hayFotos: boolean = false;

  constructor(
    private camera: Camera,
    private alertCtrl: AlertController
    ) {
    this.formEmpleado = new FormGroup({
      nombreCtrl: new FormControl('', Validators.required),
      apellidoCtrl: new FormControl('', Validators.required),
      DNICtrl: new FormControl('', Validators.required),
      CUILCtrl: new FormControl('', Validators.required)
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

      let datos: any = { 'nombre': this.nombre, 'apellido': this.apellido, 'DNI': this.DNI, 'CUIL': this.CUIL };
      this.guardardatosDeEmpleado(datos);

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

  guardardatosDeEmpleado(datos) {
    let storageRef = firebase.database().ref('empleados/');
    let imageData = storageRef.push();
    imageData.set(datos);
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


}

