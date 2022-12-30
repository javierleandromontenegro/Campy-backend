import { Router, Request, Response } from 'express';
import { checkoutAdmin, checkoutUser } from '../services/CheckoutUser.service';
import { getLocalidades, postLocalidades, getLocalidadesConCampings} from '../services/Localidades.service';
import createLocalidad from '../types/datosLocalidades';

const LocalidadesRouter: Router = Router();


// ESTA RUTA SOLO TRAE LAS LOCALIDADES QUE TIENEN CAMPINGS CARGADOS
//http://localhost:3001/api/localidades/ConCampings/21
LocalidadesRouter.get('/ConCampings/:idProvincia', async (req: Request<{ idProvincia: string }>, res: Response) => {
  const { idProvincia } = req.params;

  try {
    res.status(200).json(await getLocalidadesConCampings(idProvincia))
  } catch {
    res.status(404).json({ error: 'No se pudo en http://localhost:3001/api/localidades/ConCampings/idprovincia' });
  }
});


//TRAE TODAS LAS LOCALIDADES 
//SE USA EN TODAS PERO NECESITAMOS QUE SOLO LA USE EL FORM DE CREATE CAMPING
//http://localhost:3001/api/localidades/21

LocalidadesRouter.get('/:idProvincia', async (req: Request<{ idProvincia: string }>, res: Response) => {
  const { idProvincia } = req.params;

  try {
    res.status(200).json(await getLocalidades(idProvincia))
  } catch {
    res.status(404).json({ error: 'No se pudo en http://localhost/api/localidades/idprovincia' });
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