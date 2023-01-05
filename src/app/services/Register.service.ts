import { datosUsuario } from "../types/datosUsuario";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import sendEmail from "../email/sendEmail";
import { getTemplateRegister } from "../email/templatesHTML";

const { sequelize, Usuarios } = require("../db");

export const registerUser = async ({
  email,
  clave,
  username,
}: datosUsuario): Promise<datosUsuario> => {
  if (!email || !clave || !username)
    throw {
      error: 406,
      message: "Faltan parámetros necesarios.",
    };

  const findUser = await Usuarios.findOne({ where: { email } });

  if (findUser)
    throw {
      error: 406,
      message: "Ese correo ya se encuentra registrado.",
    };

  const [userRegisteredId]: [userRegisteredId: number] = await sequelize.query(
    `INSERT INTO Usuarios (email, clave, username, TipoUsuarioId, createdAt, updatedAt) VALUES ('${email}', '${await hash(
      clave,
      8
    )}', '${username}', '${process.env.TIPO_USUARIO}', NOW(), NOW())`
  );

  const [[createdUser]]: [createdUser: datosUsuario[]] = await sequelize.query(
    `SELECT id, email, clave, username, numero_celular, direccion, dni, foto, TipoUsuarioId AS tipo FROM Usuarios WHERE id=${userRegisteredId};`
  );

  const token: string = getToken(createdUser);

  const html: string = getTemplateRegister(
    createdUser.username,
    token,
    Number(createdUser.id)
  );

  await sendEmail({
    userEmail: createdUser.email,
    subject: "Confirmá tu cuenta de google",
    html,
  });

  console.log(createdUser);
  return createdUser;
};

function getToken(data: datosUsuario) {
  return jwt.sign(data, String(process.env.SECRET), { expiresIn: "12h" });
}
