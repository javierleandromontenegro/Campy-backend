import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import datosUsuario from '../types/datosUsuario';
import { searchUser } from './CheckoutUser.service'; 

export const loginUser = async ({ email, clave}: {email: string, clave: string}) => {
  if(!email || !clave) throw { error: 406, message: 'Faltan parámetros' };

  const { 
    nombre_completo, 
    id, 
    dni, 
    numero_celular, 
    direccion,
    tipo
  }: datosUsuario = await searchUser(email, clave);

  const token = sign({
    email,
    clave,
  }, String(process.env.SECRET));

  return {
    id,
    nombre_completo,
    email,
    numero_celular,
    dni,
    direccion,
    tipo,
    token
  };
}

export const loginUserWithToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token;

  if(!token) return next();

  try {

    verify(token, String(process.env.SECRET), (err: any, result: any) => {
      
      if(err) throw { error: 406, message: 'Token inválido.' }

      const { email, clave } = result
     searchUser(email, clave).then(result => {
          const { 
          nombre_completo, 
          id, 
          dni, 
          numero_celular, 
          direccion,
          tipo
        }: datosUsuario = result


        res.status(200).json({ 
          nombre_completo, 
          id, 
          dni, 
          numero_celular, 
          direccion,
          tipo,
          token
        });
      })
  
    });
  } catch(e: any) {
    res.status(e.error).json(e);
  }
};