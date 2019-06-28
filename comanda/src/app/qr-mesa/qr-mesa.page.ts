import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPedidoPage } from "../modal-pedido/modal-pedido.page";

@Component({
  selector: 'app-qr-mesa',
  templateUrl: './qr-mesa.page.html',
  styleUrls: ['./qr-mesa.page.scss'],
})
export class QrMesaPage implements OnInit {
  datosEscaneados: any;
  parsedDatosEscaneados: any;
  mesaEscaneada: any;
  clienteLogueado: any;
  pedidos: any;
  idPedido: number = 0;
  listaEspera: any;
  estaEnLista: boolean;
  keyPuestoListaEspera: string;
  listareservas: any;
  estaEnMesa: any = false;
  mesasReserva: any;

  constructor(private scanner: BarcodeScanner,
    private baseService: FirebaseService,
    private alertCtrl: AlertController,
    private router: Router,
    public modalController: ModalController) {
    this.traerDatosCliente(JSON.parse(sessionStorage.getItem('usuario')).correo);
    this.traerPedidos();
    this.traerListaEspera();
    this.verificarSiOcupaMesa();

    this.limpioReservas();

  }

  ngOnInit() {
  }

  async limpioReservas()
  {
     await this.baseService.getItems('reservademesas').then(async lista => {
       this.listareservas = lista;
       let dateReserva: Date = new Date();
       let dateNow: Date = new Date();

       this.listareservas.forEach(async reserva => {
        
          dateReserva.setDate(parseInt(reserva.fechaElegida.dia));
          dateReserva.setMonth(parseInt(reserva.fechaElegida.mes)-1);
          dateReserva.setHours(parseInt(reserva.fechaElegida.hora));
          dateReserva.setMinutes(parseInt(reserva.fechaElegida.minuto)+2);
      
          if( dateNow > dateReserva)
          {
            // LEVANTO MESAS GETITEMS(MESAS) 
            // MATCH ENTRE MESA.NRO Y RESERVA.MESSELECCIONADA
            // RESERVADA = NO 
            // ELIMINO RESERVA

             await this.baseService.getItems('mesas').then(async mesas => {
             this.mesasReserva = mesas.find(mesa => mesa.nromesa == reserva.mesaSeleccionada);
             console.log(this.mesasReserva);
             if(this.mesasReserva !== undefined)
             {
               console.log("Reservas viejas limpiadas");
               this.mesasReserva.reservada = "no";
               await this.baseService.updateItem('mesas', this.mesasReserva.key, this.mesasReserva);  
               await this.baseService.removeItem('reservademesas', reserva.key);

             }

            });

          }


       });
     


     });

  }

  

  doScan() {
    this.traerPedidos();
    this.traerListaEspera();
    this.verificarSiOcupaMesa();

    this.scanner.scan().then((data) => {
      this.datosEscaneados = data;
      if ((this.datosEscaneados.text).includes("mesa")) {
        this.parsedDatosEscaneados = JSON.parse(this.datosEscaneados.text);
        this.mostrarInformacion();
      } else {
        this.mostrarQRErroneo();
      }
    }, (err) => {
      console.log("Error: " + err);
    });
  }

