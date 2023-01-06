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
ReviewsRouter.post("/", (req: Request<createReview>, res: Response) => {
  const { email }: { email: string } = req.body;

  verify(email, String(process.env.SECRET), (err, _) => {
    if (err) throw { error: 406, message: "Autorización denegada." };

    postReviewsCreate(req.body)
      .then((result) => res.status(200).json(result))
      .catch(() =>
        res
          .status(404)
          .json({ error: 400, message: "No se pudo cargar esa review" })
      );
  });
});

export default ReviewsRouter;
