import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Device } from '../../shared/models/device.model';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-p-chart',
  templateUrl: './chart.component.html',
  standalone: true,
  imports: [BaseChartDirective, ToggleSwitch, FormsModule],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class DeviceChartComponent implements OnChanges {
  @Input() devices: Device[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Fő kapcsológomb a frissítések vezérléséhez
  public checked = true;

  // Chart konfiguráció
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 2,
      },
      point: {
        radius: 3,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          if (index !== undefined) {
            const meta = this.chart?.chart?.getDatasetMeta(index);
            if (meta) {
              meta.hidden = !meta.hidden;
              this.chart?.chart?.update();
            }
          }
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Active',
        fill: false,
        borderColor: 'green',
        backgroundColor: 'green',
        tension: 0.0,
      },
      {
        data: [],
        label: 'Error',
        fill: false,
        borderColor: 'red',
        backgroundColor: 'red',
        tension: 0.0,
      },
      {
        data: [],
        label: 'Inactive',
        fill: false,
        borderColor: 'gray',
        backgroundColor: 'gray',
        tension: 0.0,
      }
    ],
  };

  ngOnChanges() {
    // Ha a kapcsológomb ki van kapcsolva, ne frissítsünk
    if (!this.checked) return;

    const maxPoints = 10;

    // Státuszok számolása
    const activeCount = this.devices.filter(d => d.status === 'active').length;
    const errorCount = this.devices.filter(d => d.status === 'error').length;
    const inactiveCount = this.devices.filter(d => d.status === 'inactive').length;

    // Adatok frissítése
    this.lineChartData.datasets[0].data.push(activeCount);
    this.lineChartData.datasets[1].data.push(errorCount);
    this.lineChartData.datasets[2].data.push(inactiveCount);

    // Adatok vágása max 10 pontra
    this.lineChartData.datasets.forEach(dataset => {
      if (dataset.data.length > maxPoints) dataset.data.shift();
    });

    // Címkék frissítése
    const currentTime = new Date().toLocaleTimeString();
    this.lineChartData.labels?.push(currentTime);
    if (this.lineChartData.labels && this.lineChartData.labels.length > maxPoints) {
      this.lineChartData.labels.shift();
    }

    // Diagram frissítése
    this.chart?.chart?.update();
  }
}
