import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Calendar } from "@ionic-native/calendar/ngx";
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
  reservaRealizada: any;

  listaEsperaClientes: any[];
  key: any;
  mesas: any[];
  PickerOptions: any;
  mesaSeleccionada: any;
  cantPersonas: any;
  // calendario: any;



  constructor(
    public calendario: Calendar,
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

       

      this.eventSource = this.createEvents();
 

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

    let fechaElegida = JSON.stringify(event.selectedTime);
    fechaElegida = fechaElegida.substr(1,fechaElegida.length-1);
    let splitFecha = fechaElegida.split('-');
    this.fechaElegida.dia = splitFecha[2].split('T')[0];
    this.fechaElegida.mes = splitFecha[1];

    

   
  
   

  }
 
 

  guardar(){


  let horaminutoseg = this.hora.substr(11,this.hora.length-21);
  let splitHoraMinSeg= horaminutoseg.split(':');

  this.fechaElegida.hora = splitHoraMinSeg[0];
  this.fechaElegida.minuto = splitHoraMinSeg[1];
  
 

    this.baseService.getItems('listaEsperaClientes').then(lista => {

    let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));

    this.clienteEnEspera = lista.find(cliente => cliente.correo == usuarioLogueado.correo);
 

  

    firebase.database().ref('listaEsperaClientes/'+ this.clienteEnEspera.key)
    .update({
      reserva: {
        "fechaElegida": this.fechaElegida,
        "mesaSeleccionada": this.mesaSeleccionada,
        "cantidadPersonas": this.cantPersonas
    
      }
  
   });

   firebase.database().ref('reservademesas/'+ this.clienteEnEspera.key)
   .update({
    
       "correo": usuarioLogueado.correo,
       "fechaElegida": this.fechaElegida,
       "mesaSeleccionada": this.mesaSeleccionada,
       "cantidadPersonas": this.cantPersonas
 
  });

   this.muestroToast("Su reserva fue guardada con exito.");


  });
  
  
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


//   openCalendar(){
//     this.calendario.openCalendar(new Date()).then(
//         (msg) => { console.log(msg); },
//         (err) => { console.log(err); }
//     );
// }

createEventsTrue() {
  var events = [];
  let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
  this.baseService.getItems('reservademesas').then(lista => {
  this.reservaRealizada = lista.find(cliente => cliente.correo == usuarioLogueado.correo);
  
  var date = new Date();
  date.setHours(parseInt(this.reservaRealizada.fechaElegida.hora));
  date.setMinutes(parseInt(this.reservaRealizada.fechaElegida.minuto));
  date.setMonth(parseInt(this.reservaRealizada.fechaElegida.mes));
  date.setDate(parseInt(this.reservaRealizada.fechaElegida.dia));
  date.setFullYear(2019);
      var startDay = parseInt(this.reservaRealizada.fechaElegida.dia);
      var endDay = startDay;
      var startMinute = parseInt(this.reservaRealizada.fechaElegida.minuto);
      var endMinute = Math.floor(2 * 180) + startMinute;

      var startTime;
      var endTime;

      startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, date.getMinutes());

      
      endTime = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      console.log(startTime);
      events.push({
        title: 'Reserva: ' + startTime,
        startTime: startTime,
        allDay: false
    });
 
  });
  console.log(events);
  return events;
  
  
}


createEvents(){

  var events = [];
    for (var i = 0; i < 1; i += 1) {
        var date = new Date();
        var eventType = Math.floor(Math.random() * 2);
        var startDay = 21;
        var endDay = 21 ;
        var startTime;
        var endTime;
        // if (eventType === 0) {
            // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
            // if (endDay === startDay) {
            //     endDay += 1;
            // }
            // endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
            // events.push({
            //     title: 'All Day - ',
            //     startTime: startTime,
            //     endTime: endTime,
            //     allDay: true
            // });
        // } else {
            var startMinute = Math.floor(Math.random() * 24 * 60);
            var endMinute = Math.floor(Math.random() * 180) + startMinute;
            console.log(date);
          
            startTime = new Date(date.getFullYear(), date.getMonth(), startDay, 0, date.getMinutes() + startMinute);
            endTime = new Date(date.getFullYear(), date.getMonth(), endDay, 0, date.getMinutes() + endMinute);

            console.log(startTime);
            console.log(endTime);

            events.push({
                title: 'Event - ' + i,
                startTime: startTime,
                endTime: endTime,
                allDay: false
            });
        // }
    }
    return events;

}





}
