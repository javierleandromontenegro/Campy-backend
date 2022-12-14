import { Router, Request, Response } from 'express';
import { createCamping } from '../types/datosCamping';
import { getCampingsPorLocalidad, getCampingsPorProvincia, getCampingsPorId, getCampingsImagenes, postCampingsCreate,getCampingsTodos,getCampingsCategorias, getCampingTarifas, getCampingAbiertoPeriodo, getCampingPeriodoAguaCaliente } from '../services/Campings.service';

const CampingsRouter: Router = Router();

CampingsRouter.get('/provincias/:idProvincia', async (req: Request<{idProvincia: string}>, res: Response) => {
  const { idProvincia } = req.params;

  try {
    res.status(200).json(await getCampingsPorProvincia(idProvincia))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/campings/sprovincias/${idProvincia}`});
  }
});

CampingsRouter.get('/categorias', async (_req: Request, res: Response) => { 
  try {
    res.status(200).json(await getCampingsCategorias())
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/categorias`});
  }
});

CampingsRouter.get('/tarifas', async (_req: Request, res: Response) => { 
  try {
    res.status(200).json(await getCampingTarifas())
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/tarifas`});
  }
});

CampingsRouter.get('/abierto', async (_req: Request, res: Response) => { 
  try {
    res.status(200).json(await getCampingAbiertoPeriodo())
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/abierto`});
  }
});

CampingsRouter.get('/agua_caliente', async (_req: Request, res: Response) => { 
  try {
    res.status(200).json(await getCampingPeriodoAguaCaliente())
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/agua_caliente`});
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

//TODOS LOS CAMPING CON DETALLE E IMAGENES
CampingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getCampingsTodos())
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping`});
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