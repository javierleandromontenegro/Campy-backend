import { Router, Request, Response } from 'express';
import { getCampingReviews ,postReviewsCreate} from "../services/Reviews.service";
import { createReview } from '../types/datosReviews';

const ReviewsRouter: Router = Router();


//http://localhost:3001/api/reviews/8
ReviewsRouter.get('/:idCamping', async (req: Request<{idCamping: number}>, res: Response) => {
    const { idCamping } = req.params;
  
    try {
      res.status(200).json(await getCampingReviews(idCamping))
    } catch {
      res.status(404).json({error: `no se pudo en http://localhost/api/reviews/${idCamping}`});
    }
  });

//CREA UNA REVIEW
// POST -> http://localhost:3001/api/reviews/
  ReviewsRouter.post('/', async (req: Request<createReview>, res: Response) => {

    try {
      res.status(200).json(await postReviewsCreate(req.body))
    } catch {
      res.status(404).json({error: `no se pudo en http://localhost/api/reviews/`});
    }
  });

export default ReviewsRouter;