import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { hash } from "bcrypt";
import { datosUsuario } from "../types/datosUsuario";
import { searchUser } from "../jwt/CheckoutUser";
import { QueryTypes } from "sequelize";

const { sequelize } = require("../db");

export const loginUser = async ({
  email,
  clave,
}: {
  email: string;
  clave: string;
}) => {
  if (!email || !clave) throw { error: 406, message: "Faltan parámetros" };

  const {
    username,
    id,
    dni,
    numero_celular,
    direccion,
    foto,
    tipo,
  }: datosUsuario = await searchUser(email, clave);

  const token = sign({ email, clave }, process.env.SECRET as string);

  return {
    id,
    username,
    email,
    dni,
    numero_celular,
    direccion,
    foto,
    tipo,
    token,
  };
};

export const loginUserWithToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization;

  if (!token) return next();

  try {
    verify(token, String(process.env.SECRET), (err: any, result: any) => {
      if (err) throw { error: 406, message: "Token inválido." };

      const { email, clave } = result;
      searchUser(email, clave)
        .then((result) => {
          const {
            username,
            id,
            dni,
            numero_celular,
            direccion,
            foto,
            tipo,
          }: datosUsuario = result;

          res.status(200).json({
            email,
            id,
            username,
            dni,
            numero_celular,
            direccion,
            foto,
            tipo,
            token,
          });
        })
        .catch((err) => res.status(err.error).json(err));
    });
  } catch (e: any) {
    res.status(e.error).json(e);
  }
};

export const loginUserWithGoogle = async ({
  email,
  nickname,
  sub,
  apikey,
  picture,
}: {
  email: string;
  nickname: string;
  sub: string;
  apikey: string;
  picture: string;
}): Promise<any> => {
  try {
    if (apikey !== process.env.API_KEY)
      throw { error: 401, message: "Acceso no autorizado" };

    const findUser = await searchUser(email, sub)
      .then((res) => {
        const token = sign({ email, clave: sub }, String(process.env.SECRET));

        return { ...res, token };
      })
      .catch(async () => {
        const [findUser] = await sequelize.query(
          `SELECT id, email, clave, username, numero_celular, direccion, dni, habilitado, foto, TipoUsuarioId AS tipo FROM Usuarios WHERE email=:email;`,
          {
            replacements: { email },
            type: QueryTypes.SELECT,
          }
        );

        if (findUser)
          throw {
            error: 406,
            message: "Ese correo ya se encuentra registrado",
          };

        await sequelize.query(
          `INSERT INTO Usuarios (email, clave, username, foto, habilitado, TipoUsuarioId, createdAt, updatedAt) VALUES (:email, '${await hash(
            sub,
            8
          )}', :nickname, :picture, 1, :TipoUsuarioId, NOW(), NOW())`,
          {
            replacements: {
              email,
              nickname,
              picture,
              TipoUsuarioId: process.env.TIPO_USUARIO as string,
            },
            type: QueryTypes.INSERT,
          }
        );

        const token = sign({ email, clave: sub }, String(process.env.SECRET));

        const createdUser = await searchUser(email, sub);

        return { ...createdUser, token };
      });

    return findUser;
  } catch (e: any) {
    if (e.error) throw { error: e.error, message: e.message };
  }
};
