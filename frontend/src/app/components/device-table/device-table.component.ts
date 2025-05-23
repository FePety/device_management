import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {CommonModule} from '@angular/common';
import {Device} from '../../shared/models/device.model';
import {DeviceService} from '../../services/device.service';
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
  styleUrls: ['./device-table.component.scss'],
  templateUrl: './device-table.component.html',
})
export class DeviceTableComponent {
  @Input() devices: Device[] = [];
  @Output() deviceSaved = new EventEmitter<{ device: Device, action: 'add' | 'update' | 'delete' }>();

  displayDeviceForm = false;
  editedDevice: Device | null = null;

  constructor(private deviceService: DeviceService) {}

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
    const action = this.editedDevice ? 'update' : 'add';
    this.deviceSaved.emit({ device, action });
  }

  editDevice(device: Device) {
    this.editedDevice = { ...device };
    this.displayDeviceForm = true;
  }

  deleteDevice(device: any) {
    if (confirm('Biztosan törölni szeretnéd ezt az eszközt?')) {
      this.deviceService.deleteDevice(device.id).subscribe({
        next: () => {
          this.deviceSaved.emit({ device, action: 'delete' });
        },
        error: err => {
          console.error('Hiba történt a törlés során:', err);
          alert('Hiba történt az eszköz törlése közben!');

        }
      });
    }
  }}
