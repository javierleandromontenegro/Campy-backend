import { compare } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { QueryTypes } from "sequelize";
import { datosUsuario } from "../types/datosUsuario";

const { sequelize } = require("../db");

//BUSCA A UN USUARIO Y DEVUELVE EL OBJETO SI LO ENCUENTRA
export const searchUser = async (email: string, clave: string) => {
  const [findUser]: [findUser: datosUsuario] = await sequelize.query(
    `SELECT id, email, clave, username, numero_celular, direccion, dni, habilitado, foto, TipoUsuarioId AS tipo FROM Usuarios WHERE email=:email`,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    }
  );

  const verifyPassword =
    findUser && (await compare(clave, findUser.clave as string));

  if (!findUser || !verifyPassword)
    throw { error: 401, message: "Usuario Inválido" };

  if (!findUser.habilitado)
    throw { error: 401, message: "Cuenta deshabilitada" };

  return findUser;
};

//MIDDLEWARE QUE VERIFICA EL TOKEN CIFRADO CON LA INFORMACIÓN PARA INCIAR SESIÓN Y ASÍ CONTINUAR CON LA PETICIÓN (DURANTE LA FUNCIÓN LE AÑADE UNA PROPIEDAD AL req.body QUE ES user, QUE CONTIENE LA INFO DEL USUARIO HALLADO)
export const checkoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = req.headers.authorization as string;

    const { email, clave } = verify(token, String(process.env.SECRET)) as {
      email: string;
      clave: string;
    };

    const findUser = await searchUser(email, clave);

    req.body.user = findUser;

    next();
  } catch {
    res.status(401).json({ error: 401, message: "Autorización denegada" });
  }
};

//MIDDLEWARE QUE VERIFICA QUE UN USUARIO SEA PROPIETARIO PARA SEGUIR
//SE COLOCA DESPUÉS DE checkoutUser
export const checkoutOwner = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const tipo: string = req.body.user.tipo;

  if (tipo !== process.env.TIPO_PROPIETARIO)
    return res
      .status(401)
      .json({ error: 401, message: "Autorización denegada" });

  next();
};

//MIDDLEWARE QUE VERIFICA QUE UN USUARIO SEA ADMINISTRADOR PARA SEGUIR
//SE COLOCA DESPUÉS DE checkoutUser
export const checkoutAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const tipo: string = req.body.user.tipo;

  if (tipo !== process.env.TIPO_ADMIN)
    return res
      .status(401)
      .json({ error: 401, message: "Autorización denegada" });

  next();
};

//MIDDLEWARE QUE SE ENCARGA DE VERIFICAR QUE UN USUARIO SEA PROPIETARIO O ADMIN PARA ACCEDER
//SE COLOCA DESPUÉS DE checkoutUser
export const checkoutOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const tipo: string = req.body.user.tipo;

  if (tipo !== process.env.TIPO_ADMIN && tipo !== process.env.TIPO_PROPIETARIO)
    return res
      .status(401)
      .json({ error: 401, message: "Autorización denegada" });

  next();
};

//MIDDLEWARE QUE SE ENCARGA DE VERIFICAR QUE EL USUARIO QUE QUIERE ACCEDER A LA INFO DE UN USUARIO EN LA BASE DE DATOS POR ID SEA ÉL MISMO O EL ADMINISTRADOR. ES IMPORTANTE QUE EL ID DEL USUARIO SE PASE POR PARAMS Y CON EL NOMBRE 'userId'
//SE COLOCA DESPUÉS DE HABER PUESTO checkoutUser
export const checkoutBeTheSameUserOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId: number = req.body.user.id;
  const tipo: string = req.body.user.tipo;
  const userParamsId: number = +req.params.userId;

  if (userId === userParamsId || tipo === (process.env.TIPO_ADMIN as string))
    return next();

  res.status(406).json({ error: 406, message: "Autorización denegada." });
};

//MIDDLEWARE QUE SE ENCARGA DE VERIFICAR QUE EL USUARIO QUE QUIERE ACCEDER A LA INFO DE UN CAMPING POR ID SEA EL DUEÑO O EL ADMINISTRADOR. ES IMPORTANTE QUE EL ID DEL CAMPING SE PASE POR PARAMS Y CON EL NOMBRE 'campingId'
//SE COLOCA DESPUÉS DE HABER PUESTO checkoutUser
export const checkoutBeTheOwnerCampingOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId: number = req.body.user.id;
  const tipo: string = req.body.user.tipo;
  const campingParamsId: number = +req.params.campingId;

  if (tipo === (process.env.TIPO_ADMIN as string)) return next();

  const [verifyOwner]: [verifyOwner: { id: number; UsuarioId: number }] =
    await sequelize.query(
      `
    SELECT id, UsuarioId FROM Campings WHERE UsuarioId=:userId AND id=:campingParamsId
  `,
      {
        replacements: { userId, campingParamsId },
        type: QueryTypes.SELECT,
      }
    );

  if (verifyOwner) return next();

  res.status(406).json({ error: 406, message: "Autorización denegada." });
};
