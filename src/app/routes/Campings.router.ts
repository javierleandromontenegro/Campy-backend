import { Router, Request, Response } from 'express';
import { createCamping } from '../types/datosCamping';
import {checkoutUser,checkoutAdmin} from '../services/CheckoutUser.service';
import { 
  getCampingsPorLocalidad, 
  getCampingsPorProvincia, 
  getCampingsPorId, 
  postCampingsCreate,
  getCampingsTodos,
  getCampingsCategorias, 
  getCampingTarifas, 
  getCampingAbiertoPeriodo, 
  getCampingPeriodoAguaCaliente,getCampingsHabilitacion,disableCamping, getUserFavoritesCampings, addFavoriteCamping, removeFavoriteCamping 
} from '../services/Campings.service';
import {datosFiltros} from "../types/datosFiltros"

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

CampingsRouter.get('/habilitacion', async (_req: Request, res: Response) => { 
  try {
    res.status(200).json(await getCampingsHabilitacion())
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/categorias`});
  }
});

CampingsRouter.put('/habilitacion/:idCamping', checkoutUser, checkoutAdmin, async (req: Request<{idCamping: string}, {}, {}, {habilitar: string}>, res: Response) => {
  const { idCamping }: {idCamping: string} = req.params;
  const { habilitar }: {habilitar: string} = req.query;

  try {
    res.status(200).json(await disableCamping(idCamping, +habilitar));
  } catch(e: any) {
    res.status(e.error || 404).json(e);
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
CampingsRouter.post('/', async (req: Request<datosFiltros>, res: Response) => {

  try {
    res.status(200).json(await getCampingsTodos(req.body))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping`});
  }
});


CampingsRouter.post('/create', async (req: Request<createCamping>, res: Response) => {

  try {
    res.status(200).json(await postCampingsCreate(req.body))
  } catch(error: any) {
    res.status(error.error).json(error);
  }
});

/* CampingsRouter.get('/imagenes/:idCamping', async (req: Request<{idCamping: string}>, res: Response) => {
  const { idCamping } = req.params;

  try {
    res.status(200).json(await getCampingsImagenes(idCamping))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/imagenes/${idCamping}`});
  }
}); */

/* CampingsRouter.get('/tarifas/:idCamping', async (req: Request<{idCamping: string}>, res: Response) => {
  const { idCamping } = req.params;

  try {
    res.status(200).json(await getPreciosCamping(idCamping))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/camping/tarifas/${idCamping}`});
  }
}); */
CampingsRouter.post(
  '/favoritos/obtener/:userId', 
  checkoutUser, 
  async (req: Request<{userId: string}>, res: Response) => {
  const { userId }: {userId: string} = req.params;

  try {
    res.status(200).json(await getUserFavoritesCampings(userId));
  } catch(e: any) {
    console.log(e)
    res.status(e.error || 400).json(e);
  }
});

CampingsRouter.post(
  '/favoritos/agregar/:campingId', 
  checkoutUser, 
  async (req: Request<{campingId: string}, { id: string }>, res: Response) => {
  const { campingId }: {campingId: string} = req.params;
  const { id }: {id: string} = req.body.user;

  try {
    res.status(200).json(await addFavoriteCamping(campingId, id));
  } catch(e: any) {
    res.status(e.error || 400).json(e);
  }
});

CampingsRouter.delete(
  '/favoritos/remover/:campingId', 
  checkoutUser, 
  async (req: Request<{campingId: string}, { id: string }>, res: Response) => {
  const { campingId }: {campingId: string} = req.params;
  const { id }: {id: string} = req.body.user;

  try {
    res.status(200).json(await removeFavoriteCamping(campingId, id));
  } catch(e: any) {
    res.status(e.error || 400).json(e);
  }
});


export default CampingsRouter;