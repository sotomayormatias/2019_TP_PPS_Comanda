import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from './app.firebase.config';

import { Events } from '@ionic/angular';

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
    public events: Events
  ) {
    this.initializeApp();

    this.events.subscribe('usuarioLogueado', data => {
      console.log('event received');
      console.log('perfil recibidos:', data);

   // ROUTING DEL MENU
      switch (data ) {

        // console.log('Entro en Switch', data);

        // SUPERVISOR - DUEÑO
        case 'supervisor' :
            console.log(' auto - estoy en : ', data);
            console.log(' man - estoy en : ', "supervisor");
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
                    title: 'OK - Alta Dueño/Supervisor',
                    url: '/abm-duesup',
                    icon: 'key'
                  },
                  // (B) ALTA EMPLEADO
                  {
                    title: 'OK - Alta Empleados',
                    url: '/abm-empleados',
                    icon: 'person'
                  },
                  // (C) ALTA PRODUCTO
                  {
                    title: 'OK - Alta Productos',
                    url: '/abm-producto',
                    icon: 'beer'
                  },
                   // (E) ALTA MESAS
                  {
                    title: 'OK - Alta Mesas',
                    url: '/abm-mesa',
                    icon: 'help-buoy'
                  },
                  // (I - J - K) GRAFICOS DE ENCUESTAS
                  {
                    title: 'OK - Estadística Satisfacción',
                    url: '/est-satisfaccion',
                    icon: 'pie'
                  },
                
                  // (K) GRAFICOS DE ENCUESTAS
                  {
                    title: 'OK - Encuesta Supervisor',
                    url: '/encuesta-sup',
                    icon: 'alert'
                  },
                  // (8) (9) - CONFIRMA CLIENTE Y ENVIA MAIL
                  {
                    title: 'Confirmar Clientes',
                    url: '/list-confirmar-cliente-alta',
                    icon: 'checkbox-outline'
                  },
                   // (N) HACER RESERVAS AGENDADAS (opcional - supervisor)
                   {
                    title: 'NOK - Hacer Reservas Agendadas',
                    url: '/',
                    icon: 'calendar'
                  },
                   // (J) ENCUESTA EMPLEADO
                   {
                    title: 'NOK - Encuesta Empleado',
                    url: '/',
                    icon: 'clipboard'
                  },
                  {
                    title: 'Cerrar Sesion',
                    url: '/',
                    icon: 'log-out'
                  }
            
            ];
            break;
        
        case 'dueno' :
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
                    title: 'OK - Alta Dueño/Supervisor',
                    url: '/abm-duesup',
                    icon: 'key'
                  },
                  // (B) ALTA EMPLEADO
                  {
                    title: 'OK - Alta Empleados',
                    url: '/abm-empleados',
                    icon: 'person'
                  },
                  // (C) ALTA PRODUCTO
                  {
                    title: 'OK - Alta Productos',
                    url: '/abm-producto',
                    icon: 'beer'
                  },
                    // (E) ALTA MESAS
                  {
                    title: 'OK - Alta Mesas',
                    url: '/abm-mesa',
                    icon: 'help-buoy'
                  },
                  // (I - J - K) GRAFICOS DE ENCUESTAS
                  {
                    title: 'OK - Estadística Satisfacción',
                    url: '/est-satisfaccion',
                    icon: 'pie'
                  },
                
                  // (K) GRAFICOS DE ENCUESTAS
                  {
                    title: 'OK - Encuesta Supervisor',
                    url: '/encuesta-sup',
                    icon: 'alert'
                  },
                  // (8) (9) - CONFIRMA CLIENTE Y ENVIA MAIL
                  {
                    title: 'Confirmar Clientes',
                    url: '/list-confirmar-cliente-alta',
                    icon: 'checkbox-outline'
                  },
                    // (N) HACER RESERVAS AGENDADAS (opcional - supervisor)
                    {
                    title: 'NOK - Hacer Reservas Agendadas',
                    url: '/',
                    icon: 'calendar'
                  },
                    // (J) ENCUESTA EMPLEADO
                    {
                    title: 'NOK - Encuesta Empleado',
                    url: '/',
                    icon: 'clipboard'
                  },
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
            // (D) ALTA CLIENTE
            {
              title: 'OK - Alta de Clientes',
              url: '/abm-cliente',
              icon: 'basket'
            },
            // (F) QR INGRESO
            {
              title: 'NOK - QR Ingreso',
              url: '/',
              icon: 'list-box'
            },
             // (G) QR MESA
             {
              title: 'NOK - QR Mesa',
              url: '/',
              icon: 'git-pull-request'
            },
            // (H) QR PROPINA
            {
              title: 'NOK - QR Propina',
              url: '/',
              icon: 'cash'
            },
           
            // (I) ENCUESTA CLIENTE
            {
              title: 'OK - Encuesta Satisfacción',
              url: '/encuesta-cliente',
              icon: 'book'
            },

            // (N) HACER RESERVAS AGENDADAS 
            {
              title: 'NOK - Hacer reservas',
              url: '/',
              icon: 'calendar'
            },
            // (L) PEDIDO PLATO / BEBIDAS
            {
              title: 'NOK - Menu platos / bebidas',
              url: '/',
              icon: 'restaurant'
            },
            // (R) DELIV - PEDIDO GPS / DIRECCIÓN (LOGUEADO, no anonimo)
            {
              title: 'NOK - Delivery',
              url: '/',
              icon: 'pin'
            },
            // JUEGOS
            // (T) 10% DTO
            {
              title: 'NOK - J.Descuento',
              url: '/',
              icon: 'rocket'
            },
            // (U) BEBIDA GRATIS
            {
              title: 'NOK - J.Bebida',
              url: '/',
              icon: 'beer'
            },
            // (V) POSTRE GRATIS
            {
              title: 'NOK - J.Postre',
              url: '/',
              icon: 'cafe'
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

              // (J) ENCUESTA EMPLEADO
              {
                title: 'NOK - Encuesta Empleado',
                url: '/',
                icon: 'clipboard'
              },
              // (13) LISTADO DE PEDIDOS PENDIENTES POR SECTOR
              {
                title: 'NOK - Pedidos Pendientes',
                url: '/',
                icon: 'nutrition'
              },

              {
                title: 'Cerrar Sesion',
                url: '/',
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
               // (J) ENCUESTA EMPLEADO
               {
                title: 'NOK - Encuesta Empleado',
                url: '/',
                icon: 'clipboard'
              },
              // (13) LISTADO DE PEDIDOS PENDIENTES POR SECTOR
              {
                title: 'NOK - Pedidos Pendientes',
                url: '/',
                icon: 'beer'
              },

              {
                title: 'Cerrar Sesion',
                url: '/',
                icon: 'log-out'
              }
            ];

            break;

        // MOZO
        case "mozo":

            // (M) TOMAR PEDIDOS
            // (K) ENCUESTA EMPLEADO
            // (O) NPUSH - PEDIR MESA
            // (P) NPUSH - PBEB/CIERRE CUENTA
            this.appPages = [
              {
                title: 'Home',
                url: '/home',
                icon: 'home'
              },

            // (M) TOMAR PEDIDOS
            {
              title: 'NOK - Tomar pedido',
              url: '/',
              icon: 'paper'
            },

            // (K) ENCUESTA EMPLEADO
            {
              title: 'NOK - Encuesta Empleado',
              url: '/',
              icon: 'clipboard'
            },

              {
                title: 'Cerrar Sesion',
                url: '/',
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
              // (S) MAPA DE RUTA HASTA DOMICILIO Y DETALLE DE PEDIDO
              {
                title: 'NOK - Ruta H.Domicilio',
                url: '/',
                icon: 'logo-model-s'
              },
          
              {
                title: 'Cerrar Sesion',
                url: '/',
                icon: 'log-out'
              }
            ];
            break;
    }


   

    }) ;
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  navegoPagina(pagina) {
    this.router.navigateByUrl(pagina);
  }

  armoMenu(perfil)  {
    
  }

}


