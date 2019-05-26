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

  estadisticas: any;
  conformidades: { nota: number, votos: number }[] = [];


  constructor(
    private dbService: FirebaseService
  ) {
    this.dbService.getItems("ecuestasCliente").then(est => {
      this.estadisticas = est;
      this.agruparConformidades();
      this.graficoConformidades();
    });
  }

  ngOnInit() {
  }

  agruparConformidades() {
    this.estadisticas.forEach(esta => {
      let result = this.conformidades.find(nota => nota.nota == esta.conformidad);
      if(result){
        result.votos += 1;
      } else {
        this.conformidades.push({nota: esta.conformidad, votos: 1});
      }
    });
  }

  graficoConformidades() {
    let leyendas: number[] = [];
    let valores: number[] = [];
    this.conformidades.forEach(conf => {
      leyendas.push(conf.nota);
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
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
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
}
