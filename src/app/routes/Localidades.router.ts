import { Router, Request, Response } from 'express';
import { getLocalidades } from '../services/Localidades.service';

const LocalidadesRouter: Router = Router();

LocalidadesRouter.get('/:idProvincia', async (req: Request<{idProvincia: string}>, res: Response) => {
  const { idProvincia } = req.params;

  try {
    res.status(200).json(await getLocalidades(idProvincia))
  } catch {
    res.status(404).json({error: 'no se pudo en http://localhost/api/localidades'});
  }
});

export default LocalidadesRouter;