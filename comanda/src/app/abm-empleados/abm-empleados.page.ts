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
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  cuil: string = '';
  templeado: string = '';
  captureDataUrl: Array<string>;
  hayFotos: boolean = false;
  cantidadFotos: number = 0;
  datosEscaneados: any;
  datos: any;
  correo: string = '';
  clave: string = '';

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
    
    if (this.nombre == '') {
      this.mostrarFaltanDatos('El nombre es obligatorio');
      return true;
    }
    if (this.apellido == '') {
      this.mostrarFaltanDatos('El apellido es obligatorio');
      return true;
    }
    if (this.dni == '') {
      this.mostrarFaltanDatos('El DNI es obligatorio');
      return true;
    }
    if (this.cuil == '') {
      this.mostrarFaltanDatos('El CUIL es obligatorio');
      return true;
    }
    if (this.correo == '') {
      this.mostrarFaltanDatos('El correo es obligatorio');
      return true;
    }
    if(this.correo != '' && !this.validarCorreo()){
      this.mostrarFaltanDatos('El correo es inválido');
      return true;
    }
    if (this.clave == '') {
      this.mostrarFaltanDatos('La clave es obligatoria');
      return true;
    }
    if (this.templeado == '') {
      this.mostrarFaltanDatos('Debe seleccionar un tipo');
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
      let filename: string = this.nombre + "_" + contador;
      const imageRef = storageRef.child(`empleados/${filename}.jpg`);

      let datos: any = { 'nombre': this.nombre, 'apellido': this.apellido, 'dni': this.dni, 'cuil': this.cuil, 'templeado': this.templeado };
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
      this.formEmpleado.get('correoCtrl').setValue("");
      this.formEmpleado.get('claveCtrl').setValue("");
      this.formEmpleado.get('templeadoCtrl').setValue("");
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
  
  validarCorreo(): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.correo).toLowerCase());
  }
}


