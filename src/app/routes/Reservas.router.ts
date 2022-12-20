import { Router, Request, Response } from 'express';
import { getReservas, getReservaDetalle, getReservasByUserId, getReservasByCampingId } from '../services/Reservas.service';

const ReservasRouter: Router = Router();

ReservasRouter.get('/', async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getReservas())
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/reservas` });
  }
});

ReservasRouter.get('/:campingId', async (req: Request<{ campingId: string }>, res: Response) => {
  const { campingId }: { campingId: string } = req.params;

  try {
    res.status(200).json(await getReservasByCampingId(campingId))
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/reservas` });
  }
});

ReservasRouter.get('/usuarios/:userId', async (req: Request<{ userId: string }>, res: Response) => {
  const { userId }: { userId: string } = req.params;

  try {
    res.status(200).json(await getReservasByUserId(userId))
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/reservas` });
  }
});

ReservasRouter.get('/detalle', async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getReservaDetalle())
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/reservas` });
  }
});

export default ReservasRouter;