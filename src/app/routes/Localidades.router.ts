import { Router, Request, Response } from 'express';
import { checkoutAdmin, checkoutUser } from '../services/CheckoutUser.service';
import { getLocalidades, postLocalidades } from '../services/Localidades.service';
import createLocalidad from '../types/datosLocalidades';

const LocalidadesRouter: Router = Router();

LocalidadesRouter.get('/:idProvincia', async (req: Request<{ idProvincia: string }>, res: Response) => {
  const { idProvincia } = req.params;

  try {
    res.status(200).json(await getLocalidades(idProvincia))
  } catch {
    res.status(404).json({ error: 'no se pudo en http://localhost/api/localidades' });
  }
});


LocalidadesRouter.post('/', checkoutUser, checkoutAdmin, async (req: Request<{}, createLocalidad>, res: Response) => {

  try {
    res.status(200).json(await postLocalidades(req.body))
  } catch (error: any) {
    res.status(error.error).json(error);
  }
});

export default LocalidadesRouter;