import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Device as PrismaDevice } from '@prisma/client';

const prisma = new PrismaClient();

// Get all devices
export const getAllDevices = async (req: Request, res: Response): Promise<void> => {
    console.log("getAllDevices");
    try {
        const devices: PrismaDevice[] = await prisma.device.findMany({
            orderBy: { id: 'asc' },
        });
        res.status(200).json(devices);
    } catch (err) {
        console.error('Error while fetching devices:', err);
        res.status(500).json({ error: 'Server error: Unable to fetch devices.' });
    }
};

// Create a new device
export const createDevice = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, type, ip, location } = req.body;

        if (!name || !type || !ip || !location) {
            res.status(400).json({ error: 'Missing fields: name, type, ip, and location are all required.' });
            return;
        }
        const newDevice = await prisma.device.create({
            data: {
                name,
                type,
                ip,
                location,
                status: 'inactive',
            },
        });
        res.status(201).json(newDevice);
    } catch (err) {
        console.error('Error while creating device:', err);
        res.status(500).json({ error: 'Failed to create device.' });
    }
};

// Update a device
export const updateDevice = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, type, ip, location, status } = req.body;

    try {
        // Checked data
        const existingDevice = await prisma.device.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingDevice) {
            res.status(404).json({ error: 'Device not found.' });
            return;
        }

        // Update data
        const updatedDevice = await prisma.device.update({
            where: { id: parseInt(id) },
            data: {
                name: name || existingDevice.name,
                type: type || existingDevice.type,
                ip: ip || existingDevice.ip,
                location: location || existingDevice.location,
                status: status || existingDevice.status,
            },
        });

        res.status(200).json(updatedDevice);
    } catch (err) {
        console.error('Error while updating device:', err);
        res.status(500).json({ error: 'Failed to update device.' });
    }
};

// Delete a device
export const deleteDevice = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await prisma.device.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (err) {
        console.error('Error while deleting device:', err);
        res.status(404).json({ error: 'Device not found.' });
    }
};

