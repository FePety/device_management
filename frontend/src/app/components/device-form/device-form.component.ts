import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core'; // Importáld az Output-ot és EventEmitter-t
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
  // styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {
  @Input() device: Device | null = null;
  @Output() deviceSaved = new EventEmitter<Device>();
  deviceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService
  ) {}

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

  ngOnChanges() {
    if (this.device && this.deviceForm) {
      this.deviceForm.patchValue(this.device);
    }
  }

  onSubmit(): void {
    console.log("submit form")
    if (this.deviceForm.valid) {
      const device: Device = this.deviceForm.value;
      this.deviceService.createDevice(device).subscribe({
        next: res => {
          console.log('Mentés sikeres!');
          this.deviceSaved.emit(res);
          this.deviceForm.reset();
        },
        error: err => console.error('Hiba:', err)
      });
    }
  }
}
