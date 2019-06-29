import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from "@ionic/angular";
import { AudioService } from "../services/audio.service";
import { FirebaseService } from "../services/firebase.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego-comida',
  templateUrl: './juego-comida.page.html',
  styleUrls: ['./juego-comida.page.scss'],
})
export class JuegoComidaPage implements OnInit {
  letra: string = '';
  nombres: any = ['COCHE', 'PERRO', 'CABEZA', 'MILANESA', 'PARTIDO', 'CASCABEL', 'FACTURA', 'RELOJ', 'BUFANDA', 'TIJERA', 'BOTELLA'];
  nombreSecreto: any = this.palabraAleatoria(0, (this.nombres.length - 1));
  palabra: any = '';
  muestraHuecos: any = this.muestraHuecosPalabra();
  mensaje: string = '';
  letras_utilizadas: string = '';
  nombresecretomostrar: string = '';
  deshabilitarInputs: boolean = false;
  vidas: number = 5;
  pedidos: any[] = [];
  puedeJugar: boolean = false;
  mensajeNoPuedeJugar: string = '';

  // Creamos un array para guardar las letras que se van seleccionando.
  controlLetras = new Array;

  constructor(public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public audioService: AudioService,
    public baseService: FirebaseService,
    public router: Router,) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.verificarPuedeJugar();
  }

  public compruebaLetra() {
    // Formateamos a mayúsculas para mejorar la legibilidad.
    let letraMayusculas = this.letra.toUpperCase();

    // Si se ha seleccionado una letra...		
    if (letraMayusculas) {
      if (this.controlLetras.indexOf(letraMayusculas) == -1) {
        // Recorremos las letras de la palabra (array), para detectar si la letra se encuentra en ella.
        if (this.nombreSecreto.indexOf(letraMayusculas) != -1) {

          let nombreSecretoModificado = this.nombreSecreto;
          let posicion = new Array;
          let posicionTotal = 0;

          let contador = 1;

          while (nombreSecretoModificado.indexOf(letraMayusculas) != -1) {

            posicion[contador] = nombreSecretoModificado.indexOf(letraMayusculas);
            nombreSecretoModificado = nombreSecretoModificado.substring(nombreSecretoModificado.indexOf(letraMayusculas) + letraMayusculas.length, nombreSecretoModificado.length);

            // Calculamos la posición total.
            if (contador > 1) {
              posicionTotal = posicionTotal + posicion[contador] + 1;
            }
            else {
              posicionTotal = posicionTotal + posicion[contador];
            }

            // Preparamos la palabra para que sea mostrara en modal de solución directa.
            this.palabra[posicionTotal] = letraMayusculas;

            // Acierta
            if (this.controlLetras.indexOf(letraMayusculas) == -1) {
              this.muestroToastAciertaLetra(letraMayusculas);
            }

            contador++;

            // Si ya no quedan huecos, mostramos el mensaje para el ganador.
            if (this.palabra.indexOf('_') == -1) {

              // Damos el juego por finalizado, el jugador gana.
              this.finDelJuego('gana')
            }
          }
        }
        else {
          // Restamos una vida.
          this.nuevoFallo();

          // Comprobamos si nos queda alguna vida.
          if (this.vidas > 0) {
            // Mostramos un mensaje indicando el fallo.	
            this.muestroToastNoAciertaLetra(letraMayusculas);
          }
          else {
            // Damos el juego por finalizado, el jugador pierde.
            this.finDelJuego('pierde')
          }
        }

        // Array de letras utilizadas para mostrar al jugador.
        if (this.letras_utilizadas == '') {
          this.letras_utilizadas += letraMayusculas;
        }
        else {
          this.letras_utilizadas += ' - ' + letraMayusculas;
        }

        // Añadimos al array de letras la nueva letra seleccionada.
        this.controlLetras.push(letraMayusculas);
      }
      else {
        // En caso de que la letra ya hubiera sido seleccionada, mostramos un mensaje.
        this.muestraLetraRepetida(letraMayusculas);
      }
    }
  }

  async muestroToastAciertaLetra(letra) {
    // Hacemos uso de Toast Controller para lanzar mensajes flash.
    let toast = await this.toastCtrl.create({
      message: 'Genial, la letra ' + letra + ' está en la palabra secreta.',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  async muestroToastNoAciertaLetra(letra) {
    // Hacemos uso de Toast Controller para lanzar mensajes flash.
    let toast = await this.toastCtrl.create({
      message: 'Fallo, la letra ' + letra + ' no está en la palabra secreta. Recuerda que te quedan ' + this.vidas + ' vidas.',
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  async muestraLetraRepetida(letra) {
    // Hacemos uso de Toast Controller para lanzar mensajes flash.
    let toast = await this.toastCtrl.create({
      message: 'La letra ' + letra + ' fue seleccionada anteriormente. Por favor, seleccione una letra diferente.',
      duration: 2000,
      color: 'tertiary',
      position: 'bottom'
    });
    await toast.present();
  }

  muestraHuecosPalabra() {
    let totalHuecos = this.nombreSecreto.length;

    // Declaramos la variable huecos como nuevo array.		
    let huecos = new Array;
    for (let i = 0; i < totalHuecos; i++) {
      //Asignamos tantos huecos como letras tenga la palabra.
      huecos.push('_');
    }

    // Para empezar formamos la variable palabra tan solo con los huecos, ya que en este momento aún no se ha seleccionado ninguna letra.	
    this.palabra = huecos;
    return this.palabra;
  }

  // Método que genera una palabra aleatoria comprendida en el array nombres.	
  palabraAleatoria(primer, ultimo) {
    let numberOfName = Math.round(Math.random() * (ultimo - primer) + (primer));
    return this.nombres[numberOfName];
  }

  nuevoFallo() {
    this.vidas = this.vidas - 1;
    return this.vidas;
  }

  confirmarResolver() {
    this.showPrompt();
  }

  async showPrompt() {
    const prompt = await this.alertCtrl.create({
      header: 'Solución directa',
      message: "¿Está seguro de resolver la palabra secreta directamente?",
      inputs: [
        {
          name: 'palabraSolucion',
          id: 'palabraSolucion',
          placeholder: this.palabra
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            // Se cierra ventana.
          }
        },
        {
          text: 'Resolver',
          handler: data => {
            // Llamamos a método que compara la palabra secreta con la insertada mediante teclado.
            var solucion = ((document.getElementById("palabraSolucion") as HTMLInputElement).value);
            this.resolver(solucion);
          }
        }]
    });
    await prompt.present();
  }

  async showConfirm(accion) {

    // Resolver
    if (accion == 'resolver') {
      const confirm = await this.alertCtrl.create({
        header: 'Solución directa',
        message: '¿Está seguro de resolver la palabra secreta directamente?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              //
            }
          },
          {
            text: 'Confirmar',
            handler: () => {
              //
            }
          }]
      });
      await confirm.present();
    }

  }

  resolver(solucion) {
    // Comprobamos la solución directa.

    if (this.nombreSecreto == solucion.toUpperCase()) {
      var totalOcultas = 0;
      // Recorremos el array para detectar huecos sin transformar a letras.
      for (var i = 0; i < this.palabra.length; i++) {
        if (this.palabra[i] == '_') {
          totalOcultas = totalOcultas + 1;
        }
      }
      this.finDelJuego('gana');
    } else {
      this.finDelJuego('pierde');
    }
  }

  finDelJuego(valor) {
    this.deshabilitarInputs = true;
    // Perdedor
    if (valor == 'pierde') {
      this.audioService.play('perdedor');
      // Mostramos el mensaje como que el juego ha terminado
      this.mostrarAlertPierde();
    }

    // Ganador
    if (valor == 'gana') {
      this.audioService.play('ganador');
      this.mostrarAlertGana();
    }
  }

  async mostrarAlertGana() {
    const alert = await this.alertCtrl.create({
      header: 'Juego comida',
      subHeader: 'Gansate!',
      message: 'Ganaste una comida gratis!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.anotarDescuento(true);
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarAlertPierde() {
    const alert = await this.alertCtrl.create({
      header: 'Perdiste!',
      subHeader: 'Perdiste!. La palabra secreta es ' + this.nombreSecreto,
      message: 'La próxima vez será',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.anotarDescuento(false);
          }
        }
      ]
    });
    await alert.present();
  }

  anotarDescuento(gana: boolean) {
    let usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));
    sessionStorage.setItem('yaJugo', 'si');
    if (gana) {
      let pedido = this.pedidos.find(ped => ped.cliente == usuarioLogueado.correo && (ped.estado != 'finalizado' || ped.estado != 'creado'))
      let key = pedido.key;
      delete pedido['key'];
      pedido.juegoComida = true;
      this.baseService.updateItem('pedidos', key, pedido);
    }
    this.router.navigateByUrl('/home');
  }

  verificarPuedeJugar() {
    let usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));
    this.baseService.getItems('pedidos').then(pedidos => {
      this.pedidos = pedidos;
      this.puedeJugar = this.pedidos.filter(ped => ped.cliente == usuarioLogueado.correo && ped.estado != 'finalizado' && ped.estado != 'creado').length > 0;

      if (!this.puedeJugar)
        this.mensajeNoPuedeJugar = 'Usted no tiene ningún pedido para poder jugar';
      else if (sessionStorage.getItem('yaJugo')){
        this.puedeJugar = sessionStorage.getItem('yaJugo') != 'si';
        this.mensajeNoPuedeJugar = 'Usted ya ha jugado';
      }
    });
  }
}
