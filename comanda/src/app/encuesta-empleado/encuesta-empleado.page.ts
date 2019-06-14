import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { Router } from '@angular/router';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';

import * as firebase from "firebase";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-encuesta-empleado',
  templateUrl: './encuesta-empleado.page.html',
  styleUrls: ['./encuesta-empleado.page.scss'],
})
export class EncuestaEmpleadoPage implements OnInit {

  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;
  datosEscaneados: any;
  datos: any;

  ordengeneral: number = 10;
  destacado: {
    puestoTrabajo: boolean,
    comunicacion: boolean, 
    companerismo: boolean, 
    instalaciones: boolean, 
    atencion: boolean,
    horarios: boolean
  } = {
      puestoTrabajo: false, 
      comunicacion: false, 
      companerismo: false, 
      instalaciones: false, 
      atencion: false,
      horarios: false
    };
  recomienda: string = "si";
  limpieza: string = "impoluto";
  comentarios: string = "";
  ingreso: number = 0;

  constructor(
    private dbService: FirebaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private camera: Camera
  ) { 

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

  



  enviar() {

    
    let usuario = JSON.parse(sessionStorage.getItem("usuario")).correo;
  
    // SUBIDA FOTO
    
    let storageRef = firebase.storage().ref();
    let errores: number = 0;
    let contador: number = 0;

    this.captureDataUrl.forEach(foto => {

      
      let filename: string = usuario + "_" + Math.random() ;
      const imageRef = storageRef.child(`encuestasEmp/${filename}.jpg`);

      // let datos: any = { 'nromesa': this.nromesa, 'cantcomen': this.cantcomen, 'tmesa': this.tmesa, 'estado': 'libre'};
      // this.enviar(datos);

      imageRef.putString(foto, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      })
        .catch(() => {
          errores++;
        });
    });
    this.captureDataUrl = new Array<string>();

    // ENCUESTA Y REDIRECCION


    // ESTOY ENTRANDO 
    if (this.ingreso == 0 ) {
      this.dbService.addItem("encuestasEmpleados", {
        "ordengeneral": this.ordengeneral,
        "destacado": this.destacado,
        "recomienda": this.recomienda,
        "limpieza": this.limpieza,
        "comentarios": this.comentarios,
        "usuario": usuario,
        "fecha": new Date().toLocaleString(),
        "movimiento": "ENTRADA"
      });
  

      this.router.navigateByUrl('/home');
      this.ingreso = this.ingreso + 1;
      this.comentarios = "";

    } else {
      this.dbService.addItem("encuestasEmpleados", {
        "ordengeneral": this.ordengeneral,
        "destacado": this.destacado,
        "recomienda": this.recomienda,
        "limpieza": this.limpieza,
        "comentarios": this.comentarios,
        "usuario": usuario,
        "fecha": new Date().toLocaleString(),
        "movimiento": "SALIDA"
      });
  
      this.router.navigateByUrl('/');
      this.ingreso = 0;
    }
    
    
    this.limpieza = null;
    this.ordengeneral = null;
    this.destacado.puestoTrabajo = null;
    
    this.destacado.comunicacion = null;
    this.destacado.companerismo = null;
    this.destacado.horarios = null;
  
    this.recomienda = null;
    this.comentarios = null;
    
  }

}

