import express from 'express';
import cors from 'cors';
import deviceRoutes from './routes/deviceRoutes';
import { startStatusUpdater } from './tasks/randomStatusUpdater';

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
}));

app.use(express.json());

app.use('/api', deviceRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
  startStatusUpdater(4000);
  console.log("startStatusUpdater started.");
});
