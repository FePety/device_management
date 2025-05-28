import { DeviceService } from '../services/device.service';

const deviceService = new DeviceService();
const UPDATE_INTERVAL_MS = 4000;

export function startStatusUpdater(): void {
    setInterval(async () => {
        try {
            await deviceService.updateAllDeviceStatuses();
        } catch (error) {
            console.error('Hiba az automatikus státuszfrissítésben:', error);
        }
    }, UPDATE_INTERVAL_MS);
}