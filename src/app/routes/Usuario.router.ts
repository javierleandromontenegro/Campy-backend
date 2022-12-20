import { Router, Request, Response } from 'express';
import { checkoutAdmin, checkoutUser } from '../services/CheckoutUser.service';
import { disableUser, getUser, updateUser, getAllUsuariosState, changeUserType } from '../services/Usuario.service';

const UsuariosRouter: Router = Router();

UsuariosRouter.get('/habilitacion', async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getAllUsuariosState())
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/usuarios/habilitacion` });
  }
});

UsuariosRouter.put('/tipo/:userId', checkoutUser, checkoutAdmin, async (req: Request<{ userId: string }, { userType: string }>, res: Response) => {
  const { userId }: { userId: string } = req.params;
  const { userType }: { userType: string } = req.body;

  try {
    res.status(200).json(await changeUserType(userId, userType))
  } catch {
    res.status(404).json({ error: `no se pudo en http://localhost/api/usuarios/tipo` });
  }
});

//OBTENER USUARIO
UsuariosRouter.get('/:idUser', async (req: Request<{ idUser: string }>, res: Response) => {
  const { idUser }: { idUser: string } = req.params;

  try {
    res.status(200).json(await getUser(idUser));
  } catch (e: any) {
    res.status(e.error || 404).json(e);
  }
});

//DESHABILITAR USUARIO
UsuariosRouter.put('/deshabilitar/:idUser', checkoutUser, checkoutAdmin, async (req: Request<{ idUser: string }, {}, {}, { habilitar: string }>, res: Response) => {
  const { idUser }: { idUser: string } = req.params;
  const { habilitar }: { habilitar: string } = req.query;

  try {
    res.status(200).json(await disableUser(idUser, +habilitar));
  } catch (e: any) {
    res.status(e.error || 404).json(e);
  }
});

UsuariosRouter.put('/actualizar', checkoutUser, async (req: Request<{}, {}, { userId: number, token: string, user: any }, any>, res: Response) => {
  try {
    const { userId, token } = req.body;
    const { id, tipo }: { id: number, tipo: string } = req.body.user;

    if (userId !== id && String(tipo) !== process.env.TIPO_ADMIN)
      throw { error: 401, message: 'Acceso denegado.' }

    res.status(200).json(await updateUser(req.query, userId, token));
  } catch (e: any) {
    res.status(e.error || 404).json(e);
  }
});

export default UsuariosRouter;