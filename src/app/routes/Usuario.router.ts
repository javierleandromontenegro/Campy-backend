import { Router, Request, Response } from "express";
import { checkoutAdmin, checkoutUser } from "../jwt/CheckoutUser";
import {
  disableUser,
  getUser,
  updateUser,
  getAllUsuariosState,
  changeUserType,
  changePasswordByMail,
  changePasswordByToken,
} from "../services/Usuario.service";

const UsuariosRouter: Router = Router();

UsuariosRouter.get("/habilitacion", async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getAllUsuariosState());
  } catch {
    res.status(404).json({
      error: `no se pudo en http://localhost/api/usuarios/habilitacion`,
    });
  }
});

//OBTENER USUARIO
UsuariosRouter.get(
  "/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    const { userId }: { userId: string } = req.params;

    try {
      res.status(200).json(await getUser(+userId));
    } catch (e: any) {
      res.status(e.error || 404).json(e);
    }
  }
);

UsuariosRouter.get(
  "/password/:email",
  async (req: Request<{ email: string }>, res: Response) => {
    const { email } = req.params;

    try {
      res.status(200).json(await changePasswordByMail(email));
    } catch (e: any) {
      res.status(e.error || 404).json(e);
    }
  }
);

UsuariosRouter.post(
  "/password",
  async (
    req: Request<{}, {}, { token: string; password: string }>,
    res: Response
  ) => {
    const { token, password } = req.body;

    try {
      res.status(200).send(await changePasswordByToken(token, password));
    } catch (e: any) {
      res.status(e.error || 404).json(e);
    }
  }
);

UsuariosRouter.put(
  "/tipo/:userId",
  checkoutUser,
  checkoutAdmin,
  async (
    req: Request<{ userId: string }, { userType: string }>,
    res: Response
  ) => {
    const { userId }: { userId: string } = req.params;
    const { userType }: { userType: string } = req.body;

    try {
      res.status(200).json(await changeUserType(+userId, userType));
    } catch (e: any) {
      res.status(404).json(e);
    }
  }
);

//DESHABILITAR USUARIO
UsuariosRouter.put(
  "/deshabilitar/:userId",
  checkoutUser,
  checkoutAdmin,
  async (
    req: Request<{ userId: string }, {}, {}, { habilitar: string }>,
    res: Response
  ) => {
    const { userId }: { userId: string } = req.params;
    const { habilitar }: { habilitar: string } = req.query;

    try {
      res.status(200).json(await disableUser(+userId, +habilitar));
    } catch (e: any) {
      res.status(e.error || 404).json(e);
    }
  }
);

UsuariosRouter.put(
  "/actualizar",
  checkoutUser,
  async (
    req: Request<{}, {}, { userId: number; user: any }, any>,
    res: Response
  ) => {
    try {
      const { userId } = req.body;
      const authorization: string = req.headers.authorization as string;
      const { id, tipo }: { id: number; tipo: string } = req.body.user;

      if (userId !== id && tipo !== (process.env.TIPO_ADMIN as string))
        throw { error: 401, message: "Acceso denegado." };

      res.status(200).json(await updateUser(req.query, userId, authorization));
    } catch (e: any) {
      res.status(e.error || 404).json(e);
    }
  }
);

export default UsuariosRouter;
