import { Router, Request, Response } from 'express';
import { registerUser } from '../services/Register.service';
import datosUsuario from '../types/datosUsuario';

const RegisterRouter: Router = Router();

RegisterRouter.post('/', async (req: Request<datosUsuario>, res: Response) => {
  try {
    res.status(201).json(await registerUser(req.body));
  } catch(e) {
    console.log("error", e)
    res.status(400).json(e)
  }
});

export default RegisterRouter;
