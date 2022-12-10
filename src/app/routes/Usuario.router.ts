import { Router, Request, Response } from 'express';
import { disableUser, getUser } from '../services/Usuario.service';

const UsuariosRouter: Router = Router();

//OBTENER USUARIO
UsuariosRouter.get('/:idUser', async (req: Request<{idUser: string}>, res: Response) => {
  const { idUser }: {idUser: string} = req.params;

  try {
    res.status(200).json(await getUser(idUser));
  } catch(e: any) {
    res.status(e.error).json(e);
  }
});

//DESHABILITAR USUARIO
UsuariosRouter.put('/deshabilitar/:idUser', async (req: Request<{idUser: string}, {}, {}, {habilitar: string}>, res: Response) => {
  const { idUser }: {idUser: string} = req.params;
  const { habilitar }: {habilitar: string} = req.query;

  try {
    res.status(200).json(await disableUser(idUser, +habilitar));
  } catch(e: any) {
    res.status(e.error).json(e);
  }
});

export default UsuariosRouter;