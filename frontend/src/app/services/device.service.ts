import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {Device} from '../shared/models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = `${environment.apiUrl}/devices`;

  constructor(private http: HttpClient) { }

  createDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(this.apiUrl, device);
  }

  getAllDevices(): Observable<Device[]> {
    //console.log("getAllDevices");
    return this.http.get<Device[]>(this.apiUrl);
  }
}
