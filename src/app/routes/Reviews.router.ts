import { Router, Request, Response } from 'express';
import { getCampingReviews } from "../services/Reviews.service";

const ReviewsRouter: Router = Router();

ReviewsRouter.get('/:idCamping', async (req: Request<{idCamping: number}>, res: Response) => {
    const { idCamping } = req.params;
  
    try {
      res.status(200).json(await getCampingReviews(idCamping))
    } catch {
      res.status(404).json({error: `no se pudo en http://localhost/api/reviews/${idCamping}`});
    }
  });

export default ReviewsRouter;