// | ABM - DUEÑO/SUP	A
// {
//   title: 'OK - Alta Dueño/Supervisor',
//   url: '/abm-duesup',
//   icon: 'key'
// },

// | ABM - EMPLEADO	B
// {
//   title: 'OK - Alta Empleados',
//   url: '/abm-empleados',
//   icon: 'person'
// },

// | ABM - PRODUCTO	C
// {
//   title: 'OK - Alta Productos',
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
//   title: 'OK - Alta Mesas',
//   url: '/abm-mesa',
//   icon: 'help-buoy'
// },
   

// | QR INGRESO AL LOCAL	F
// {
//   title: 'NOK - QR INGRESO',
//   url: '/',
//   icon: 'list-box'
// },

// QR | MESA	G
// {
//   title: 'NOK - QR Ingreso',
//   url: '/',
//   icon: 'git-pull-request'
// },

// | QR PROPINA	H
// {
//   title: 'NOK - QR Propina',
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
//   title: 'NOK - Encuesta Empleado',
//   url: '/',
//   icon: 'clipboard'
// },

// | ENCUESTA SUPERVISOR	K
// {
//   title: 'OK - Encuesta Supervisor',
//   url: '/encuesta-sup',
//   icon: 'alert'
// },

// | PEDIR PLATO	L
// {
//   title: 'NOK - Menu platos / bebidas',
//   url: '/',
//   icon: 'restaurant'
// },

// | TOMAR PEDIDO	M
// {
//   title: 'NOK - Tomar pedido',
//   url: '/',
//   icon: 'paper'
// },

// | HACER RESERVAS	N
// {
//   title: 'NOK - Hacer Reservas Agendadas',
//   url: '/',
//   icon: 'calendar'
// },

// | DELIVERY PEDIDO	R
// {
//   title: 'NOK - Delivery',
//   url: '/encuesta-cliente',
//   icon: 'pin'
// },

// DELIVERY RUTA	S
// {
//   title: 'NOK - Ruta H.Domicilio',
//   url: '/',
//   icon: 'logo-model-s'
// },


// | JUEGO 1	T
// {
//   title: 'NOK - J.Descuento',
//   url: '/',
//   icon: 'rocket'
// },

// | JUEGO 2	U
// {
//   title: 'NOK - J.Bebida',
//   url: '/',
//   icon: 'beer'
// },

// | JUEGO 3	V
// {
//   title: 'NOK - J.Postre',
//   url: '/',
//   icon: 'cafe'
// },
