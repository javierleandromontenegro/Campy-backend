import { Router, Request, Response } from "express";
import { reservaCreate } from "../types/reservas";
import {
  getReservas,
  getReservaDetalle,
  getReservasByUserId,
  getReservasByCampingId,
  postReservaCreate,
  getReservasByOwnerId,
} from "../services/Reservas.service";
import {
  checkoutOwnerOrAdmin,
  checkoutUser,
} from "../services/CheckoutUser.service";

const ReservasRouter: Router = Router();

//http://localhost:3001/api/reservas/create
ReservasRouter.post(
  "/create",
  async (req: Request<reservaCreate>, res: Response) => {
    try {
      res.status(200).json(await postReservaCreate(req.body));
    } catch (error: any) {
      res.status(error.error).json(error);
    }
  }
);

// http://localhost:3001/api/reservas
ReservasRouter.get("/", async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getReservas());
  } catch {
    res
      .status(404)
      .json({ error: `no se pudo en http://localhost/api/reservas` });
  }
});

//http://localhost:3001/api/reservas/usuarios/:userId
ReservasRouter.get(
  "/usuarios/:userId",
  checkoutUser,
  async (req: Request<{ userId: string }>, res: Response) => {
    const { userId }: { userId: string } = req.params;

    try {
      res.status(200).json(await getReservasByUserId(userId));
    } catch {
      res
        .status(404)
        .json({ error: `no se pudo en http://localhost/api/reservas/userId` });
    }
  }
);

//http://localhost:3001/api/reservas/campings/:campingId
ReservasRouter.get(
  "/campings/:campingId",
  checkoutUser,
  checkoutOwnerOrAdmin,
  async (req: Request<{ campingId: string }>, res: Response) => {
    const { campingId }: { campingId: string } = req.params;

    try {
      res.status(200).json(await getReservasByCampingId(campingId));
    } catch (e: any) {
      res.status(e.error || 400).json(e);
    }
  }
);

//http://localhost:3001/api/reservas/propietarios/:ownerId
ReservasRouter.get(
  "/propietarios/:ownerId",
  checkoutUser,
  checkoutOwnerOrAdmin,
  async (req: Request<{ ownerId: string }>, res: Response) => {
    const { ownerId }: { ownerId: string } = req.params;

    try {
      res.status(200).json(await getReservasByOwnerId(ownerId));
    } catch (e: any) {
      res.status(e.error || 400).json(e);
    }
  }
);

//http://localhost:3001/api/reservas/:campingId
ReservasRouter.get(
  "/:campingId",
  async (req: Request<{ campingId: string }>, res: Response) => {
    const { campingId }: { campingId: string } = req.params;

    try {
      res
        .status(200)
        .json(
          await getReservasByCampingId(campingId, req.query.filter === "true")
        );
    } catch {
      res.status(404).json({
        error: `no se pudo en http://localhost/api/reservas/campingId`,
      });
    }
  }
);

//http://localhost:3001/api/reservas/detalle/:idReserva
ReservasRouter.get(
  "/detalle/:reservaId",
  async (req: Request<{ reservaId: string }>, res: Response) => {
    const { reservaId }: { reservaId: string } = req.params;
    try {
      res.status(200).json(await getReservaDetalle(reservaId));
    } catch {
      res.status(404).json({
        error: `no se pudo en http://localhost/api/reservas/detalle/:idReserva`,
      });
    }
  }
);

export default ReservasRouter;
