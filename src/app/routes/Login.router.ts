import { Router, Request, Response } from 'express';
import { loginUser, loginUserWithToken } from '../services/Login.service';

const LoginRouter: Router = Router();

LoginRouter.post('/', loginUserWithToken, async (req: Request, res: Response) => {
    try {
      res.status(200).json(await loginUser(req.body));
    } catch(e: any) {
      res.status(e.error).json(e);
    }
});

export default LoginRouter;