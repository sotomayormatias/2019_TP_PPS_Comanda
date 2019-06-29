import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AudioService } from "../app/services/audio.service";

import { Events } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private fcm: FCM,
    public events: Events,
    public audioService: AudioService
  ) {
    this.initializeApp();

   

    this.events.subscribe('usuarioLogueado', data => {
      console.log('event received');
      console.log('perfil recibidos:', data);
    
      // SUSCRIPCIONs
      console.log('perfil recibidos:', data);
      // ROUTING DEL MENU
      switch (data) {

        // console.log('Entro en Switch', data);

        // SUPERVISOR - DUEÑO
        case 'supervisor':
          // (A) ALTA DUEÑO
          // (B) ALTA EMPLEADO
          // (C) ALTA PRODUCTO
          // (E) ALTA MESAS
          // (J) ENCUESTA EMPLEADO
          // (I - J - K) GRAFICOS DE ENCUESTAS
          // (N) HACER RESERVAS AGENDADAS (opcional - supervisor)
          // (Q) NPUSH - HACER RESERVA / DELIVERY (VA PARA EL MOZO / DELIVERY)
          // this.fcm.subscribeToTopic('notificacionReservas');
          this.appPages = [
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },
            // (A) ALTA DUEÑO
            {
              title: 'Alta Dueño/Supervisor',
              url: '/abm-duesup',
              icon: 'key'
            },
            // (B) ALTA EMPLEADO
            {
              title: 'Alta Empleados',
              url: '/abm-empleados',
              icon: 'person'
            },
            // (C) ALTA PRODUCTO
            {
              title: 'Alta Productos',
              url: '/abm-producto',
              icon: 'beer'
            },
            // (E) ALTA MESAS
            {
              title: 'Alta Mesas',
              url: '/abm-mesa',
              icon: 'help-buoy'
            },
            // (I - J - K) GRAFICOS DE ENCUESTAS
            {
              title: 'Estadística Satisfacción',
              url: '/est-satisfaccion',
              icon: 'pie'
            },
            // (J) ESTADISTICA EMPLEADO
            {
              title: 'Estadística Empleado',
              url: '/est-empleado',
              icon: 'person-add'
            },
            //  GRAFICOS DE AGREGADO
            {
              title: 'Estadística Supervisor',
              url: '/est-supervisor',
              icon: 'information-circle-outline'
            },
            // (K) GRAFICOS DE ENCUESTAS
            {
              title: 'Encuesta Supervisor',
              url: '/encuesta-sup',
              icon: 'alert'
            },
            // (8) (9) - CONFIRMA CLIENTE Y ENVIA MAIL
            {
              title: 'Confirmar Clientes',
              url: '/list-confirmar-cliente-alta',
              icon: 'checkbox-outline'
            },
            // CONFIRMA RESERVA
            {
              title: 'Confirmar Reservas',
              url: '/list-reserva-conf',
              icon: 'calendar'
            },
            // (F) QR Ingreso
            {
              title: 'QR Ingreso',
              url: '/qr-ingreso-local',
              icon: 'barcode'
            },
            // (13) CONFIRMAR DELIVERY
            {
              title: 'Confirmar Delivery',
              url: '/list-confirmar-delivery',
              icon: 'checkbox-outline'
            },
            // (N) HACER RESERVAS AGENDADAS (opcional - supervisor)
            // {
            // title: 'Hacer Reservas Agendadas',
            // url: '/reservas',
            // icon: 'calendar'
            // },

            {
              title: 'Cerrar Sesion',
              url: '/',
              icon: 'log-out'
            }

          ];
          break;

        case 'dueño':
          console.log(' auto - estoy en : ', data);
          console.log(' man - estoy en : ', "dueño");
          // (A) ALTA DUEÑO
          // (B) ALTA EMPLEADO
          // (C) ALTA PRODUCTO
          // (E) ALTA MESAS
          // (J) ENCUESTA EMPLEADO
          // (I - J - K) GRAFICOS DE ENCUESTAS
          // (N) HACER RESERVAS AGENDADAS (opcional - supervisor)
          // (Q) NPUSH - HACER RESERVA / DELIVERY (VA PARA EL MOZO / DELIVERY)

          this.appPages = [
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },
            // (A) ALTA DUEÑO
            {
              title: 'Alta Dueño/Supervisor',
              url: '/abm-duesup',
              icon: 'key'
            },
            // (B) ALTA EMPLEADO
            {
              title: 'Alta Empleados',
              url: '/abm-empleados',
              icon: 'person'
            },
            // (C) ALTA PRODUCTO
            {
              title: 'Alta Productos',
              url: '/abm-producto',
              icon: 'beer'
            },
            // (E) ALTA MESAS
            {
              title: 'Alta Mesas',
              url: '/abm-mesa',
              icon: 'help-buoy'
            },
            // (I - J - K) GRAFICOS DE ENCUESTAS
            {
              title: 'Estadística Satisfacción',
              url: '/est-satisfaccion',
              icon: 'pie'
            },
            // (K) GRAFICOS DE ENCUESTAS
            {
              title: 'Encuesta Supervisor',
              url: '/encuesta-sup',
              icon: 'alert'
            },
            // (J) ESTADISTICA EMPLEADO
            {
              title: 'Estadística Empleado',
              url: '/est-empleado',
              icon: 'person-add'
            },
            // I

            {
              title: 'Estadística Supervisor',
              url: '/est-supervisor',
              icon: 'information-circle-outline'
            },



            // (8) (9) - CONFIRMA CLIENTE Y ENVIA MAIL
            {
              title: 'Confirmar Clientes',
              url: '/list-confirmar-cliente-alta',
              icon: 'checkbox-outline'
            },
             // CONFIRMA RESERVA
             {
              title: 'Confirmar Reservas',
              url: '/list-reserva-conf',
              icon: 'calendar'
            },
            // (F) QR Ingreso
            {
              title: 'QR Ingreso',
              url: '/qr-ingreso-local',
              icon: 'barcode'
            },
            // (13) CONFIRMAR DELIVERY
            {
              title: 'Confirmar Delivery',
              url: '/list-confirmar-delivery',
              icon: 'checkbox-outline'
            },
            // (N) HACER RESERVAS AGENDADAS (opcional - supervisor)
            // {
            // title: 'Hacer Reservas Agendadas',
            // url: '/',
            // icon: 'calendar'
            // },
            // (J) ENCUESTA EMPLEADO
            //   {
            //   title: 'Encuesta Empleado',
            //   url: '/encuesta-empleado',
            //   icon: 'clipboard'
            // },
            {
              title: 'Cerrar Sesion',
              url: '/',
              icon: 'log-out'
            }

          ];
          break;




        // CLIENTE
        case "cliente":
          console.log(' auto - estoy en : ', data);
          console.log(' man - estoy en : ', "cliente");
          // (D) ALTA CLIENTE
          // (F) QR INGRESO
          // (H) QR PROPINA
          // (G) QR MESA
          // (I) ENCUESTA CLIENTE
          // (N) HACER RESERVAS AGENDADAS 
          // (L) PEDIDO PLATO / BEBIDAS
          // (Q) NPUSH - HACER RESERVA / DELIVERY
          // (R) DELIV - PEDIDO GPS / DIRECCIÓN (LOGUEADO, no anonimo)
          // JUEGOS
          // (T) 10% DTO
          // (U) BEBIDA GRATIS
          // (V) POSTRE GRATIS
          // (9) LE LLEGA MAIL PARA CONFIRMAR QUE ES CLIENTE

          this.appPages = [
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },
           
            // (F) QR INGRESO
            {
              title: 'QR Ingreso',
              url: '/qr-ingreso-local',
              icon: 'list-box'
            },
            // (G) QR MESA
            {

              title: 'QR Mesa',
              url: '/qr-mesa',
              icon: 'git-pull-request'
            },

            {
              title: 'Listado de espera',
              url: '/list-confirmar-cliente-mesa',
              icon: 'log-in'
            },
            // (H) QR PROPINA
            {
              // ESTE NO VA ACA PERO LO DEJO POR AHORA
              title: 'QR Propina',
              url: '/qr-propina',
              icon: 'trash'
            },

            // (I) ENCUESTA CLIENTE
            {
              title: 'Encuesta Satisfacción',
              url: '/encuesta-cliente',
              icon: 'book'
            },

            // (N) HACER RESERVAS AGENDADAS 
            {
              title: 'Hacer reservas',
              url: '/reservas',
              icon: 'calendar'
            },
            // (L) PEDIDO PLATO / BEBIDAS
            {
              title: 'Menu platos / bebidas',
              url: '/generar-pedido',
              icon: 'restaurant'
            },
            // (R) DELIV - PEDIDO GPS / DIRECCIÓN (LOGUEADO, no anonimo)
            {
              title: 'Delivery',
              url: '/pedir-delivery',
              icon: 'pin'
            },
            // (S) CHAT
            {
              title: 'Chat',
              url: '/chat',
              icon: 'chatboxes'
            },
            // (11) CONFIRMAR ENTREGA
            {
              title: 'Confirmar entrega',
              url: '/confirmar-entrega',
              icon: 'checkmark'
            },
            // JUEGOS
            // (T) 10% DTO
            {
              title: 'Juego Descuento',
              url: '/juego-descuento',
              icon: 'rocket'
            },
            // (U) BEBIDA GRATIS
            {
              title: 'NOK - Juego Bebida',
              url: '/juego-bebida',
              icon: 'beer'
            },
            // (V) POSTRE GRATIS
            {
              title: 'Juego Comida',
              url: '/juego-comida',
              icon: 'cafe'
            },
            {
              title: 'Cerrar Sesion',
              url: '/',
              icon: 'log-out'
            }
          ];

          break;

        case "clienteAnonimo":
          console.log(' auto - estoy en : ', data);
          console.log(' man - estoy en : ', "cliente");
          // (D) ALTA CLIENTE
          // (F) QR INGRESO
          // (H) QR PROPINA
          // (G) QR MESA
          // (I) ENCUESTA CLIENTE
          // (N) HACER RESERVAS AGENDADAS 
          // (L) PEDIDO PLATO / BEBIDAS
          // (Q) NPUSH - HACER RESERVA / DELIVERY
          // (R) DELIV - PEDIDO GPS / DIRECCIÓN (LOGUEADO, no anonimo)
          // JUEGOS
          // (T) 10% DTO
          // (U) BEBIDA GRATIS
          // (V) POSTRE GRATIS
          // (9) LE LLEGA MAIL PARA CONFIRMAR QUE ES CLIENTE

          this.appPages = [
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },

            // (F) QR INGRESO
            {
              title: 'QR Ingreso',
              url: '/qr-ingreso-local',
              icon: 'list-box'
            },
            // (G) QR MESA
            {

              title: 'QR Mesa',
              url: '/qr-mesa',
              icon: 'git-pull-request'
            },

            {
              title: 'Listado de espera',
              url: '/list-confirmar-cliente-mesa',
              icon: 'log-in'
            },
            // (H) QR PROPINA
            {
              title: 'QR Propina',
              url: '/qr-propina',
              icon: 'trash'
            },

            // (I) ENCUESTA CLIENTE
            {
              title: 'Encuesta Satisfacción',
              url: '/encuesta-cliente',
              icon: 'book'
            },


            // (L) PEDIDO PLATO / BEBIDAS
            {
              title: 'Menu platos / bebidas',
              url: '/generar-pedido',
              icon: 'restaurant'
            },

            // (11) CONFIRMAR ENTREGA
            {
              title: 'Confirmar entrega',
              url: '/confirmar-entrega',
              icon: 'checkmark'
            },
            {
              title: 'Cerrar Sesion',
              url: '/',
              icon: 'log-out'
            }
          ];

          break;

        // COCINERO 
        case "cocinero":
          this.appPages = [
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },
            // (C) ALTA PRODUCTO
            {
              title: 'Alta Productos',
              url: '/abm-producto',
              icon: 'beer'
            },
            // (13) LISTADO DE PEDIDOS PENDIENTES POR SECTOR
            {
              title: 'Pedidos Pendientes',
              url: '/list-pedidos-cocina',
              icon: 'nutrition'
            },

            {
              title: 'Cerrar Sesion',
              url: '/encuesta-empleado',
              icon: 'log-out'
            }
          ];

          // (K) ENCUESTA EMPLEADO
          // (P) NPUSH - PBEB
          // + LISTADO DE PEDIDOS PENDIENTES POR SECTOR

          break;

        // BARTENDER
        case "bartender":
          this.appPages = [
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },
            // (C) ALTA PRODUCTO
            {
              title: 'Alta Productos',
              url: '/abm-producto',
              icon: 'beer'
            },
            // (13) LISTADO DE PEDIDOS PENDIENTES POR SECTOR
            {
              title: 'Pedidos Pendientes',
              url: '/list-pedidos-bartender',
              icon: 'beer'
            },

            {
              title: 'Cerrar Sesion',
              url: '/encuesta-empleado',
              icon: 'log-out'
            }
          ];

          break;

        // MOZO
        case "mozo":

          // (M) TOMAR PEDIDOS
          // (K) ENCUESTA EMPLEADO
          // (L) PEDIDO PLATO / BEBIDAS
          // (O) NPUSH - PEDIR MESA
          // (P) NPUSH - PBEB/CIERRE CUENTA
          this.appPages = [
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },

            // // (L) PEDIDO PLATO / BEBIDAS
            // {
            //   title: 'Menu platos / bebidas',
            //   url: '/generar-pedido',
            //   icon: 'restaurant'
            // },

            // (M) TOMAR PEDIDOS
            {
              title: 'Tomar pedido',
              url: '/list-confirmar-pedido',
              icon: 'paper'
            },
            // (F) QR INGRESO
            {
              title: 'Confirmar cliente mesa',
              url: '/list-confirmar-cliente-mesa',
              icon: 'log-in'
            },
            {
              title: 'Cerrar Mesa',
              url: '/confirmar-cierre-mesa',
              icon: 'walk'
            },
            // (K) ENCUESTA EMPLEADO
            // {
            //   title: 'Encuesta Empleado',
            //   url: '/',
            //   icon: 'clipboard'
            // },

            {
              title: 'Cerrar Sesion',
              url: '/encuesta-empleado',
              icon: 'log-out'
            }
          ];
          break;

        // DELIVERY
        case "delivery":
          this.appPages = [
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },
            // (13)(S) VER PEDIDOS Y RUTA
            {
              title: 'Ver pedidos',
              url: '/list-confirmar-delivery',
              icon: 'checkbox-outline'
            },
            // (S) CHAT
            {
              title: 'Chat',
              url: '/chat',
              icon: 'chatboxes'
            },

            {
              title: 'Cerrar Sesion',
              url: '/encuesta-empleado',
              icon: 'log-out'
            }
          ];
          break;
      }




    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
    
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      // ME DESUSCRIBO DE LOS TOPICOS
      // this.fcm.unsubscribeFromTopic('notificacionPedido');
      // this.fcm.unsubscribeFromTopic('notificacionMesa');
      // this.fcm.unsubscribeFromTopic('notificacionReservas');

      firebase.initializeApp(FIREBASE_CONFIG);

     

      // // PUSH A MOSOS Y SUPERVISORES - O 
      // this.fcm.subscribeToTopic('notificacionPedido');
      // // PLATOS Y BEBIDAS CIERRE DE CUENTA
      // this.fcm.subscribeToTopic('notificacionMesa');
      // // HACER RESERVAS AGENDAR DELIVERY
      // this.fcm.subscribeToTopic('notificacionReservas');
      // this.fcm.getToken().then(token => {
      //   console.log(token);
      // });
      
      // this.fcm.onTokenRefresh().subscribe(token => {
      //   console.log(token);
      // });
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('Received in background');
          this.router.navigateByUrl('/login');
        } else {
          console.log('Received in foreground');
          this.router.navigateByUrl('/login');
        }
      });
      
    });
    // firebase.initializeApp(FIREBASE_CONFIG);

    this.audioService.preload('hola', '../assets/sounds/hola.mp3');
    this.audioService.preload('clink', '../assets/sounds/clink.mp3');
    this.audioService.preload('mmm', '../assets/sounds/mmm.mp3');
    this.audioService.preload('perdedor', '../assets/sounds/perdedor.mp3');
    this.audioService.preload('ganador', '../assets/sounds/ganador.mp3');
  }

  navegoPagina(pagina) {
    this.router.navigateByUrl(pagina);
  }

  armoMenu(perfil) {

  }

}


