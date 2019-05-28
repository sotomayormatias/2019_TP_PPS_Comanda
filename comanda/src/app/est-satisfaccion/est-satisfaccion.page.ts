import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { Chart } from "chart.js";

@Component({
  selector: 'app-est-satisfaccion',
  templateUrl: './est-satisfaccion.page.html',
  styleUrls: ['./est-satisfaccion.page.scss'],
})
export class EstSatisfaccionPage implements OnInit {

  @ViewChild('canvasConformidad') canvasConformidad;
  graficoConformidad: any;
  @ViewChild('canvasDestacado') canvasDestacado;
  graficoDestacado: any;
  @ViewChild('canvasRecomienda') canvasRecomienda;
  graficoRecomienda: any;
  @ViewChild('canvasLimpieza') canvasLimpieza;
  graficoLimpieza: any;

  estadisticas: any;
  conformidades: { leyenda: string, votos: number }[] = [];
  destacados: { leyenda: string, votos: number }[] = [];
  recomendaciones: { leyenda: string, votos: number }[] = [];
  limpiezas: { leyenda: string, votos: number }[] = [];

  constructor(
    private dbService: FirebaseService
  ) {
    this.dbService.getItems("ecuestasCliente").then(est => {
      this.estadisticas = est;
      this.agruparConformidades();
      this.crearGraficoConformidades();
      this.agruparDestacados();
      this.crearGraficoDestacados();
      this.agruparRecomendaciones();
      this.crearGraficoRecomendaciones();
      this.agruparLimpiezas();
      this.crearGraficoLimpiezas();
    });
  }

  ngOnInit() {
  }

  agruparConformidades() {
    this.estadisticas.forEach(esta => {
      let result = this.conformidades.find(conf => conf.leyenda == esta.conformidad);
      if (result) {
        result.votos += 1;
      } else {
        this.conformidades.push({ leyenda: esta.conformidad, votos: 1 });
      }
    });
  }

  agruparDestacados() {
    this.estadisticas.forEach(esta => {
      if (esta.destacado.servicio) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Servicio de mesa");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Servicio de mesa", votos: 1 });
      }
      if (esta.destacado.comida) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Comida");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Comida", votos: 1 });
      }
      if (esta.destacado.bebida) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Bebida");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Bebida", votos: 1 });
      }
      if (esta.destacado.instalaciones) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Instalaciones");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Instalaciones", votos: 1 });
      }
      if (esta.destacado.atencion) {
        let result = this.destacados.find(desta => desta.leyenda.toString() == "Atención del personal");
        if (result)
          result.votos += 1;
        else
          this.destacados.push({ leyenda: "Atención del personal", votos: 1 });
      }
    });
  }

  agruparRecomendaciones() {
    this.estadisticas.forEach(esta => {
      let result = this.recomendaciones.find(conf => conf.leyenda == esta.recomienda);
      if (result) {
        result.votos += 1;
      } else {
        this.recomendaciones.push({ leyenda: esta.recomienda, votos: 1 });
      }
    });
  }

  agruparLimpiezas() {
    this.estadisticas.forEach(esta => {
      let result: any;
      switch (esta.limpieza) {
        case "consti":
          result = this.limpiezas.find(conf => conf.leyenda == "Baño de Constitución");
          if (result)
            result.votos += 1;
          else
            this.limpiezas.push({ leyenda: "Baño de Constitución", votos: 1 });
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

  crearGraficoRecomendaciones() {
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
