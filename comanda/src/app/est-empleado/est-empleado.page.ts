import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { Chart } from "chart.js";

@Component({
  selector: 'app-est-empleado',
  templateUrl: './est-empleado.page.html',
  styleUrls: ['./est-empleado.page.scss'],
})
export class EstEmpleadoPage implements OnInit {

 
  // @ViewChild('canvasOrdenGeneral') canvasOrdenGeneral;
  // graficoOrdenGeneral: any;
  @ViewChild('canvasDestacado') canvasDestacado;
  graficoDestacado: any;
  @ViewChild('canvasRecomienda') canvasRecomienda;
  graficoRecomienda: any;
  @ViewChild('canvasLimpieza') canvasLimpieza;
  graficoLimpieza: any;

  estadisticas: any;
  OrdenGenerales: { leyenda: string, votos: number }[] = [];
  destacados: { leyenda: string, votos: number }[] = [];
  Felicidad: { leyenda: string, votos: number }[] = [];
  limpiezas: { leyenda: string, votos: number }[] = [];

  constructor(
    private dbService: FirebaseService
  ) {
    this.dbService.getItems("encuestasEmpleados").then(est => {
      this.estadisticas = est;
      // this.agruparOrdenGenerales();
      // this.crearGraficoOrdenGenerales();
      this.agruparDestacados();
      this.crearGraficoDestacados();
      this.agruparFelicidad();
      this.crearGraficoFelicidad();
      this.agruparLimpiezas();
      this.crearGraficoLimpiezas();
    });
  }

  ngOnInit() {
  }

  agruparOrdenGenerales() {
    this.estadisticas.forEach(esta => {
      let result = this.OrdenGenerales.find(conf => conf.leyenda == esta.OrdenGeneral);
      if (result) {
        result.votos += 1;
      } else {
        this.OrdenGenerales.push({ leyenda: esta.OrdenGeneral, votos: 1 });
      }
    });
  }

  agruparDestacados() {
    this.estadisticas.forEach(esta => {
      if (esta.destacado.puestoTrabajo) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Puesto de trabajo");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Puesto de trabajo", votos: 1 });
      }
      if (esta.destacado.comunicacion) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Comunicación");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Comunicación", votos: 1 });
      }
      if (esta.destacado.companerismo) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Compañerismo");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Compañerismo", votos: 1 });
      }
      if (esta.destacado.horarios) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Horarios Flexibles");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Horarios Flexibles", votos: 1 });
      }
    
    });
  }

  agruparFelicidad() {
    this.estadisticas.forEach(esta => {
      let result = this.Felicidad.find(conf => conf.leyenda == esta.recomienda);
      if (result) {
        result.votos += 1;
      } else {
        this.Felicidad.push({ leyenda: esta.recomienda, votos: 1 });
      }
    });
  }

  agruparLimpiezas() {
    this.estadisticas.forEach(esta => {
      let result: any;
      switch (esta.limpieza) {
        case "consti":
          result = this.limpiezas.find(conf => conf.leyenda == "Imposible Trabajar");
          if (result)
            result.votos += 1;
          else
            this.limpiezas.push({ leyenda: "Imposible Trabajar", votos: 1 });
          break;
        default:
          result = this.limpiezas.find(conf => conf.leyenda == esta.limpieza);
          if (result) {
            result.votos += 1;
          } else {
            this.limpiezas.push({ leyenda: esta.limpieza, votos: 1 });
          }
          break;
      }
    });
  }

  // crearGraficoOrdenGenerales() {
  //   let leyendas: string[] = ['Suma De Orden'];
  //   let valores: number[] = [];
  //   this.OrdenGenerales.forEach(conf => {
  //     // leyendas.push(conf.leyenda);
  //     valores.push(conf.votos);
  //   });
  //   this.graficoOrdenGeneral = new Chart(this.canvasOrdenGeneral.nativeElement, {

  //     type: 'doughnut',
  //     data: {
  //       labels: leyendas,
  //       datasets: [{
  //         label: '',
  //         data: valores,
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.5)',
  //           'rgba(54, 162, 235, 0.5)',
  //           'rgba(255, 206, 86, 0.5)',
  //           'rgba(75, 192, 192, 0.5)',
  //           'rgba(153, 102, 255, 0.5)',
  //           'rgba(255, 159, 64, 0.5)'
  //         ],
  //         hoverBackgroundColor: [
  //           "#FF6384",
  //           "#36A2EB",
  //           "#FFCE56",
  //           "#FF6384",
  //           "#36A2EB",
  //           "#FFCE56"
  //         ]
  //       }]
  //     }
  //   });
  // }

  crearGraficoDestacados() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.destacados.forEach(desta => {
      leyendas.push(desta.leyenda);
      valores.push(desta.votos);
    });
    this.graficoDestacado = new Chart(this.canvasDestacado.nativeElement, {

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
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
            "#36A2EB"
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

  crearGraficoFelicidad() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.Felicidad.forEach(reco => {
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
  crearGraficoLimpiezas() {
    let leyendas: string[] = [];
    let valores: number[] = [];
    this.limpiezas.forEach(limpi => {
      leyendas.push(limpi.leyenda);
      valores.push(limpi.votos);
    });
    this.graficoLimpieza = new Chart(this.canvasLimpieza.nativeElement, {

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
