import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  cuenta: { usuario: string, password: string } = {
    usuario: '',
    password: ''
  };
  usuarios: any[];

  constructor(private router: Router, 
    private toastCtrl: ToastController,
    private baseService: FirebaseService) { }

  ngOnInit() {
  }

  doLogin() {
    this.baseService.getItems("usuarios").then(users => {
      this.usuarios = users;

      let usuarioLogueado = this.usuarios.find(elem => (elem.correo == this.cuenta.usuario && elem.clave == this.cuenta.password));

      if (usuarioLogueado !== undefined) {
        sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
        this.router.navigate(['/login']);
      } else {
        this.presentToast();
      }
    });
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Usuario o contraseña incorrectos.',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  cargarUsuario(usuario: string) {
    switch (usuario) {
      case "admin":
        this.cuenta.usuario = "admin@gmail.com";
        this.cuenta.password = "1111";
        break;
      case "cocinero":
        this.cuenta.usuario = "cocinero@gmail.com";
        this.cuenta.password = "2222";
        break;
      case "supervisor":
        this.cuenta.usuario = "supervisor@gmail.com";
        this.cuenta.password = "3333";
        break;
      default:
        this.cuenta.usuario = "";
        this.cuenta.password = "";
        break;
    }
  }

}
