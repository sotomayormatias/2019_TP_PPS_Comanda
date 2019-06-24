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
  reservaRealizada: any = null;

  // listaEsperaClientes: any[];
  key: any;
  mesas: any = null;
  // PickerOptions: any;
  mesaSeleccionada: any;
  // cantPersonas: any;
  spinner:boolean ; 
  tienereserva: boolean = false;

  // calendario: any;

  // startDay: number = 1;
  // endDay : number = 1;
  // startMinute : number = 1;
  // startTime : any;
  // endTime :any;

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
 
   }

  ngOnInit() {
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
 

 

  guardar(){

    //VARIABLES
    // localStorage.setItem("tienereserva","false");
    let horaminutoseg = this.hora.substr(11,this.hora.length-21);
    // console.log(this.hora);
    let splitHoraMinSeg= horaminutoseg.split(':');
    this.fechaElegida.hora = splitHoraMinSeg[0];
    this.fechaElegida.minuto = splitHoraMinSeg[1];
    // let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));

    //TABLA RESERVAMESAS
    this.guardarReservas();

    //TABLA MESAS
    this.guardarMesas();   


    localStorage.setItem("dia",this.fechaElegida.dia);
    localStorage.setItem("mes",this.fechaElegida.mes);
    localStorage.setItem("hora",this.fechaElegida.hora);
    localStorage.setItem("minuto",this.fechaElegida.minuto);
  
    localStorage.setItem("reservaStatus","si");
  
  
    this.spinner = true;
    this.eventSource = this.createEvents(); 
    
    setTimeout(() => this.spinner = false , 3000);
  
     this.muestroToast("Su reserva fue guardada con exito.");
  
  }

  guardarReservas(){

      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
      this.baseService.getItems('reservademesas').then(lista => {
      this.reservaRealizada = lista.find(cliente => cliente.correo == usuarioLogueado.correo);
      let objetoEnviar = {
        "correo": usuarioLogueado.correo,
        "fechaElegida": this.fechaElegida,
        "mesaSeleccionada": this.mesaSeleccionada,
        "estadoConfirmacion": "pendiente"
      }
      if(this.reservaRealizada == undefined)
      {
        this.baseService.addItem('reservademesas', objetoEnviar);  

      }
      else{
        this.baseService.updateItem('reservademesas', this.reservaRealizada.key, objetoEnviar);  

      }
    
      });

  }

  guardarMesas (){

    let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
    this.baseService.getItems('mesas').then(mesas => {
      this.mesas = mesas.find(mesaEl => mesaEl.nromesa == this.mesaSeleccionada);
      // console.log(this.mesaSeleccionada);
      // let key = this.mesas.key;
      // let objetoEnviar = {
      //   "reservada": "si",
      // }
      this.mesas.reservada = "si";

      this.baseService.updateItem('mesas', this.mesas.key , this.mesas);

      // if(key == undefined)
      // {
      //   this.baseService.addItem('mesas', objetoEnviar);  

      // }
      // else{
       

      // }
      
    
  
  
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
      localStorage.setItem("estadoConfirmacion",this.reservaRealizada.estadoConfirmacion);
      // console.log(localStorage.getItem("estadoConfirmacion"));
      localStorage.setItem("reservaStatus","si");

    }
   
    // this.startDay = parseInt(this.reservaRealizada.fechaElegida.dia);
    // this.endDay = parseInt(this.reservaRealizada.fechaElegida.dia);
    // this.startMinute = parseInt();
  });
  
  // var date = new Date();
  // var eventType = Math.floor(Math.random() * 2);




  // var startDay = parseInt(localStorage.getItem("dia"));
  // var endDay = parseInt(localStorage.getItem("dia")) ;
  // var startMinute = parseInt(localStorage.getItem("minuto"));
  // var startHora = parseInt(localStorage.getItem("hora"));
  // var startMes = parseInt(localStorage.getItem("mes"));
  // var startStatus = localStorage.getItem("reservaStatus");
  var startDay = parseInt(localStorage.getItem("dia"));
  var endDay = parseInt(localStorage.getItem("dia")) ;
  var startMinute = parseInt(localStorage.getItem("minuto"));
  var startHora = parseInt(localStorage.getItem("hora"));
  var startMes = parseInt(localStorage.getItem("mes"));
  var startStatus = localStorage.getItem("reservaStatus");
  var confirmadaStatus = localStorage.getItem("estadoConfirmacion");

  var startTime;
  var endTime;
 
  var endMinute = Math.floor(120) + startMinute;

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
              title: 'Estado Reserva: '+ confirmadaStatus,
              // notes: 'notas',
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
