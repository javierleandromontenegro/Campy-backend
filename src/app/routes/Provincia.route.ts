import { Router, Request, Response } from "express";
import {
  getProvincias,
  getProvinciasCantCampings,
} from "../services/Provincias.service";

const ProvinciaRouter: Router = Router();

ProvinciaRouter.get("/campings", async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getProvinciasCantCampings());
  } catch {
    res
      .status(404)
      .json({
        error: "no se pudo en http://localhost/api/provincias/campings",
      });
  }
});

ProvinciaRouter.get(
  "/:idPais",
  async (req: Request<{ idPais: string }>, res: Response) => {
    const { idPais } = req.params;

    try {
      res.status(200).json(await getProvincias(+idPais));
    } catch {
      res
        .status(404)
        .json({ error: "no se pudo en http://localhost/api/provincias" });
    }
  }
);

export default ProvinciaRouter;
