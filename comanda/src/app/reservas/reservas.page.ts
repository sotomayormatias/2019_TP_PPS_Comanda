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
    d.setDate(d.getDate() - 1);
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
  reservaRealizada: any = null;
  key: any;
  mesas: any = null;

  mesaSeleccionada: any;

  spinner:boolean ; 
  tienereserva: boolean = false;

  min: any;
  max: any;

  constructor(
    public calendario: Calendar,
    public navCtrl: NavController,
    public toastcontroler: ToastController,
    private baseService: FirebaseService
    ) {
      // this.max=(new Date((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString());
      // this.min= (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();

      // let date = new Date();
      // date.setFullYear(2019);
      // date.setDate(25);
      // date.setMonth(6);
      // date.setHours(1);
      // date.setMinutes(30);

      // this.max = "2019-6-25T01:30";

      // date.setHours(19);
      // date.setMinutes(30);


      // this.min = "2019-6-25T19:30";

     
 
   }

  ngOnInit() {

    this.cargoEventoCalendario();
    this.cargoMesas();
    
   
  }

  async cargoEventoCalendario(){
    this.eventSource = await this.createEvents();  

  }

  cargoMesas(){
    this.baseService.getItems('mesas').then(mesa => {
      this.mesas = mesa
    });
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
 

 

  async guardar(){

    //VARIABLES
    let horaminutoseg = this.hora.substr(11,this.hora.length-21);
    let splitHoraMinSeg= horaminutoseg.split(':');
    let date = new Date()
    let dateCreada = new Date();
  

    dateCreada.setDate(parseInt(this.fechaElegida.dia));
    dateCreada.setHours(parseInt(horaminutoseg));
    dateCreada.setMinutes(parseInt(splitHoraMinSeg[1]));

    console.log(date);
    console.log(dateCreada);


    if(dateCreada < date)
    {
      this.muestroToastError("Error en el tiempo seleccionado.");
      
      
    }
    else{
      this.fechaElegida.hora = splitHoraMinSeg[0];
      this.fechaElegida.minuto = splitHoraMinSeg[1];
      //TABLA RESERVAMESAS
      await this.guardarReservas();
      this.spinner = true;
      this.eventSource = await this.createEvents();

      setTimeout(() => this.spinner = false , 3000);

      this.muestroToast("Su reserva fue guardada con exito.");
    }
   


   
    
  
  }

  async guardarReservas(){

      // localStorage.setItem("reservaStatus","si");
      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
      await this.baseService.getItems('reservademesas').then(async lista => {
      this.reservaRealizada = lista.find(cliente => cliente.correo == usuarioLogueado.correo);
      let objetoEnviar = {
        "correo": usuarioLogueado.correo,
        "fechaElegida": this.fechaElegida,
        "mesaSeleccionada": this.mesaSeleccionada,
        "estadoConfirmacion": "pendiente"
      }
      if(this.reservaRealizada !== undefined)
      {
        this.baseService.updateItem('reservademesas', this.reservaRealizada.key, objetoEnviar);  

      }
      else{
         this.baseService.addItem('reservademesas', objetoEnviar);
      }
    
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

  async muestroToastError(mensaje: string) {
    const toast = await this.toastcontroler.create({
    
      message: mensaje,
      color: 'danger',
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

// createEventsTrue() {
//   var events = [];
//   let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
//   this.baseService.getItems('reservademesas').then(lista => {
//   this.reservaRealizada = lista.find(cliente => cliente.correo == usuarioLogueado.correo);
  
//   var date = new Date();
//   date.setHours(parseInt(this.reservaRealizada.fechaElegida.hora));
//   date.setMinutes(parseInt(this.reservaRealizada.fechaElegida.minuto));
//   date.setMonth(parseInt(this.reservaRealizada.fechaElegida.mes));
//   date.setDate(parseInt(this.reservaRealizada.fechaElegida.dia));
//   date.setFullYear(2019);
//       var startDay = parseInt(this.reservaRealizada.fechaElegida.dia);
//       var endDay = startDay;
//       var startMinute = parseInt(this.reservaRealizada.fechaElegida.minuto);
//       var endMinute = Math.floor(2 * 180) + startMinute;

//       var startTime;
//       var endTime;

//       startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, date.getMinutes());
//       endTime = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
//       // console.log(startTime);
//       events.push({
//         title: 'Reserva: ' + startTime,
//         startTime: startTime,
//         allDay: false
//     });
 
//   });
//   // console.log(events);
//   return events;
  
  
// }

async createEvents(){

  var events = [];

 
  let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
  await this.baseService.getItems('reservademesas').then(async lista => {
   this.reservaRealizada = lista;
   this.reservaRealizada = this.reservaRealizada.find(cliente => cliente.correo == usuarioLogueado.correo);
    
    if(this.reservaRealizada !== undefined)
    {
      // var eventType = Math.floor(Math.random() * 2);
      var startDay = parseInt(this.reservaRealizada.fechaElegida.dia);
      var endDay = parseInt(this.reservaRealizada.fechaElegida.dia);
      var startMinute = parseInt(this.reservaRealizada.fechaElegida.minuto);
      var startHora = parseInt(this.reservaRealizada.fechaElegida.hora);
      var startMes = parseInt(this.reservaRealizada.fechaElegida.mes);
      // var startStatus = localStorage.getItem("reservaStatus");
      var confirmadaStatus = this.reservaRealizada.estadoConfirmacion;
      // console.log(startDay);

      // let inicio: Date = new Date();

      // inicio.setDate(parseInt(this.reservaRealizada.fechaElegida.dia));
      // inicio.setMinutes(parseInt(this.reservaRealizada.fechaElegida.minuto));
      // inicio.setHours(parseInt(this.reservaRealizada.fechaElegida.hora));
      // inicio.setmon(parseInt(this.reservaRealizada.fechaElegida.minuto));






      let startTime;
      let endTime;
      
     
      var endMinute = Math.floor(120) + startMinute;

      // for (var i = 0; i < 1; i += 1) {
        // if(startStatus == "si")
        // {
        
          // startTime = new Date(2019, startMes-1, startDay-1, startHora, startMinute);
          startTime = new Date(2019,startMes-1,startDay,startHora,startMinute)
          endTime = new Date(2019, startMes-1, endDay, startHora, endMinute);
  
          // console.log(startTime);
          // console.log(endTime);


          events.push({
              title: 'Estado Reserva: '+ confirmadaStatus,
              startTime: startTime,
              endTime: endTime,
              allDay: false
          });
  
  
        // }
     

       
    
      // }

      
  }
    // else{
    //   localStorage.setItem("reservaStatus","no");
    // }
  });

  return events;
}
  // var date = new Date();
 
  // var startDay = parseInt(localStorage.getItem("dia"));
  // var endDay = parseInt(localStorage.getItem("dia")) ;
  // var startMinute = parseInt(localStorage.getItem("minuto"));
  // var startHora = parseInt(localStorage.getItem("hora"));
  // var startMes = parseInt(localStorage.getItem("mes"));
  // var startStatus = localStorage.getItem("reservaStatus");

}
