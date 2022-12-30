import { Router, Request, Response } from 'express';
import { reservaCreate } from '../types/reservas';
import { 
    getReservas, 
    getReservaDetalle, 
    getReservasByUserId, 
    getReservasByCampingId,
    postReservaCreate, 
    putEstadoReserva } from '../services/Reservas.service';
import { checkoutUser } from '../services/CheckoutUser.service';


const ReservasRouter: Router = Router();


//http://localhost:3001/api/reservas/create
ReservasRouter.post('/create', async (req: Request<reservaCreate>, res: Response) => {

  try {
    let body = req.body 
    let ingreso1 = body.validate.alldate.slice(0, 10).replace("-", '/').replace("-", '/')
    let ingreso2 = body.validate.alldate2.slice(0, 10).replace("-", '/').replace("-", '/')
    let trailer = body.validate.stay > 0 ?  1 : 0 
  
    let data = {
      "fecha_desde_reserva" : ingreso1,
      "fecha_hasta_reserva" : ingreso2,
      "cant_noches" : body.validate.total,
      "total" : body.price,
      "UsuarioId" : body.user.id, 
      "CampingId" : body.campId,
      "cantMayores" : body.validate.travellers,
      "cantMenores" : body.validate.kids,
      "extraRodante" : trailer,
      "precioMayores" : body.mayores[0].precio,
      "precioMenores" : body.menores[0].precio, 
      "precioextraRodante" : body.validate.stay,
    }
    res.status(200).json(await postReservaCreate(data))
  } catch(error: any) {
    res.status(error.error).json(error);
  }
});


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

ReservasRouter.put('/:reservaId', checkoutUser, async (req: Request<{reservaId: string }>, res: Response) => {
  const { reservaId }: {reservaId: string } = req.params;
  const { newEstado }: { newEstado: string } = req.body;

  try {
    res.status(200).json(await putEstadoReserva(reservaId, newEstado))
  } catch(e: any) {
    res.status(e.error || 400).json(e);
  }
});

export default ReservasRouter;