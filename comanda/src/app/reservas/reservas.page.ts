import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Calendar } from "@ionic-native/calendar/ngx";

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

  diaElegido: string;
  mesElegido: string;
  hora: any;

  constructor(public navCtrl: NavController) {

    // this.calendar.createCalendar('MyCalendar').then(
    //   (msg) => { alert(msg); },
    //   (err) => { alert(err); }
    // );

    // this.calendario= calendar;
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
    console.log(ev);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    ev.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === ev.getTime();
  
  }
  // onViewTitleChanged(Title) {
  //   this.viewTitle = Title;
  // }
  onTimeSelected(event) {
    console.log(event);
    var date = new Date().getTime();
    console.log(date);
    let fechaElegida = JSON.stringify(event.selectedTime);
    fechaElegida = fechaElegida.substr(1,fechaElegida.length-1);
    let splitFecha = fechaElegida.split('-');
    this.diaElegido = splitFecha[2].split('T')[0];
    this.mesElegido = splitFecha[1];

    // alert("Dia: "+this.diaElegido +" Mes: " + this.mesElegido);

   
  
   

  }
 
  // onEventSelected(event) {
  //   console.log(event);
  // }

  guardar(){
    alert("Dia: "+this.diaElegido + " Mes: " + this.mesElegido + " Hora: "+ this.hora);
  }

}
