import { Router, Request, Response } from 'express';
import { createCamping } from '../types/datosCamping';
import { getCampingsPorLocalidad, getCampingsPorProvincia, getCampingsPorId, getCampingsImagenes, postCampingsCreate } from '../services/Campings.service';

const CampingsRouter: Router = Router();

CampingsRouter.get('/provincias/:idProvincia', async (req: Request<{idProvincia: string}>, res: Response) => {
  const { idProvincia } = req.params;

  try {
    res.status(200).json(await getCampingsPorProvincia(idProvincia))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/campings/sprovincias/${idProvincia}`});
  }
});



CampingsRouter.get('/localidades/:idLocalidad', async (req: Request<{idLocalidad: string}>, res: Response) => {
  const { idLocalidad } = req.params;

  try {
    res.status(200).json(await getCampingsPorLocalidad(idLocalidad))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/localidades/${idLocalidad}`});
  }
});



CampingsRouter.get('/:idCamping', async (req: Request<{idCamping: string}>, res: Response) => {
  const { idCamping } = req.params;

  try {
    res.status(200).json(await getCampingsPorId(idCamping))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/${idCamping}`});
  }
});


CampingsRouter.get('/imagenes/:idCamping', async (req: Request<{idCamping: string}>, res: Response) => {
  const { idCamping } = req.params;

  try {
    res.status(200).json(await getCampingsImagenes(idCamping))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/imagenes/${idCamping}`});
  }
});

CampingsRouter.post('/', async (req: Request<createCamping>, res: Response) => {

  try {
    res.status(200).json(await postCampingsCreate(req.body))
  } catch(error: any) {
    res.status(error.error).json(error);
  }
});

export default CampingsRouter;