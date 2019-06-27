import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';
import * as firebase from "firebase";
import { ToastController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";



@Component({
  selector: 'app-abm-mesa',
  templateUrl: './abm-mesa.page.html',
  styleUrls: ['./abm-mesa.page.scss'],
})
export class AbmMesaPage implements OnInit {
  formMesas: FormGroup;
  nromesa: string = '';
  cantcomen: string = '';
  tmesa: string = '';
  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;
  datos: any;

  constructor(
    private camera: Camera,
    private alertCtrl: AlertController,
    private scanner: BarcodeScanner,
    public toastController: ToastController
    ) {
    this.formMesas = new FormGroup({
      nromesaCtrl: new FormControl('', Validators.required),
      cantcomenCtrl: new FormControl('', Validators.required),
      tmesaCtrl: new FormControl('', Validators.required)
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

  agregarMesas() {

    if (this.nromesa == '') {
      this.mostrarFaltanDatos('El nro. de mesa es obligatorio');
      return true;
    }
    if (this.cantcomen == '') {
      this.mostrarFaltanDatos('El nro. de personas es obligatorio');
      return true;
    }
    if (this.tmesa == '') {
      this.mostrarFaltanDatos('El tipo de mesa es obligatorio');
      return true;
    }
    if (this.captureDataUrl.length == 0) {
      this.mostrarFaltanDatos('Debe subir una foto');
      return true;
    }

    let storageRef = firebase.storage().ref();
    let errores: number = 0;
    let contador: number = 0;

    this.captureDataUrl.forEach(foto => {
      let filename: string = this.tmesa + this.nromesa + "_" + contador;
      const imageRef = storageRef.child(`mesas/${filename}.jpg`);

      let datos: any = { 'nromesa': this.nromesa, 'cantcomen': this.cantcomen, 'tmesa': this.tmesa, 'estado': 'libre', 'cliente': ' '};
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
    let storageRef = firebase.database().ref('mesas/');
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
      this.formMesas.get('nromesaCtrl').setValue("");
      this.formMesas.get('cantcomenCtrl').setValue("");
      this.formMesas.get('tmesaCtrl').setValue("");
  }

  async mostrarFaltanDatos(mensaje: string) {
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
}



