import {Component, OnInit, Output, EventEmitter, Input, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../shared/models/device.model';
import {CommonModule, NgClass} from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass,
    CommonModule,
    InputTextModule,
    ButtonModule,
    MessageModule
  ],
})

export class DeviceFormComponent implements OnInit {
  @Input() device: Device | null = null;
  @Output() deviceSaved = new EventEmitter<Device>();
  deviceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService
  ) {}

  //Angular lifecycle hook called once after the component is initialized.
  ngOnInit(): void {
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      ip: ['', [Validators.required]],
      location: ['', Validators.required]
    });

    if (this.device) {
      this.deviceForm.patchValue(this.device);
    }
  }

  // Angular lifecycle hook called when input properties change.
  ngOnChanges(changes: SimpleChanges) {
    if (changes['device'] && this.device && this.deviceForm) {
      this.deviceForm.patchValue(this.device);
    }
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      const formValue: Device = this.deviceForm.value;
      if (this.device && this.device.id) {
        // UPDATE (PUT)
        const updatedDevice = { ...this.device, ...formValue };
        this.deviceService.updateDevice(updatedDevice).subscribe({
          next: res => {
            this.deviceSaved.emit(res);
            this.deviceForm.reset();
          },
          error: err => console.error('Hiba:', err)
        });
      } else {
        // CREATE (POST)
        this.deviceService.createDevice(formValue).subscribe({
          next: res => {
            this.deviceSaved.emit(res);
            this.deviceForm.reset();
          },
          error: err => console.error('Hiba:', err)
        });
      }
    }
  }
}
