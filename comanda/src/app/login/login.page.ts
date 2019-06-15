import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

// import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, AlertController, ActionSheetController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';


import { FirebaseService } from '../services/firebase.service';
import { Events } from '@ionic/angular';

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
  tipoUsuario: string = "";
  counter: number = 10;

  spinner: boolean;

  splash = true;

  constructor(
    public loadingController: LoadingController,
    private baseService: FirebaseService,
    public alertController: AlertController,
    public events: Events,
    private router: Router,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    setTimeout(() => this.splash = false, 8000);
  }

  login() {
    this.spinner = true;
    this.baseService.getItems("usuarios").then(users => {
      setTimeout(() => this.spinner = false, 2000);
      this.usuarios = users;

      let usuarioLogueado = this.usuarios.find(elem => (elem.correo == this.cuenta.usuario && elem.clave == this.cuenta.password));

      if (usuarioLogueado !== undefined) {
        sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
        this.events.publish('usuarioLogueado', usuarioLogueado.perfil);
        this.creoToast(true);

        if ( usuarioLogueado.perfil == 'dueno' || 
             usuarioLogueado.perfil == 'supervisor' || 
             usuarioLogueado.perfil == 'cliente') {
          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/encuesta-empleado');
      

        }
    

      } else {
        setTimeout(() => this.spinner = false, 2000);
        this.creoToast(false);
      }
    });
  }

  loginAnonimo() {
    this.spinner = true;
    let usuarioLogueado = { nombre: "anonimo", perfil: "cliente" };
    setTimeout(() => this.spinner = false, 2000);
    sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
    this.events.publish('usuarioLogueado: ', 'clienteAnonimo');
    this.creoToast(true);
    this.router.navigateByUrl('/abm-cliente-anonimo');
  }

  async creoToast(rta: boolean) {
    if (rta === true) {
      const toast = await this.toastController.create({
        message: 'Autenticación exitosa.',
        color: 'success',
        showCloseButton: false,
        position: 'bottom',
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

  async creoSheetEmpleados() {
    const actionSheet = await this.actionSheetController.create({
      
      // SUPERVISOR - DUEÑO
      // CLIENTE
      // BARTENDER
      // COCINERO
      // MOZO
      // DELIVERY
     
      // SUPERVISOR
      header: 'Ingresar como ...',
      cssClass: 'actSheet',
      buttons: [{
        text: 'Supervisor',
        icon: 'finger-print',
        handler: () => {
          this.cuenta.usuario = 'supervisor@gmail.com';
          this.cuenta.password = '1111';
        }
      },

      // DUEÑO
      {
        text: 'Dueño',
        icon: 'key',
        handler: () => {
          this.cuenta.usuario = 'dueno@gmail.com';
          this.cuenta.password = '3333';
        }
      },

      // CLIENTE
      {
        text: 'cliente',
        icon: 'cafe',
        handler: () => {
          this.cuenta.usuario = 'cliente2@gmail.com';
          this.cuenta.password = '8888';
        }
      },
      
      // BARTENDER
      
      {
        text: 'Bartender',
        icon: 'beer',
        handler: () => {
          this.cuenta.usuario = 'bartender@gmail.com';
          this.cuenta.password = '5555';
        }
      },

      // COCINERO
      {
        text: 'Cocinero',
        icon: 'pizza',
        handler: () => {
          this.cuenta.usuario = 'cocinero@gmail.com';
          this.cuenta.password = '2222';
        }
      },

       // MOZO
       {
        text: 'Mozo',
        icon: 'restaurant',
        handler: () => {
          this.cuenta.usuario = 'mozo@gmail.com';
          this.cuenta.password = '6666';
        }
      },

      // DELIVERY
      {
        text: 'Delivery',
        icon: 'logo-model-s',
        handler: () => {
          this.cuenta.usuario = 'delivery@gmail.com';
          this.cuenta.password = '7777';
        }
      },
    
      {
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

  async creoSheet() {
    let profileButtons: any;

    if (this.tipoUsuario == 'cliente') {
      profileButtons = [{
        text: 'cliente', icon: 'cafe', handler: () => {
          this.cuenta.usuario = 'cliente2@gmail.com';
          this.cuenta.password = '8888';
        }
      },
      {
        text: 'Cancelar', icon: 'close', cssClass: 'btnCancel', role: 'cancel', handler: () => { }
      }];
    } else {

      profileButtons =  [{
        text: 'Supervisor',
        icon: 'finger-print',
        handler: () => {
          this.cuenta.usuario = 'supervisor@gmail.com';
          this.cuenta.password = '1111';
        }
      },

      // DUEÑO
      {
        text: 'Dueño',
        icon: 'key',
        handler: () => {
          this.cuenta.usuario = 'dueno@gmail.com';
          this.cuenta.password = '3333';
        }
      },

      // CLIENTE
      {
        text: 'Cliente',
        icon: 'cafe',
        handler: () => {
          this.cuenta.usuario = 'cliente2@gmail.com';
          this.cuenta.password = '8888';
        }
      },
      
      // BARTENDER
      
      {
        text: 'Bartender',
        icon: 'beer',
        handler: () => {
          this.cuenta.usuario = 'bartender@gmail.com';
          this.cuenta.password = '5555';
        }
      },

      // COCINERO
      {
        text: 'Cocinero',
        icon: 'pizza',
        handler: () => {
          this.cuenta.usuario = 'cocinero@gmail.com';
          this.cuenta.password = '2222';
        }
      },

       // MOZO
       {
        text: 'Mozo',
        icon: 'restaurant',
        handler: () => {
          this.cuenta.usuario = 'mozo@gmail.com';
          this.cuenta.password = '6666';
        }
      },

      // DELIVERY
      {
        text: 'Delivery',
        icon: 'logo-model-s',
        handler: () => {
          this.cuenta.usuario = 'delivery@gmail.com';
          this.cuenta.password = '7777';
        }
      },
    
      {
        text: 'Cancelar',
        icon: 'close',
        cssClass: 'btnCancel',
        role: 'cancel',
        handler: () => {
        }
      }];
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Ingresar como ...',
      cssClass: 'actSheet',
      buttons: profileButtons
    });
    await actionSheet.present();
  }

  cargarTipoUsuario(tipo: string) {
    this.tipoUsuario = tipo;
  }

  vuelvoSeleccion() {
    this.tipoUsuario = '' ;
  }
}
