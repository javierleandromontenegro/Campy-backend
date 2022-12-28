import { compare } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const { sequelize } = require('../db'); 

export const searchUser = async (email: string, clave: string) => {
    const [[findUser]] = await sequelize.query(
      `SELECT id, email, clave, username, numero_celular, direccion, dni, habilitado, foto, TipoUsuarioId AS tipo FROM Usuarios WHERE email='${email}';`
    );
    
    const verifyPassword = findUser && await compare(clave, findUser.clave);
      
    if(!findUser || !verifyPassword) throw { error: 401, message: 'Usuario Inválido' };

    if(!findUser.habilitado) throw { error: 401, message: 'Cuenta deshabilitada' };

    return findUser;
}

export const checkoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req.headers.authorization as string;

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
  const tipo: string = req.body.user.tipo;

  if(tipo !== process.env.TIPO_PROPIETARIO) return res.status(401).json({ error: 401, message: 'Autorización denegada' });

  next();
}

export const checkoutAdmin = (req: Request, res: Response, next: NextFunction): any => {
  const tipo: string = req.body.user.tipo;

  if(tipo !== process.env.TIPO_ADMIN) return res.status(401).json({ error: 401, message: 'Autorización denegada' });

  next();
}