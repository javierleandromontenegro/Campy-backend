import { Router, Request, Response } from 'express';
import { getProvincias } from '../services/Provincias.service';

const ProvinciaRouter: Router = Router();

ProvinciaRouter.get('/:idPais', async (req: Request<{idPais: string}>, res: Response) => {
  const { idPais } = req.params;

  try {
    res.status(200).json(await getProvincias(idPais))
  } catch {
    res.status(404).json({error: 'no se pudo en http://localhost/api/provincias'});
  }
});

export default ProvinciaRouter;