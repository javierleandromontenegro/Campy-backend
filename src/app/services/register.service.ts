import datosUsuario from '../types/datosUsuario';

const { sequelize, Usuarios } = require('../db');

export const registerUser = async ({
    email, clave, nombre_completo, numero_celular, direccion, dni, tipo
  }: datosUsuario): Promise<datosUsuario> => {

  if(tipo !== 1 && tipo !== 2) throw {
    error: 'cannotRegister', message: 'Tipo de usuario incorrecto'
  }

  const findUser = await Usuarios.findOne({ where: { email } });

  if(findUser) throw {
    error: 'cannotRegister', message: 'Ese correo ya se encuentra registrado'
  };

  const [userRegisteredId]: [userRegisteredId: number] = await sequelize.query(
    `INSERT INTO Usuarios (email, clave, nombre_completo, numero_celular, direccion, dni, TipoUsuarioId, createdAt, updatedAt) VALUES ('${email}', '${clave}', '${nombre_completo}', '${numero_celular}', '${direccion}', '${dni}', ${tipo}, NOW(), NOW())`
  );

  const [createdUser]: [createdUser: datosUsuario] = await sequelize.query(
    `SELECT id, email, clave, nombre_completo, numero_celular, direccion, dni, TipoUsuarioId AS tipo FROM Usuarios WHERE id=${userRegisteredId};`
  );

  return createdUser;
}