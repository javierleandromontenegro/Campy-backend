import { compare } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const { sequelize } = require('../db'); 

export const searchUser = async (email: string, clave: string) => {
    const [[findUser]] = await sequelize.query(
      `SELECT id, email, clave, nombre_completo, numero_celular, direccion, dni, habilitado, TipoUsuarioId AS tipo FROM Usuarios WHERE email='${email}';`
    );
    
    const verifyPassword = findUser && await compare(clave, findUser.clave);

    if(!findUser || !verifyPassword) throw { error: 401, message: 'Usuario Inválido' };

    if(!findUser.habilitado) throw { error: 401, message: 'Cuenta deshabilitada' };

    return findUser;
}

export const checkoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token }: { token: string } = req.body;

    let result: any = verify(token, String(process.env.SECRET));
    const { email, clave }: { email: string, clave: string} = result;
      
    const findUser = await searchUser(email, clave);

    req.body.user = findUser;
      
    next();
  } catch {
    res.status(401).json({ error: 401, message: 'Autorización denegada' });
  }
};

export const checkoutOwner = (req: Request, res: Response, next: NextFunction): any => {
  const tipo : number = Number(req.body.user.tipo);

  if(tipo !== 2) return res.status(401).json({ error: 401, message: 'Autorización denegada' });

  next();
}

export const checkoutAdmin = (req: Request, res: Response, next: NextFunction): any => {
  const tipo : number = Number(req.body.user.tipo);

  if(tipo !== 1) return res.status(401).json({ error: 401, message: 'Autorización denegada' });

  next();
}