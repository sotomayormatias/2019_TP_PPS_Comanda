import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { AlertController, ToastController } from '@ionic/angular';
import * as firebase from "firebase";

@Component({
  selector: 'app-abm-producto',
  templateUrl: './abm-producto.page.html',
  styleUrls: ['./abm-producto.page.scss'],
})
export class AbmProductoPage implements OnInit {
  formProducto: FormGroup;
  nombre: string = '';
  descripcion: string = '';
  tiempo: string = '';
  precio: string = '';
  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;
  quienPuedever: string = '';

  constructor(
    private camera: Camera,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
    ) {
    this.formProducto = new FormGroup({
      nombreCtrl: new FormControl('', Validators.required),
      descCtrl: new FormControl('', Validators.required),
      tiempoCtrl: new FormControl('', Validators.required),
      precioCtrl: new FormControl('', Validators.required),
      quienPuedeverCtrl: new FormControl('', Validators.required),
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
    if (this.nombre == '') {
      this.mostrarFaltanDatos('El nombre es obligatorio');
      return true;
    }
    if (this.descripcion == '') {
      this.mostrarFaltanDatos('La descripción es obligatoria');
      return true;
    }
    if (this.tiempo == '') {
      this.mostrarFaltanDatos('El tiempo es obligatorio');
      return true;
    }
    if (this.precio == '') {
      this.mostrarFaltanDatos('El precio es obligatorio');
      return true;
    }
    if (this.quienPuedever == '') {
      this.mostrarFaltanDatos('El perfil es obligatorio');
      return true;
    }
    if (this.captureDataUrl.length == 0) {
      this.mostrarFaltanDatos('Debe subir al menos una foto');
      return true;
    }

    let storageRef = firebase.storage().ref();
    let errores: number = 0;
    let contador: number = 0;

    this.captureDataUrl.forEach(foto => {
      let filename: string = this.nombre + "_" + contador;
      const imageRef = storageRef.child(`productos/${filename}.jpg`);

      let datos: any = { 'nombre': this.nombre, 'descripcion': this.descripcion, 'tiempo': this.tiempo, 'precio': this.precio, 'quienPuedever': this.quienPuedever, 'foto': foto  };
      this.guardardatosDeProducto(datos);

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

  clearInputs() {
    this.formProducto.get('nombreCtrl').setValue("");
    this.formProducto.get('descCtrl').setValue("");
    this.formProducto.get('tiempoCtrl').setValue("");
    this.formProducto.get('precioCtrl').setValue("");
    this.formProducto.get('quienPuedeverCtrl').setValue("");
}

  async mostrarFaltanDatos(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: 'danger',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
  }
}
