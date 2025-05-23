import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeviceTableComponent } from '../components/device-table/device-table.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [
    CommonModule,
    RouterOutlet,
    DeviceTableComponent
  ],
})
export class LayoutComponent {}
