import { Router } from 'express';
import * as deviceController from '../controllers/deviceController';

const router = Router();

router.get('/devices', deviceController.getAllDevices);
router.post('/devices', deviceController.createDevice);
router.put('/devices/:id', deviceController.updateDevice);
router.delete('/devices/:id', deviceController.deleteDevice);

export default router;
