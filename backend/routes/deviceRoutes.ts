import { Router } from 'express';
import * as deviceController from '../controllers/deviceController';

const router = Router();

router.get('/devices', deviceController.getAllDevices);
router.post('/devices', deviceController.createDevice);
router.delete('/devices/:id', deviceController.deleteDevice);
router.patch('/devices/:id/lock', deviceController.lockDevice);
router.patch('/devices/:id/unlock', deviceController.unlockDevice);

export default router;
