import { sign } from 'jsonwebtoken';
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
    clave
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