// | ABM - DUEÑO/SUP	A
// {
//   title: 'Alta Dueño/Supervisor',
//   url: '/abm-duesup',
//   icon: 'key'
// },

// | ABM - EMPLEADO	B
// {
//   title: 'Alta Empleados',
//   url: '/abm-empleados',
//   icon: 'person'
// },

// | ABM - PRODUCTO	C
// {
//   title: 'Alta Productos',
//   url: '/abm-producto',
//   icon: 'beer'
// },

// |ABM - CLIENTE	D
// {
//   title: 'Alta de Clientes',
//   url: '/abm-cliente',
//   icon: 'basket'
// },

// | ABM - MESA	E
// {
//   title: 'Alta Mesas',
//   url: '/abm-mesa',
//   icon: 'help-buoy'
// },


// | QR INGRESO AL LOCAL	F
// {
//   title: 'QR INGRESO',
//   url: '/',
//   icon: 'list-box'
// },

// QR | MESA	G
// {
//   title: 'QR Ingreso',
//   url: '/',
//   icon: 'git-pull-request'
// },

// | QR PROPINA	H
// {
//   title: 'QR Propina',
//   url: '/',
//   icon: 'cash'
// },

// | ENCUESTA CLIENTE	I
// {
//   title: 'Encuesta Satisfacción',
//   url: '/encuesta-cliente',
//   icon: 'book'
// },

