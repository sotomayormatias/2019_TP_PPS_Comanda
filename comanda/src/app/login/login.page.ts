import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

// import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, AlertController,  ActionSheetController   } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';


import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  [x: string]: any;
  cuenta: { usuario: string, password: string } = {
    usuario: '',
    password: ''
  };
  usuarios: any[];
  email = '';
  password = '';
  routerLink = '';

  spinner: boolean ;

  splash = true;

  constructor(
    // private router: Router,
              // private toastCtrl: ToastController,
              // private baseService: FirebaseService
              public loadingController: LoadingController,
              private baseService: FirebaseService,
              public alertController: AlertController,
              // private auth: AuthService,
              private router: Router,
              public toastController: ToastController,
              public actionSheetController: ActionSheetController
              ) { }

  ngOnInit() {
  }


  ionViewDidEnter() {
    setTimeout(() => this.splash = false, 7000);
  }

  login() {
    this.baseService.getItems("usuarios").then(users => {
      this.usuarios = users;

      let usuarioLogueado = this.usuarios.find(elem => (elem.correo == this.cuenta.usuario && elem.clave == this.cuenta.password));

      if (usuarioLogueado !== undefined) {
        sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
            this.creoToast(true);
            this.router.navigateByUrl('/home');
      } else {
        // this.presentToast();
        this.creoToast(false);
      }
    });
  }

  // async alertaMensaje(estado: boolean) {

  //   if (estado === true) {
  //     const alert = await this.alertController.create({
  //       header: 'Bienvenido.',
  //       subHeader: '',
  //       message: 'Autenticación exitosa.',
  //       buttons: ['OK']
  //     });

  //     await alert.present();


  //   } else {
  //     const alert = await this.alertController.create({
  //       header: 'Error',
  //       subHeader: '',
  //       message: 'Usuario/Contraseña incorrectos.',
  //       buttons: ['OK']
  //     });

  //     await alert.present();

  //   }
  // }

  async creoToast(rta: boolean) {

    if (rta === true) {
      const toast = await this.toastController.create({
        message: 'Autenticación exitosa.',
        color: 'success',
        showCloseButton: false,
        position: 'top',
        closeButtonText: 'Done',
        duration: 2000
      });

      toast.present();


    } else {
      const toast = await this.toastController.create({
        message: 'Usuario/contraseña incorrectos.',
        color: 'danger',
        showCloseButton: false,
        position: 'bottom',
        closeButtonText: 'Done',
        duration: 2000
      });

      toast.present();

    }


  }


  async creoSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ingresar como ...',
      cssClass: 'actSheet',
      buttons: [{
        text: 'admin',
        icon: 'finger-print',
        handler: () => {

          this.cuenta.usuario = 'admin@gmail.com';
          this.cuenta.password = '1111';

        }
      }, {
        text: 'cocinero',
        icon: 'pizza',
        handler: () => {
          this.cuenta.usuario = 'cocinero@gmail.com';
          this.cuenta.password = '2222';
        }
      }, {
        text: 'supervisor',
        icon: 'hand',
        handler: () => {
          this.cuenta.usuario = 'supervisor@gmail.com';
          this.cuenta.password = '3333';
        }
      } , {
        text: 'Cancelar',
        icon: 'close',
        cssClass: 'btnCancel',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }


  // async creoSheet() {
  //   const actionSheet = await this.actionSheetController.create({{
  //   switch (usuario) {
  //     case 'admin':
  //       this.cuenta.usuario = 'admin@gmail.com';
  //       this.cuenta.password = '1111';
  //       break;
  //     case 'cocinero':
  //       this.cuenta.usuario = 'cocinero@gmail.com';
  //       this.cuenta.password = '2222';
  //       break;
  //     case 'supervisor':
  //       this.cuenta.usuario = 'supervisor@gmail.com';
  //       this.cuenta.password = '3333';
  //       break;
  //     default:
  //       this.cuenta.usuario = '';
  //       this.cuenta.password = '';
  //       break;
  //   }
  // }

}
