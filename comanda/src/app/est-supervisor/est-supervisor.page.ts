import { Component, OnInit,ViewChild } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { Chart } from "chart.js";

@Component({
  selector: 'app-est-supervisor',
  templateUrl: './est-supervisor.page.html',
  styleUrls: ['./est-supervisor.page.scss'],
})
export class EstSupervisorPage implements OnInit {

  @ViewChild('canvasConformidad') canvasConformidad;
  graficoConformidad: any;
  @ViewChild('canvasConformidadCliente') canvasConformidadCliente;
  graficoConformidadCliente: any;

  // @ViewChild('canvasDestacado') canvasDestacado;
  // graficoDestacado: any;

  @ViewChild('canvasRecomienda') canvasRecomienda;
  graficoRecomienda: any;
  @ViewChild('canvasHabitue') canvasHabitue;
  graficoHabitue: any;

  

  @ViewChild('canvasPuntualidad') canvasPuntualidad;
  graficoPuntualidad: any;
  @ViewChild('canvasComensales') canvasComensales;
  graficoComensales: any;

  esEmpleado: boolean = false;

  

  estadisticas: any;
  estadisticasCliente: any;

  conformidades: { leyenda: string, votos: number }[] = [];
  conformidadesCliente: { leyenda: string, votos: number }[] = [];

  // OrdenGenerales: { leyenda: string, votos: number }[] = [];
  destacados: { leyenda: string, votos: number }[] = [];
  destacadosCliente: { leyenda: string, votos: number }[] = [];

  recomendaciones: { leyenda: string, votos: number }[] = [];
  recomendacionesCliente: { leyenda: string, votos: number }[] = [];



  puntualidad: { leyenda: string, votos: number }[] = [];
  comensales: { leyenda: string, votos: number }[] = [];


  constructor(
    private dbService: FirebaseService
  ) { 
    this.dbService.getItems("encuestasSupervisor").then(est => {
      this.estadisticas = est;
      this.estadisticasCliente = est;

      // alert(est.tipo);
      // console.log(est[0].tipo);
      
      // var encEmpleados = this.estadisticas.find(enc => enc.tipo == "empleado");
      // console.log(encEmpleados);

      //EMPLEADO
      this.agruparRecomendacionesEmpleado();
      this.crearGraficoRecomendacionesEmpleado();

      this.agruparConformidades();
      this.crearGraficoConformidades();
      
      
      this.agruparPuntualidad();
      this.crearGraficoPuntualidad();

      // CLIENTE
      this.agruparRecomendacionesCliente();
      this.crearGraficoRecomendacionesCliente();

      this.agruparConformidadesCliente();
      this.crearGraficoConformidadesCliente();
      
      
      this.agruparComensales();
      this.crearGraficoComensales();
    

     
    });
  }

  ngOnInit() {

    

    
  }

  //EMPLEADO
  
  agruparRecomendacionesEmpleado() {
    
    

    this.estadisticas.forEach(esta => {
      // console.log(this.estadisticas);
      // console.log(this.recomendaciones);
      // var encEmpleados = this.estadisticas.find(enc => enc.tipo == "empleado");
      // console.log(esta.tipo);
      if(esta.tipo == "empleado")
      {
       
        let result = this.recomendaciones.find(conf => conf.leyenda == esta.recomendado);
        // console.log(result);
        if (result) {
          result.votos += 1;
        } else {
          this.recomendaciones.push({ leyenda: esta.recomendado, votos: 1 });
        }
      

      }

    });
  }

