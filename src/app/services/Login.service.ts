import { sign } from 'jsonwebtoken';
import { searchUser } from './CheckoutUser.service'; 

export const loginUser = async ({ email, clave}: {email: string, clave: string}) => {
  if(!email || !clave) throw { error: 406, message: 'Faltan parámetros' };

  const findUser = await searchUser(email, clave);

  const token = sign({
    email: findUser.email,
    clave
  }, String(process.env.SECRET));

  return {
    email,
    nombre_completo: findUser.nombre_completo,
    token
  };
}