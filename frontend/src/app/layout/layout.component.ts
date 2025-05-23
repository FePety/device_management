import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription, switchMap } from 'rxjs';
import { DeviceService } from '../services/device.service';
import {DeviceTableComponent} from '../components/device-table/device-table.component';
import {RouterOutlet} from '@angular/router';
import {DeviceChartComponent} from '../components/chart/chart.component';
import {Device} from '../shared/models/device.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [
    DeviceTableComponent,
    RouterOutlet,
    DeviceChartComponent
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  refreshSubscription?: Subscription;

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.deviceService.getAllDevices().subscribe({
      next: (data) => {
        this.devices = data;

        this.refreshSubscription = interval(3000)
          .pipe(switchMap(() => this.deviceService.getAllDevices()))
          .subscribe({
            next: (refreshedData) => {
              this.devices = refreshedData;
            },
            error: (err) => {
              console.error('Hiba az eszközök frissítésekor:', err);
            },
          });
      },
      error: (err) => {
        console.error('Hiba az eszközök betöltésekor:', err);
      },
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  onDeviceChanged(device: Device, action: 'add' | 'update' | 'delete') {
    if (action === 'add') {
      this.devices = [...this.devices, device]; // újra kell assignálni, hogy változás triggerelődjön
    } else if (action === 'update') {
      this.devices = this.devices.map(d => d.id === device.id ? device : d);
    } else if (action === 'delete') {
      this.devices = this.devices.filter(d => d.id !== device.id);
    }
  }
}
