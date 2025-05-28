import { DeviceService } from '../services/device.service';

const deviceService = new DeviceService();

export function startStatusUpdater(intervalMs = 4000): void {
    setInterval(async () => {
        try {
            await deviceService.updateAllDeviceStatuses();
        } catch (error) {
            console.error('Hiba az automatikus státuszfrissítésben:', error);
        }
    }, intervalMs);
}