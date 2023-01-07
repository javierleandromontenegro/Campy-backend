import { Router, Request, Response } from "express";
import { sendEmail } from "../email/sendEmail";
import {
  getTemplateContactAdmin,
  getTemplateContactUser,
} from "../email/templatesHTML";
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
          html: getTemplateContactAdmin(req.body),
        }),
        sendEmail({
          userEmail: req.body.email,
          subject: "Consulta enviada con éxito",
          html: getTemplateContactUser(req.body.name),
        }),
      ]);

      res.status(200).json({ success: true });
    } catch (e: any) {
      res.status(e.error || 400).json(e);
    }
  }
);

export default SendEmailRouter;
