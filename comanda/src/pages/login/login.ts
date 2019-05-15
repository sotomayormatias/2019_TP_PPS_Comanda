import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { HomePage } from "../home/home";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  cuenta: { usuario: string, password: string } = {
    usuario: '',
    password: ''
  };
  usuarios: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public baseProvider: FirebaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin() {
    this.baseProvider.getItems("usuarios").then(users => {
      this.usuarios = users;

      let usuarioLogueado = this.usuarios.find(elem => (elem.correo == this.cuenta.usuario && elem.clave == this.cuenta.password));

      if (usuarioLogueado !== undefined) {
        sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
        this.navCtrl.setRoot(HomePage);
      } else {
        this.toastCtrl.create({
          message: "Usuario o password incorrecto.",
          duration: 3000,
          position: 'top'
        }).present();
      }
    });
  }
}
