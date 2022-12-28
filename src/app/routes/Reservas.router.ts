import { Router, Request, Response } from 'express';
import { getReservas, getReservaDetalle, getReservasByUserId, getReservasByCampingId } from '../services/Reservas.service';
import { checkoutUser } from '../services/CheckoutUser.service';

const ReservasRouter: Router = Router();

// http://localhost:3001/api/reservas
ReservasRouter.get('/', async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getReservas())
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/reservas` });
  }
});
//http://localhost:3001/api/reservas/:campingId
ReservasRouter.get('/:campingId', async (req: Request<{ campingId: string }>, res: Response) => {
  const { campingId }: { campingId: string } = req.params;

  try {
    res.status(200).json(await getReservasByCampingId(campingId))
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/reservas/campingId` });
  }
}); 

//http://localhost:3001/api/reservas/usuarios/:userId
ReservasRouter.get('/usuarios/:userId', checkoutUser, async (req: Request<{ userId: string }>, res: Response) => {
  const { userId }: { userId: string } = req.params;

  try {
    res.status(200).json(await getReservasByUserId(userId))
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/reservas/userId` });
  }
});


//http://localhost:3001/api/reservas/detalle/:idReserva
ReservasRouter.get('/detalle/:reservaId', async (req: Request<{ reservaId: string }>, res: Response) => {
  const { reservaId }: {reservaId: string } = req.params;
  try {
    res.status(200).json(await getReservaDetalle(reservaId))
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/reservas/detalle/:idReserva` });
  }
});

export default ReservasRouter;