  async mostrarInformacion() {
    let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
    // console.log(this.parsedDatosEscaneados);
    // console.log(parsedDatosEscaneados);
    // let date : Date = new Date();
          // let dateReserva : Date = new Date(); GUARDO LA INFO QUE VIENE DE LA RESERVA.

      await this.baseService.getItems('mesas').then( async mesas => {
      let nroMesa = this.parsedDatosEscaneados.mesa;
      this.mesaEscaneada = mesas.find(mesa => mesa.nromesa == nroMesa);
      console.log("Reservada: " + this.mesaEscaneada.reservada);
      if(this.mesaEscaneada.reservada === "si")
      {
        await this.baseService.getItems('reservademesas').then( async reservas =>  {
          // console.log(reservas);
          // console.log(this.mesaEscaneada.nromesa);

          let reservaEncontrada: any = reservas.find(res => res.mesaSeleccionada == this.mesaEscaneada.nromesa);
          this.listareservas = reservas;
       
          // console.log(reservaEncontrada);

          let dateReserva: Date = new Date();
          let dateNow: Date = new Date();

          // console.log(dateNow.getTime() < dateReserva.getTime());

          // let fechaHoy = {
          //    diaHoy : dateNow.getDate(),
          //  mesHoy : dateNow.getMonth(),
          //  horaHoy : dateNow.getHours(),
          //  minutoHoy : dateNow.getMinutes()

          // }
          // dateReserva.setFullYear(2019);
          dateReserva.setDate(parseInt(reservaEncontrada.fechaElegida.dia));
          dateReserva.setMonth(parseInt(reservaEncontrada.fechaElegida.mes)-1);
          dateReserva.setHours(parseInt(reservaEncontrada.fechaElegida.hora));
          dateReserva.setMinutes(parseInt(reservaEncontrada.fechaElegida.minuto)-20);

          // console.log(dateNow);
          // console.log(dateReserva);

          // let fechaSelec = {
          //   dia: parseInt(reservaEncontrada.fechaElegida.dia),
          //   mes: parseInt(reservaEncontrada.fechaElegida.mes)-1,
          //   hora: parseInt(reservaEncontrada.fechaElegida.hora),
          //   minuto: parseInt(reservaEncontrada.fechaElegida.minuto)-20,
          // }
        

          // if(dateNow.getDate() <  fechaSelec.hora)
          // {
          //   console.log("entro prueba");
          // }


          if( dateNow < dateReserva )
          {
             //HACE LOGICA
            if (usuarioLogueado.perfil == "cliente") { // Logica para cuando escanea el cliente
              if (this.mesaEscaneada.estado == 'libre') { // si la mesa esta libre
                if (this.estaEnLista) { // si el cliente esta en lista de espera
                  if (this.listaEspera.find(espera => espera.correo == usuarioLogueado.correo && espera.estado == 'esperandoMesa')) {
                    this.presentAlertCliente();
                  } else {
                    this.presentAlertSigueEnLista();
                  }
                } else { // si el cliente no esta en lista de espera
                  if (this.estaEnMesa) { //valido que el cliente no tenga ya asignada una mesa
                    this.presentAlertYaOcupaMesa();
                  } else {
                    this.presentAlertNoEstaEnLista();
                  }
                }
              } else { // Si la mesa esta ocupada
                if (this.mesaEscaneada.cliente == usuarioLogueado.correo) { // Si el que escanea es el que ocupa la mesa
                  if (this.verificarPedidoEnPreparacion()) { //Si ya hizo un pedido
                    this.presentAlertConPedido();
                  } else { // Si aun no hizo un pedido
                    this.presentAlertSinPedido();
                  }
                } else { // Si el que escanea no es quien ocupa la mesa
                  this.presentAlertEmpleado();
                }
              }
            } else { // Logica para cuando escanea un empleado
              this.presentAlertEmpleado();
            }

          }
          else{
              let reservaUsuario = reservas.find(reser => reser.correo == usuarioLogueado.correo);
              if(reservaUsuario !== undefined)
              {
                 //HACE LOGICA
                    if (usuarioLogueado.perfil == "cliente") { // Logica para cuando escanea el cliente
                      if (this.mesaEscaneada.estado == 'libre') { // si la mesa esta libre
                        if (this.estaEnLista) { // si el cliente esta en lista de espera
                          if (this.listaEspera.find(espera => espera.correo == usuarioLogueado.correo && espera.estado == 'esperandoMesa')) {
                            this.presentAlertCliente();
                          } else {
                            this.presentAlertSigueEnLista();
                          }
                        } else { // si el cliente no esta en lista de espera
                          if (this.estaEnMesa) { //valido que el cliente no tenga ya asignada una mesa
                            this.presentAlertYaOcupaMesa();
                          } else {
                            this.presentAlertNoEstaEnLista();
                          }
                        }
                      } else { // Si la mesa esta ocupada
                        if (this.mesaEscaneada.cliente == usuarioLogueado.correo) { // Si el que escanea es el que ocupa la mesa
                          if (this.verificarPedidoEnPreparacion()) { //Si ya hizo un pedido
                            this.presentAlertConPedido();
                          } else { // Si aun no hizo un pedido
                            this.presentAlertSinPedido();
                          }
                        } else { // Si el que escanea no es quien ocupa la mesa
                          this.presentAlertEmpleado();
                        }
                      }
            } else { // Logica para cuando escanea un empleado
              this.presentAlertEmpleado();
            }

              }
              else
              {
                alert("La mesa esta reservada");
              }

          }
        

        //   SI LO ESTA => IF HORA ACTUAL  < HORA RESERVA - 40 MIN
	      // 	SI ES MENOR => 
				// 		PROCEDIMIENTO NORMAL
          
    		// SI NO => 
				//  IF CLIENTESERVA = USUARIOCORREO
				// 	SI ES EL MISMO => PROCEDIMIENTO NORMAL
				// 	SI NO => LA MESA ESTA RESERVADA




           
           

        



          
      
        
        });
     
      }
     



     
      //FIJARSE SI LA MESA ESTA RESERVADA, si lo esta => fijarse hora minutos y usuario (40 min antes)
      //SI NO ESTA RESERVADA QUE AGARRE LA MESA

  
    });

  }

