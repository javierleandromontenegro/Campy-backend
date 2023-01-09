import { QueryTypes } from "sequelize";
import { stateUsuario, datosUsuario } from "../types/datosUsuario";
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
  { username, clave, direccion, numero_celular, dni, foto }: datosUsuario,
  userId: number,
  token: string,
  justPhoto: boolean = false
) => {
  if (justPhoto) {
    await sequelize.query(`UPDATE Usuarios SET foto=:foto  WHERE id=:userId`, {
      replacements: { foto, userId },
      type: QueryTypes.UPDATE,
    });

    return { ...(await getUser(userId)), token };
  }

  await sequelize.query(
    `UPDATE Usuarios SET username=:username ${
      clave ? `, clave='${await hash(clave, 8)}'` : ""
    },direccion=:direccion, numero_celular=:numero_celular, dni=:dni, foto=:foto  WHERE id=:userId`,
    {
      replacements: {
        username,
        userId,
        direccion,
        numero_celular,
        dni,
        foto,
      },
      type: QueryTypes.UPDATE,
    }
  );

  const [{ id, TipoUsuarioId, email }] = await sequelize.query(
    `SELECT id, email, clave, username, foto, numero_celular, direccion, dni, TipoUsuarioId FROM Usuarios WHERE id=:userId`,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    }
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
