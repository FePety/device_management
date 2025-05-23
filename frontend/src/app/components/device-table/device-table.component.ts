import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {CommonModule} from '@angular/common';
//import {RouterOutlet} from '@angular/router';
import {Device} from '../../shared/models/device.model';
import {interval, Subscription} from 'rxjs';
import {DeviceService} from '../../services/device.service';
import {switchMap} from 'rxjs/operators';
import {SortEvent} from 'primeng/api';
import {DeviceFormComponent} from "../device-form/device-form.component";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: 'app-device-table',
  standalone: true,
  imports: [
    CommonModule,
    //   RouterOutlet,
    TableModule,
    TagModule,
    ButtonModule,
    RippleModule,
    DeviceFormComponent,
    DialogModule
  ],
  templateUrl: './device-table.component.html',
})
export class DeviceTableComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  private refreshSubscription!: Subscription;

  displayDeviceForm = false;

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.loadDevices();

    this.refreshSubscription = interval(4000)
      .pipe(
        switchMap(() => this.deviceService.getAllDevices())
      )
      .subscribe({
        next: (data) => {
          this.devices = data;
          //console.log('Frissített devices:', this.devices);
        },
        error: (err) => {
          console.error('Hiba a device lekéréskor:', err);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadDevices() {
    this.deviceService.getAllDevices().subscribe({
      next: (data) => {
        this.devices = data;
        //console.log('Devices:', this.devices);
      },
      error: (err) => {
        console.error('Hiba a device lekéréskor:', err);
      },
    });
  }

  getSeverity(status: 'active' | 'error' | 'inactive'): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'error':
        return 'danger';
      case 'inactive':
        return 'info';
      default:
        return 'warning';
    }
  }

  customSort(event: SortEvent) {
    if (!event.data || !event.field) return;

    event.data.sort((a, b) => {
      const value1 = a[event.field!];
      const value2 = b[event.field!];

      let result = 0;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order! * result);
    });
  }

  first: number = 0;

  pageChange(event: any) {
    this.first = event.first;
    // Esetleg itt hívhatod újra a backendet (ha nem client-side page van)
  }

  isFirstPage(): boolean {
    return this.first === 0;
  }

  isLastPage(): boolean {
    return this.first + 10 >= this.devices.length; // 10 = rows
  }

  prev() {
    this.first = this.first - 10;
  }

  next() {
    this.first = this.first + 10;
  }

  showAddDeviceForm() {
    this.displayDeviceForm = true;
    console.log('Dialógus nyitva');
  }

  onFormDialogHide() {
    this.displayDeviceForm = false;
    console.log('Dialógus bezárva');
  }

  onDeviceSaved(device: Device) {
    this.displayDeviceForm = false;
    console.log('Eszköz mentve:', device);
    this.loadDevices();
  }

  editDevice(device: any) {
    console.log("editedDevice name " + device.name);
    console.log("editedDevice status " + device.status);
  }

  deleteDevice(device: any) {
    console.log("deleteDevice name " + device.name);
    console.log("deleteDevice status " + device.status);
  }}