  crearGraficoRecomendacionesEmpleado() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.recomendaciones.forEach(reco => {
      leyendas.push(reco.leyenda);
      valores.push(reco.votos);
    });
    this.graficoRecomienda = new Chart(this.canvasRecomienda.nativeElement, {

      type: 'doughnut',
      data: {
        labels: leyendas,
        datasets: [{
          label: '',
          data: valores,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB"
          ]
        }]
      }
    });
  }
  

  agruparConformidades() {
    this.estadisticas.forEach(esta => {
      if(esta.tipo == "empleado")
      {
        let result = this.conformidades.find(conf => conf.leyenda == esta.valoracion);
        if (result) {
          result.votos += 1;
        } else {
          this.conformidades.push({ leyenda: esta.valoracion, votos: 1 });
        }

      }
     
    });
  }

  crearGraficoConformidades() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.conformidades.forEach(conf => {
      leyendas.push(conf.leyenda);
      valores.push(conf.votos);
    });
    this.graficoConformidad = new Chart(this.canvasConformidad.nativeElement, {

      type: 'doughnut',
      data: {
        labels: leyendas,
        datasets: [{
          label: '',
          data: valores,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
      }
    });
  }

  agruparPuntualidad() {
    this.estadisticas.forEach(esta => {

      if(esta.tipo == "empleado"){
        let result: any;
        switch (esta.puntualidad) {
          case "puntual":
            result = this.puntualidad.find(conf => conf.leyenda == "puntual");
            if (result)
              result.votos += 1;
            else
              this.puntualidad.push({ leyenda: "puntual", votos: 1 });
            break;
          default:
            result = this.puntualidad.find(conf => conf.leyenda == esta.puntualidad);
            if (result) {
              result.votos += 1;
            } else {
              this.puntualidad.push({ leyenda: esta.puntualidad, votos: 1 });
            }
            break;
        }
      }
     
    });
  }

  crearGraficoPuntualidad() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.puntualidad.forEach(limpi => {
      leyendas.push(limpi.leyenda);
      valores.push(limpi.votos);
    });
    this.graficoPuntualidad = new Chart(this.canvasPuntualidad.nativeElement, {

      type: 'bar',
      data: {
        labels: leyendas,
        datasets: [{
          label: '',
          data: valores,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384"
          ]
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  //CLIENTE

  agruparRecomendacionesCliente() {
    
    

    this.estadisticasCliente.forEach(esta => {
      // console.log(this.estadisticas);
      // console.log(this.recomendaciones);
      // var encEmpleados = this.estadisticas.find(enc => enc.tipo == "empleado");
      // console.log(esta.tipo);
      if(esta.tipo == "cliente")
      {
       
        let result = this.recomendacionesCliente.find(conf => conf.leyenda == esta.habitue);
        // console.log(result);
        if (result) {
          result.votos += 1;
        } else {
          this.recomendacionesCliente.push({ leyenda: esta.habitue, votos: 1 });
        }
      

      }

    });
  }

  crearGraficoRecomendacionesCliente() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.recomendacionesCliente.forEach(reco => {
      leyendas.push(reco.leyenda);
      valores.push(reco.votos);
    });
    this.graficoHabitue = new Chart(this.canvasHabitue.nativeElement, {

      type: 'doughnut',
      data: {
        labels: leyendas,
        datasets: [{
          label: '',
          data: valores,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB"
          ]
        }]
      }
    });
  }
  

  agruparConformidadesCliente() {
    this.estadisticasCliente.forEach(esta => {
      if(esta.tipo == "cliente")
      {
        let result = this.conformidadesCliente.find(conf => conf.leyenda == esta.valoracion);
        if (result) {
          result.votos += 1;
        } else {
          this.conformidadesCliente.push({ leyenda: esta.valoracion, votos: 1 });
        }

      }
     
    });
  }

  crearGraficoConformidadesCliente() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.conformidadesCliente.forEach(conf => {
      leyendas.push(conf.leyenda);
      valores.push(conf.votos);
    });
    this.graficoConformidadCliente = new Chart(this.canvasConformidadCliente.nativeElement, {

      type: 'doughnut',
      data: {
        labels: leyendas,
        datasets: [{
          label: '',
          data: valores,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
      }
    });
  }

  agruparComensales() {
    this.estadisticasCliente.forEach(esta => {

      if(esta.tipo == "cliente"){
        let result: any;
        switch (esta.comensales) {
          case "1":
            result = this.puntualidad.find(conf => conf.leyenda == "Solo");
            if (result)
              result.votos += 1;
            else
              this.comensales.push({ leyenda: "Solo", votos: 1 });
            break;
          default:
            result = this.comensales.find(conf => conf.leyenda == esta.comensales);
            if (result) {
              result.votos += 1;
            } else {
              this.comensales.push({ leyenda: esta.comensales, votos: 1 });
            }
            break;
        }
      }
     
    });
  }

  crearGraficoComensales() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.comensales.forEach(limpi => {
      leyendas.push(limpi.leyenda);
      valores.push(limpi.votos);
    });
    this.graficoComensales = new Chart(this.canvasComensales.nativeElement, {

      type: 'bar',
      data: {
        labels: leyendas,
        datasets: [{
          label: '',
          data: valores,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384"
          ]
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

}