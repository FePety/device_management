import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import lockManager from '../services/lockManager';
import { Device as PrismaDevice } from '@prisma/client';

const prisma = new PrismaClient();

// Get all devices
export const getAllDevices = async (req: Request, res: Response): Promise<void> => {
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

// Lock a device
export const lockDevice = async (req: Request, res: Response): Promise<void> => {
    const deviceId = parseInt(req.params.id);
    const userId = req.body.userId;

    if (!userId) {
        res.status(400).json({ error: 'Missing userId in the request.' });
        return;
    }

    try {
        const locked = await lockManager.lockDevice(deviceId, userId);
        if (locked) {
            res.status(200).json({ success: true });
        } else {
            const currentUser = await lockManager.getLocker(deviceId);
            res.status(423).json({ error: 'Already locked', lockedBy: currentUser });
        }
    } catch (err) {
        console.error('Locking error:', err);
        res.status(500).json({ error: 'Server error during locking.' });
    }
};

// Unlock a device
export const unlockDevice = async (req: Request, res: Response): Promise<void> => {
    const deviceId = parseInt(req.params.id);
    const userId = req.body.userId;
    const force: boolean = req.body.force ?? false;

    if (!userId) {
        res.status(400).json({ error: 'Missing userId in the request.' });
        return;
    }

    try {
        const unlocked = await lockManager.unlockDevice(deviceId, userId, force);
        if (unlocked) {
            res.status(200).json({ success: true });
        } else {
            res.status(403).json({ error: 'Failed to unlock the device.' });
        }
    } catch (err) {
        console.error('Unlock error:', err);
        res.status(500).json({ error: 'Server error while unlocking.' });
    }
};
