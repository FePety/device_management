import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {CommonModule} from '@angular/common';
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

  editedDevice: Device | null = null;

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
    this.editedDevice = null;
    this.displayDeviceForm = true;
  }

  onFormDialogHide() {
    this.displayDeviceForm = false;
    this.editedDevice = null;
  }

  onDeviceSaved(device: Device) {
    this.displayDeviceForm = false;
    this.loadDevices();
  }

  editDevice(device: Device) {
    this.editedDevice = { ...device };
    this.displayDeviceForm = true;
  }

  deleteDevice(device: any) {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.deleteDevice(device.id).subscribe({
        next: () => {
          // Refresh the device list after successful deletion
          this.loadDevices();
        },
        error: err => {
          console.error('Error during deletion:', err);
          alert('An error occurred while deleting the device!');
        }
      });
    }
  }}
