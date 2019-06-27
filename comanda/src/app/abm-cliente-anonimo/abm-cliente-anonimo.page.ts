import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { AlertController, ToastController, Events } from '@ionic/angular';
import * as firebase from "firebase";
import { FirebaseService } from '../services/firebase.service';
import { Router } from "@angular/router";

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
  datosUsuario: any;
  nombreAnonimo: any;
  usuariosAnonimos: any[] = [];
  yaExisteUsuario: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private baseService: FirebaseService,
    public events: Events,
    private router: Router,
    private camera: Camera,
    public toastCtrl: ToastController
  ) {
    this.formClienteAnonimo = new FormGroup({
      nombreAnonimo: new FormControl('', Validators.required)
    });
    this.captureDataUrl = new Array<string>();
    this.traerUsuariosAnonimos();
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
    // valido el campo nombre
    if (this.formClienteAnonimo.get('nombreAnonimo').value == "") {
      this.mostrarFaltanDatos('El nombre es obligatorio.');
      return true;
    }
    //valido que exista al menos una foto
    if (this.captureDataUrl.length == 0) {
      this.mostrarFaltanDatos('Debe cargar una foto.');
      return true;
    }
    
    this.usuariosAnonimos.forEach(cli => {
      if (cli.correo == this.formClienteAnonimo.get('nombreAnonimo').value) {
        this.yaExisteUsuario = true;
      }
    });

    if (this.yaExisteUsuario) {
      this.AlertYaExisteUsuario();
      this.yaExisteUsuario = false;
    } else {

      let storageRef = firebase.storage().ref();

      this.datosUsuario = {
        'correo': this.formClienteAnonimo.get('nombreAnonimo').value,
        'clave': '1234',
        'perfil': 'clienteAnonimo'
      };
      this.baseService.addItem('usuarios', this.datosUsuario);

      this.captureDataUrl.forEach(foto => {
        let filename: string = (this.formClienteAnonimo.get('nombreAnonimo').value).replace(' ', '_');
        const imageRef = storageRef.child(`clientes/${filename}.jpg`);

        imageRef.putString(foto, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        });
      });

      this.captureDataUrl.length = 0;
      this.events.publish('usuarioLogueado', 'clienteAnonimo');
      this.creoToast();
      sessionStorage.setItem('usuario', JSON.stringify(this.datosUsuario));
      this.router.navigateByUrl('/home');
    }
  }

  async creoToast() {
    const toast = await this.toastCtrl.create({
      message: 'Autenticación exitosa.',
      color: 'success',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
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

  traerUsuariosAnonimos() {
    this.baseService.getItems('usuarios').then(usuarios => {
      this.usuariosAnonimos = usuarios.filter(usu => usu.perfil == 'clienteAnonimo');
    });
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

  async AlertYaExisteUsuario() {
    const alert = await this.alertCtrl.create({
      header: 'Usuario existente',
      message: 'Ya existe un usuario con el nombre ' + this.formClienteAnonimo.get('nombreAnonimo').value,
      buttons: ['OK']
    });
    await alert.present();
  }
}
