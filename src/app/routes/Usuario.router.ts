import { Router, Request, Response } from 'express';
import { checkoutAdmin, checkoutUser } from '../services/CheckoutUser.service';
import { disableUser, getUser, updateUser } from '../services/Usuario.service';

const UsuariosRouter: Router = Router();

//OBTENER USUARIO
UsuariosRouter.get('/:userId', async (req: Request<{userId: string}>, res: Response) => {
  const { userId }: {userId: string} = req.params;

  try {
    res.status(200).json(await getUser(userId));
  } catch(e: any) {
    res.status(e.error || 404).json(e);
  }
});

//DESHABILITAR USUARIO
UsuariosRouter.put('/deshabilitar/:idUser', checkoutUser, checkoutAdmin, async (req: Request<{userId: string}, {}, {}, {habilitar: string}>, res: Response) => {
  const { userId }: {userId: string} = req.params;
  const { habilitar }: {habilitar: string} = req.query;

  try {
    res.status(200).json(await disableUser(userId, +habilitar));
  } catch(e: any) {
    res.status(e.error || 404).json(e);
  }
});

UsuariosRouter.put('/actualizar', checkoutUser, async (req: Request<{} , {}, { userId: number, token: string, user: any}, any>, res: Response) => {
  try {
    const { userId, token } = req.body;
    const { id, tipo }: { id: number, tipo: string } = req.body.user;

    if(userId !== id && String(tipo) !== process.env.TIPO_ADMIN ) 
      throw { error: 401, message: 'Acceso denegado.' }

    res.status(200).json(await updateUser(req.query, userId, token));
  } catch(e: any) {
    res.status(e.error || 404).json(e);
  }
});

export default UsuariosRouter;