  async presentAlertEmpleado() {
    const alert = await this.alertCtrl.create({
      header: 'Estado de mesa',
      subHeader: 'Mesa: ' + this.mesaEscaneada.nromesa,
      message: 'La mesa se encuentra ' + this.mesaEscaneada.estado,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertSinPedido() {
    const alert = await this.alertCtrl.create({
      header: 'Mesa: ' + this.mesaEscaneada.nromesa,
      subHeader: 'Mesa sin pedido',
      message: 'Todavía no ha realizado ningún pedido',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertNoEstaEnLista() {
    const alert = await this.alertCtrl.create({
      subHeader: 'No se encuentra en lista de espera',
      message: 'Debe escanear el QR de ingreso al local',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertSigueEnLista() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Usted sigue en lista de espera',
      message: 'Debe esperar a que el mozo lo confirme',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertYaOcupaMesa() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Ya tiene mesa',
      message: 'Usted ya se encuentra ocupando una mesa',
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarQRErroneo() {
    const alert = await this.alertCtrl.create({
      header: 'El código leído no es un QR de mesa',
      message: 'Debe escanear un QR valido',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertCliente() {
    const alert = await this.alertCtrl.create({
      header: 'Estado de mesa',
      subHeader: 'Mesa: ' + this.mesaEscaneada.nromesa,
      message: 'La mesa se encuentra libre. ¿Desea ocuparla?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.ocuparMesa();
          }
        },
        {
          text: 'No',
          handler: () => {
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertConPedido() {
    const alert = await this.alertCtrl.create({
      header: 'Mesa: ' + this.mesaEscaneada.nromesa,
      subHeader: '¿Pedido o encuesta?',
      message: '¿Desea ver el status de su pedido o acceder a la encuesta de satisfacción?',
      buttons: [
        {
          text: 'Pedido',
          handler: () => {
            this.verPedido();
          }
        },
        {
          text: 'Encuesta',
          handler: () => {
            this.verEncuesta();
          }
        }
      ]
    });
    await alert.present();
  }

  ocuparMesa() {
    // Saco al cliente de lista de espera
    this.baseService.removeItem('listaEsperaClientes', this.keyPuestoListaEspera);

    // Cambio el estado de la mesa y la asocio al cliente
    this.mesaEscaneada.estado = 'ocupada';
    this.mesaEscaneada.cliente = this.clienteLogueado.correo;
    this.mesaEscaneada.reservada = 'no';
    let key = this.mesaEscaneada.key;
    delete this.mesaEscaneada['key'];
    this.eliminoReserva();
    this.baseService.updateItem('mesas', key, this.mesaEscaneada);


  }

  eliminoReserva()
  {

    // await this.baseService.getItems('mesas').then(async mesas => {
    //   this.mesasReserva = mesas.find(mesa => mesa.nromesa == reserva.mesaSeleccionada);
    //   console.log(this.mesasReserva);
    //   if(this.mesasReserva !== undefined)
    //   {
    //     console.log("Reservas viejas limpiadas");
    //     this.mesasReserva.reservada = "no";
    //     await this.baseService.updateItem('mesas', this.mesasReserva.key, this.mesasReserva);  
    //     await this.baseService.removeItem('reservademesas', reserva.key);

    //   }

    //  });



    this.baseService.removeItem('reservademesas', this.keyPuestoListaEspera);
   

  }

  traerDatosCliente(correo: string): any {
    this.baseService.getItems('clientes').then(clientes => {
      this.clienteLogueado = clientes.find(cli => cli.correo == correo);
    });
  }

  traerPedidos() {
    this.baseService.getItems('pedidos').then(ped => {
      this.pedidos = ped;
    });
  }

  traerListaEspera() {
    this.baseService.getItems('listaEsperaClientes').then(lista => {
      this.listaEspera = lista;
      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
      if (this.listaEspera.find(espera => espera.correo == usuarioLogueado.correo)) {
        this.estaEnLista = true;
        this.keyPuestoListaEspera = this.listaEspera.find(espera => espera.correo == usuarioLogueado.correo).key;
      } else {
        this.estaEnLista = false;
      }
    });
  }

  verificarPedidoEnPreparacion(): boolean {
    if (this.pedidos.filter(pedido => pedido.mesa == this.mesaEscaneada.nromesa && pedido.estado != 'cerrado').length > 0) {
      this.idPedido = this.pedidos.filter(pedido => pedido.mesa == this.mesaEscaneada.nromesa)[0].id;
      return true;
    } else {
      return false;
    };
  }

  verificarSiOcupaMesa() {
    this.baseService.getItems('mesas').then(mesas => {
      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
      mesas.forEach(mesa => {
        if (mesa.cliente == usuarioLogueado.correo) {
          this.estaEnMesa = true;
        }
      });
    });
  }

  verPedido() {
    this.muestraModal();
  }

  verEncuesta() {
    this.router.navigateByUrl('/encuesta-cliente');
  }

  async muestraModal() {
    const modal = await this.modalController.create({
      component: ModalPedidoPage,
      componentProps: {
        pedido: this.idPedido,
      }
    });
    return await modal.present();
  }

}
