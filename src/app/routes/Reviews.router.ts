import { Router, Request, Response } from "express";
import {
  getCampingReviews,
  postReviewsCreate,
} from "../services/Reviews.service";
import { createReview } from "../types/datosReviews";
import { verify } from "jsonwebtoken";

const ReviewsRouter: Router = Router();

//http://localhost:3001/api/reviews/8
ReviewsRouter.get(
  "/:idCamping",
  async (req: Request<{ idCamping: number }>, res: Response) => {
    const { idCamping } = req.params;

    try {
      res.status(200).json(await getCampingReviews(idCamping));
    } catch {
      res.status(404).json({
        error: `no se pudo en http://localhost/api/reviews/${idCamping}`,
      });
    }
  }
);

//CREA UNA REVIEW
// POST -> http://localhost:3001/api/reviews/
ReviewsRouter.post("/", async (req: Request<createReview>, res: Response) => {
  const { email }: { email: string } = req.body;

  verify(email, process.env.SECRET as string);

  try {
    res.status(200).json(await postReviewsCreate(req.body));
  } catch (e: any) {
    res.status(e.error || 400).json(e);
  }
});

export default ReviewsRouter;
