import { Device } from '@prisma/client';

export interface IDeviceService {
    getAllDevices(): Promise<Device[]>;
    createDevice(data: Omit<Device, 'id' | 'status'>): Promise<Device>;
    updateDevice(id: number, data: Partial<Device>): Promise<Device>;
    deleteDevice(id: number): Promise<void>;

    updateAllDeviceStatuses(): Promise<void>;
}
