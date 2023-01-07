import { sign } from "jsonwebtoken";
import nodemailer from "nodemailer";
import { getTemplateReview } from "./templatesHTML";

const { sequelize } = require("../db");

export async function sendEmail({
  userEmail,
  subject,
  html,
}: {
  userEmail: string;
  subject: string;
  html: string;
}): Promise<void> {
  try {
    const { EMAIL, EMAIL_PASSWORD } = process.env;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Campy" <${EMAIL}>`,
      to: userEmail,
      subject,
      html,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export const sendFormReview = async () => {
  const [querySql]: [
    querySql: {
      id: number;
      UsuarioId: number;
      CampingId: number;
      email: string;
      username: string;
    }[]
  ] = await sequelize.query(`
      SELECT R.id, R.UsuarioId, R.CampingId, R.EstadoReservaId, U.email, U.username FROM Reservas AS R
      INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
      WHERE EstadoReservaId='${process.env.ABONADA}' AND Form_enviado=0 AND R.fecha_hasta_reserva <= NOW();
  `);

  querySql.map((sql) => {
    sendEmail({
      userEmail: sql.email,
      subject: "Llenar formulario de review de camping.",
      html: getTemplateReview(
        String(sql.CampingId),
        String(sql.UsuarioId),
        sign({ email: sql.email }, String(process.env.SECRET)),
        sql.username
      ),
    });

    sequelize.query(`
      UPDATE Reservas SET Form_enviado=1 WHERE id=${sql.id}
    `);
  });
};

export const dueDate = async () => {
  await sequelize.query(`
    UPDATE Reservas SET EstadoReservaId='${process.env.VENCIDA}' WHERE NOW() >= DATE_ADD(createdAt, INTERVAL 1 DAY);
  `);
};
