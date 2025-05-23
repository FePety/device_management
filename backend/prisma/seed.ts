import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedDevice = {
    name: string;
    type: string;
    ip: string;
    status: 'active' | 'inactive' | 'error';
    location: string;
};

async function main() {
    const statuses: SeedDevice['status'][] = ['active', 'inactive', 'error'];

    const devices: SeedDevice[] = Array.from({ length: 20 }, (_, i) => ({
        name: `Device ${i + 1}`,
        type: 'sensor',
        ip: `192.168.1.${i + 1}`,
        status: statuses[i % statuses.length],
        location: `Room ${Math.floor(i / 5) + 1}`,
    }));

    // Check if the device table exists, and if yes, delete existing data
    try {
        await prisma.device.deleteMany();
        console.log('Old devices deleted.');
    } catch (error) {
        console.warn('Device table does not exist in the database or is not accessible, so nothing was deleted.');
    }

    // Add devices (only if the model exists)
    for (const device of devices) {
        try {
            await prisma.device.create({ data: device });
        } catch (error) {
            console.warn('Failed to create device, the device model might not exist.', error);
            break; // Exit as it makes no sense to continue trying
        }
    }

    console.log('✔️  Attempted to seed 20 devices.');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
