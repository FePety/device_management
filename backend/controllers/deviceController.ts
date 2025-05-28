import { Request, Response } from 'express';
import { DeviceService } from '../services/device.service';

const deviceService = new DeviceService();

export const getAllDevices = async (req: Request, res: Response) => {
    try {
        const devices = await deviceService.getAllDevices();
        res.status(200).json(devices);
    } catch (err) {
        res.status(500).json({ error: 'Hiba az eszközök lekérdezésekor!' });
    }
};

export const createDevice = async (req: Request, res: Response) => {
    try {
        const { name, type, ip, location } = req.body;
        const newDevice = await deviceService.createDevice({ name, type, ip, location } as any);
        res.status(201).json(newDevice);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const updateDevice = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Hibás ID!' });

    try {
        const updatedDevice = await deviceService.updateDevice(id, req.body);
        res.status(200).json(updatedDevice);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};

export const deleteDevice = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Hibás ID!' });

    try {
        await deviceService.deleteDevice(id);
        res.status(204).send();
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};
