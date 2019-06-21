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
  // cantPersonas: any;
  spinner:boolean ; 
  tienereserva: boolean = false;
  mesaReservada: any;

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
  onCurrentDateChanged(ev) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    ev.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === ev.getTime();
  
  }

  onTimeSelected(event) {
   
    // var date = new Date().getTime();

    let fechaElegida = JSON.stringify(event.selectedTime);
    fechaElegida = fechaElegida.substr(1,fechaElegida.length-1);
    let splitFecha = fechaElegida.split('-');
    this.fechaElegida.dia = splitFecha[2].split('T')[0];
    this.fechaElegida.mes = splitFecha[1];

    

   
  
   

  }
 
 

  guardar(){

    // localStorage.setItem("reservada","no");
    let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
   
  // if( localStorage.getItem("tienereserva") == "false")

  // {
    let horaminutoseg = this.hora.substr(11,this.hora.length-21);
    let splitHoraMinSeg= horaminutoseg.split(':');

    this.fechaElegida.hora = splitHoraMinSeg[0];
    this.fechaElegida.minuto = splitHoraMinSeg[1];
  
    this.baseService.getItems('listaEsperaClientes').then(lista => {
    this.clienteEnEspera = lista.find(cliente => cliente.correo == usuarioLogueado.correo);
 


   firebase.database().ref('reservademesas/'+ this.clienteEnEspera.key)
   .update({
    
       "correo": usuarioLogueado.correo,
       "fechaElegida": this.fechaElegida,
       "mesaSeleccionada": this.mesaSeleccionada
 
  });

    
  this.baseService.getItems('mesas').then(lista => {
    this.mesaReservada = lista.find(mesa => mesa.nromesa == this.mesaSeleccionada);

    firebase.database().ref('mesas/'+ this.mesaReservada.key)
    .update({
    
        reservada: "si"

    });
      
    });
  // } FIN IF tienereserva
});

  localStorage.setItem("dia",this.fechaElegida.dia);
  localStorage.setItem("mes",this.fechaElegida.mes);
  localStorage.setItem("hora",this.fechaElegida.hora);
  localStorage.setItem("minuto",this.fechaElegida.minuto);
  localStorage.setItem("reservada","si");

  this.spinner = true;
  this.eventSource = this.createEvents(); 
  setTimeout(() => this.spinner = false , 4500);  


   this.muestroToast("Su reserva fue guardada con exito.");
    

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
      // console.log(startTime);
      events.push({
        title: 'Reserva: ' + startTime,
        startTime: startTime,
        allDay: false
    });
 
  });
  // console.log(events);
  return events;
  
  
}

createEvents(){

  var events = [];

 
  let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
  this.baseService.getItems('reservademesas').then(lista => {
    this.reservaRealizada = lista.find(cliente => cliente.correo == usuarioLogueado.correo);
    

    if(this.reservaRealizada == undefined)
    {
      
      localStorage.setItem("reservaStatus","no");


    }
    else{
      localStorage.setItem("dia",this.reservaRealizada.fechaElegida.dia);
      localStorage.setItem("mes",this.reservaRealizada.fechaElegida.mes);
      localStorage.setItem("hora",this.reservaRealizada.fechaElegida.hora);
      localStorage.setItem("minuto",this.reservaRealizada.fechaElegida.minuto);
      localStorage.setItem("reservaStatus","si");

    }
   
    // this.startDay = parseInt(this.reservaRealizada.fechaElegida.dia);
    // this.endDay = parseInt(this.reservaRealizada.fechaElegida.dia);
    // this.startMinute = parseInt();
  });
  
  var date = new Date();
  var eventType = Math.floor(Math.random() * 2);
  var startDay = parseInt(localStorage.getItem("dia"));
  var endDay = parseInt(localStorage.getItem("dia")) ;
  var startMinute = parseInt(localStorage.getItem("minuto"));
  var startHora = parseInt(localStorage.getItem("hora"));
  var startMes = parseInt(localStorage.getItem("mes"));
  var startStatus = localStorage.getItem("reservaStatus");
  var startTime;
  var endTime;
 
  var endMinute = Math.floor(60) + startMinute;

    for (var i = 0; i < 1; i += 1) {
      
        // if (eventType === 0) {
          
        // } else {

        if(startStatus == "si")
        {
          // console.log(startStatus);
          startTime = new Date(2019, startMes-1, startDay, startHora, startMinute);
          endTime = new Date(2019, startMes-1, endDay,startHora, endMinute);

          // console.log(startTime);
          // console.log(endTime);

          events.push({
              title: "Reserva Programada",
              startTime: startTime,
              endTime: endTime,
              allDay: false
          });


        }
            
        // }
    }
    return events;

}





}
