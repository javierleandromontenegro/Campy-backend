import { Router, Request, Response } from "express";
import { sendEmail } from "../email/sendEmail";
import templateContactUser from "../email/templateContactUser";
import templateContactAdmin from "../email/templateContactAdmin";
import { datosEmailContact } from "../types/datosEmailContact";

const SendEmailRouter: Router = Router();

SendEmailRouter.post(
  "/",
  async (req: Request<{}, datosEmailContact>, res: Response) => {
    try {
      await Promise.all([
        sendEmail({
          userEmail: String(process.env.EMAIL),
          subject: req.body.subject,
          html: templateContactAdmin(req.body),
        }),
        sendEmail({
          userEmail: req.body.email,
          subject: "Consulta enviada con éxito",
          html: templateContactUser(req.body.name),
        }),
      ]);

      res.status(200).json({ success: true });
    } catch (e: any) {
      res.status(e.error || 400).json(e);
    }
  }
);

export default SendEmailRouter;
