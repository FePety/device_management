import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// Using Prisma enum values
const VALID_STATUSES: Status[] = [Status.active, Status.error, Status.inactive];

function getRandomStatus(): Status {
    return VALID_STATUSES[Math.floor(Math.random() * VALID_STATUSES.length)];
}

async function updateDeviceStatusesPeriodically(): Promise<void> {
    try {
        const devices = await prisma.device.findMany();

        if (devices.length === 0) {
            return;
        }

        const updatePromises: Promise<any>[] = [];
        for (const device of devices) {
            updatePromises.push(
                prisma.device.update({
                    where: { id: device.id },
                    data: { status: getRandomStatus() },
                }),
            );
        }

        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
            console.log(`${updatePromises.length} device statuses updated.`);
        }
    } catch (error) {
        console.error('Error updating device statuses in scheduled task:', error);
    }
}

// Startup function that server.ts calls once
function startStatusUpdater(intervalMs = 4000): void {
    setInterval(() => {
        updateDeviceStatusesPeriodically();
    }, intervalMs);
}

export { startStatusUpdater };
