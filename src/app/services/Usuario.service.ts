import { QueryTypes } from "sequelize";
import { stateUsuario, datosUsuario } from "../types/datosUsuario";
import { allPropertiesUsuario } from "../types/Properties";
import { hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { sendEmail } from "../email/sendEmail";
import templateChangePassword from "../email/templateChangePassword";

const { sequelize } = require("../db");

export const getUser = async (id: number): Promise<datosUsuario> => {
  const user: datosUsuario[] = await sequelize.query(
    `SELECT U.id, U.email, U.username, U.foto, U.numero_celular, U.habilitado, U.dni, U.direccion, T.id AS TipoUsuarioId FROM Usuarios AS U INNER JOIN Tipo_usuarios AS T ON T.id=U.TipoUsuarioId WHERE U.id=:id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  if (!user[0])
    throw {
      error: 404,
      message: `No se encontró un usuario con el ID: ${id}`,
    };

  return user[0];
};

export const disableUser = async (
  id: number,
  habilitar: number
): Promise<{ success: boolean }> => {
  if (habilitar !== 0 && habilitar !== 1)
    throw {
      error: 406,
      message: "tipo de habilitación inválida",
    };

  const updatedUser = await sequelize.query(
    `UPDATE Usuarios SET habilitado=:habilitar WHERE id=:id;`,
    {
      replacements: { habilitar, id },
      type: QueryTypes.UPDATE,
    }
  );

  return { success: !!updatedUser.changedRows };
};

export const updateUser = async (
  data: datosUsuario,
  userId: number,
  token: string
) => {
  const entries: [key: string, value: string][] = Object.entries(data);

  if (!entries.length || entries.length > allPropertiesUsuario.length)
    throw { error: 406, message: "Información errónea en el query." };

  for (let [key] of entries)
    if (!allPropertiesUsuario.includes(key))
      throw { error: 406, message: "Propiedades inexistentes." };

  let clave: string = "";

  const querySentence = await Promise.all(
    entries.map(async (entry) => {
      if (entry[0] === "clave") clave = entry[1];
      entry[1] = `'${
        entry[0] === "clave" ? await hash(entry[1], 8) : entry[1]
      }'`;

      return entry.join("=");
    })
  ).then((res) => res.join(", "));

  await sequelize.query(`UPDATE Usuarios SET :querySentence WHERE id=:userId`, {
    replacements: { querySentence, userId },
    type: QueryTypes.UPDATE,
  });

  const [
    [
      {
        id,
        email,
        username,
        foto,
        numero_celular,
        direccion,
        dni,
        TipoUsuarioId,
      },
    ],
  ] = await sequelize.query(
    `SELECT id, email, clave, username, foto, numero_celular, direccion, dni, TipoUsuarioId FROM Usuarios WHERE id=${userId}`
  );

  if (clave) token = sign({ email, clave }, String(process.env.SECRET));

  return {
    id,
    email,
    username,
    foto,
    numero_celular,
    direccion,
    dni,
    tipo: TipoUsuarioId,
    token,
  };
};

export const getAllUsuariosState = async (): Promise<stateUsuario[]> => {
  const user: stateUsuario[] = await sequelize.query(
    `SELECT U.id, U.username, U.email, T.tipo, U.habilitado, U.createdAt FROM Usuarios AS U INNER JOIN Tipo_usuarios AS T ON T.id=U.TipoUsuarioId`,
    {
      type: QueryTypes.SELECT,
    }
  );

  return user;
};

export const changeUserType = async (
  id: number,
  tipo: string
): Promise<{ success: boolean }> => {
  await sequelize.query(
    `UPDATE Usuarios SET TipoUsuarioId=:tipo WHERE id=:id`,
    {
      replacements: { tipo, id: id },
      type: QueryTypes.UPDATE,
    }
  );

  return { success: true };
};

export const changePasswordByMail = async (email: string) => {
  const [findUser]: [findUser: datosUsuario] = await sequelize.query(
    `SELECT email, username FROM Usuarios WHERE email=:email`,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    }
  );

  if (!findUser) return { success: true };

  sendEmail({
    userEmail: email,
    subject: "Cambiar constraseña de usuario",
    html: templateChangePassword(
      findUser.username,
      sign({ email }, process.env.SECRET as string, { expiresIn: "12h" })
    ),
  });

  return { success: true };
};

export const changePasswordByToken = async (
  token: string,
  password: string
) => {
  const { email } = verify(token, process.env.SECRET as string) as {
    email: string;
  };

  await sequelize.query(
    `
    UPDATE Usuarios SET clave='${await hash(password, 8)}' WHERE email=:email
  `,
    {
      replacements: { email },
      type: QueryTypes.UPDATE,
    }
  );

  return "<h1>Contraseña actualizada correctamente.</h1>";
};
