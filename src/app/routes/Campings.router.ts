import { Router, Request, Response } from 'express';
import { getCampingsPorLocalidad, getCampingsPorProvincia, getCampingsPorId } from '../services/Campings.service';

const campingsRouter: Router = Router();

campingsRouter.get('/provincias/:idProvincia', async (req: Request<{idProvincia: string}>, res: Response) => {
  const { idProvincia } = req.params;

  try {
    res.status(200).json(await getCampingsPorProvincia(idProvincia))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/campings/sprovincias/${idProvincia}`});
  }
});



campingsRouter.get('/localidades/:idLocalidad', async (req: Request<{idLocalidad: string}>, res: Response) => {
  const { idLocalidad } = req.params;

  try {
    res.status(200).json(await getCampingsPorLocalidad(idLocalidad))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/localidades/${idLocalidad}`});
  }
});



campingsRouter.get('/:idCamping', async (req: Request<{idCamping: string}>, res: Response) => {
  const { idCamping } = req.params;

  try {
    res.status(200).json(await getCampingsPorId(idCamping))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/${idCamping}`});
  }
});



export default campingsRouter;