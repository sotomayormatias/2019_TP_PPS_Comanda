import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// import { Calendar } from "@ionic-native/calendar/ngx";
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from '@ionic/angular';


import * as firebase from "firebase";



@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  public eventSource = [];
  public selectedDate = new Date();
  isToday: boolean = true;
  markDisabled = (date: Date) => {
    var d = new Date();
    // d.setDate(d.getDate() - 1);
    return date < d;
  };
  calendar = {
    mode: 'month',
    currentDate: this.selectedDate
  }

  
  fechaElegida = {
    dia: '',
    mes: '',
    hora: '',
    minuto: ''
  }
  
  hora: any;
  clienteEnEspera: any;
  listaEsperaClientes: any[];
  key: any;
  mesas: any[];
  PickerOptions: any;
  mesaSeleccionada: any;
  cantPersonas: any;
  // calendario: any;



  constructor(
    // public calendario: Calendar,
    public navCtrl: NavController,
    public toastcontroler: ToastController,
    private baseService: FirebaseService
    ) {



      // this.PickerOptions = {
      //   buttons: [{
      //     text: 'guardo',
      //     handler: () => console.log('Prueba guardo')
      //   }, {
      //     text: 'Salgo',
      //     handler: () => {
      //       console.log('salir');
      //       return false;
      //     }
      //   }]
      // }

      // this.calendario.createCalendar('MyCalendar').then(
      //   (msg) => { console.log(msg); },
      //   (err) => { console.log(err); }
      // );

    this.baseService.getItems('mesas').then(mesa => {
      this.mesas = mesa


    });
   }

  ngOnInit() {
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }
  // loadEvents() {
  //   this.eventSource = this.createRandomEvents();
  // }
  onCurrentDateChanged(ev) {
    // console.log(ev);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    ev.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === ev.getTime();
  
  }
  // onViewTitleChanged(Title) {
  //   this.viewTitle = Title;
  // }
  onTimeSelected(event) {
    // console.log(event);
    var date = new Date().getTime();
    // console.log(date);y
    let fechaElegida = JSON.stringify(event.selectedTime);
    fechaElegida = fechaElegida.substr(1,fechaElegida.length-1);
    let splitFecha = fechaElegida.split('-');
    this.fechaElegida.dia = splitFecha[2].split('T')[0];
    this.fechaElegida.mes = splitFecha[1];

    // alert("Dia: "+this.diaElegido +" Mes: " + this.mesElegido);

   
  
   

  }
 
  // onEventSelected(event) {
  //   console.log(event);
  // }

  guardar(){

  // alert(this.hora); 
  let horaminutoseg = this.hora.substr(11,this.hora.length-21);
  let splitHoraMinSeg= horaminutoseg.split(':');

  this.fechaElegida.hora = splitHoraMinSeg[0];
  this.fechaElegida.minuto = splitHoraMinSeg[1];
  
  // console.log("Hora: "+ this.fechaElegida.hora + " Minuto: " + this.fechaElegida.minuto);

 

    this.baseService.getItems('listaEsperaClientes').then(lista => {

    let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));

    // this.listaEsperaClientes = lista;
    this.clienteEnEspera = lista.find(cliente => cliente.correo == usuarioLogueado.correo);
    // console.log(this.clienteEnEspera);
    // console.log(this.clienteEnEspera.estado);

    // let mesaEnvio = this.mesaSeleccionada[0];
    // let 
    // console.log(this.mesaSeleccionada);
// console.

    firebase.database().ref('listaEsperaClientes/'+ this.clienteEnEspera.key)
    .update({
      reserva: {
        "fechaElegida": this.fechaElegida,
        "mesaSeleccionada": this.mesaSeleccionada,
        "cantidadPersonas": this.cantPersonas
    
      }
  
   });

   this.muestroToast("Su reserva fue guardada con exito.");

    // this.baseService.updateItem('listaEsperaClientes', 'reserva', this.clientes);


  });
    // let key: string = clienteConfirmado.key;

 
  // this.baseService.addItem('usuarios', { 'clave': clienteConfirmado.clave, 'correo': correo, 'perfil': 'cliente' });

//   firebase.database().ref('encuestasSupervisor/'+this.key)
//   .set({
//     valoracion: this.valoracion, 
//     comentarios: this.comentario,
//     tipo: "cliente",
//     habitue: this.habitue,
//     comensales: this.comensales


//  });
  
  }

  async muestroToast(mensaje: string) {
    const toast = await this.toastcontroler.create({
    
      message: mensaje,
      color: 'success',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'OK',
      // duration: 3000
    });

    toast.present();
  }

}
