import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';
import * as firebase from "firebase";

@Component({
  selector: 'app-abm-producto',
  templateUrl: './abm-producto.page.html',
  styleUrls: ['./abm-producto.page.scss'],
})
export class AbmProductoPage implements OnInit {
  formProducto: FormGroup;
  nombre: string;
  descripcion: string;
  tiempo: number;
  precio: number;
  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;

  constructor(
    private camera: Camera,
    private alertCtrl: AlertController
    ) {
    this.formProducto = new FormGroup({
      nombreCtrl: new FormControl('', Validators.required),
      descCtrl: new FormControl('', Validators.required),
      tiempoCtrl: new FormControl('', Validators.required),
      precioCtrl: new FormControl('', Validators.required)
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

  agregarProducto() {
    // let usuario = JSON.parse(sessionStorage.getItem('usuario'));
    let storageRef = firebase.storage().ref();
    let errores: number = 0;
    let contador: number = 0;

    this.captureDataUrl.forEach(foto => {
      let filename: string = this.nombre + "_" + contador;
      const imageRef = storageRef.child(`productos/${filename}.jpg`);

      let datos: any = { 'nombre': this.nombre, 'descripcion': this.descripcion, 'tiempo': this.tiempo, 'precio': this.precio };
      this.guardardatosDeProducto(datos);

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
    let storageRef = firebase.database().ref('productos/');
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