// | ENCUESTA EMPLEADO	J
// {
//   title: 'Encuesta Empleado',
//   url: '/',
//   icon: 'clipboard'
// },

// | ENCUESTA SUPERVISOR	K
// {
//   title: 'Encuesta Supervisor',
//   url: '/encuesta-sup',
//   icon: 'alert'
// },

// | PEDIR PLATO	L
// {
//   title: 'Menu platos / bebidas',
//   url: '/',
//   icon: 'restaurant'
// },

// | TOMAR PEDIDO	M
// {
//   title: 'Tomar pedido',
//   url: '/',
//   icon: 'paper'
// },

// | HACER RESERVAS	N
// {
//   title: 'Hacer Reservas Agendadas',
//   url: '/',
//   icon: 'calendar'
// },

// | DELIVERY PEDIDO	R
// {
//   title: 'Delivery',
//   url: '/encuesta-cliente',
//   icon: 'pin'
// },

// DELIVERY RUTA	S
// {
//   title: 'Ruta H.Domicilio',
//   url: '/',
//   icon: 'logo-model-s'
// },


// | JUEGO 1	T
// {
//   title: 'J.Descuento',
//   url: '/',
//   icon: 'rocket'
// },

// | JUEGO 2	U
// {
//   title: 'J.Bebida',
//   url: '/',
//   icon: 'beer'
// },

// | JUEGO 3	V
// {
//   title: 'J.Postre',
//   url: '/',
//   icon: 'cafe'
// },
