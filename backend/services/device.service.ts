import prisma from '../models/prismaClient';
import { Device, Status } from '@prisma/client';
import { IDeviceService } from '../interfaces/device.interface';

export class DeviceService implements IDeviceService {
    async getAllDevices(): Promise<Device[]> {
        return prisma.device.findMany({ orderBy: { id: 'asc' } });
    }

    async createDevice(data: Omit<Device, 'id' | 'status'>): Promise<Device> {
        if (!data.name || !data.type || !data.ip || !data.location) {
            throw new Error('Minden mező kitöltése kötelező!');
        }
        return prisma.device.create({
            data: { ...data, status: 'inactive' }
        });
    }

    async updateDevice(id: number, data: Partial<Device>): Promise<Device> {
        if (data.status && !Object.values(Status).includes(data.status)) {
            throw new Error('Érvénytelen státusz!');
        }
        return prisma.device.update({ where: { id }, data });
    }

    async deleteDevice(id: number): Promise<void> {
        await prisma.device.delete({ where: { id } });
    }


    // Véletlenszerű státusz generálása
    private getRandomStatus(): Status {
        const VALID_STATUSES: Status[] = [
            Status.active,
            Status.inactive,
            Status.error
        ];
        return VALID_STATUSES[Math.floor(Math.random() * VALID_STATUSES.length)];
    }

    // Összes eszköz státuszának frissítése
    async updateAllDeviceStatuses(): Promise<void> {
        try {
            const devices = await prisma.device.findMany();
            if (!devices.length) {
                console.warn('[CRON] Nincs frissíthető eszköz!');
                return;
            }

            const updatePromises = devices.map(device =>
                prisma.device.update({
                    where: { id: device.id },
                    data: { status: this.getRandomStatus() }
                })
            );

            await Promise.all(updatePromises);
            console.log(`[CRON] ${updatePromises.length} eszköz státusza frissítve.`);
        } catch (error) {
            console.error('[CRON] Hiba a státuszok frissítésekor:', error);
            throw new Error('Nem sikerült frissíteni a státuszokat');
        }
    }
}
