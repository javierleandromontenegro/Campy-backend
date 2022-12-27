import { stateUsuario, datosUsuario } from "../types/datosUsuario";
import { allPropertiesUsuario } from "../types/Properties";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";

const { sequelize } = require('../db');


export const getUser = async (id: string): Promise<datosUsuario> => {
  const [user]: [user: datosUsuario[]] =
    await sequelize.query(
      `SELECT U.id, U.email, U.username, U.foto, U.numero_celular, U.habilitado, U.dni, U.direccion, T.id AS TipoUsuarioId FROM Usuarios AS U INNER JOIN Tipo_usuarios AS T ON T.id=U.TipoUsuarioId WHERE U.id=${id};`
    );

  if (!user[0]) throw {
    error: 404, message: `No se encontró un usuario con el ID: ${id}`
  }

  return user[0];
};


export const disableUser = async (id: string, habilitar: number): Promise<{ success: boolean }> => {
  if (habilitar < 0 || habilitar > 1) throw {
    error: 406, message: 'tipo de habilitación inválida'
  }

  const [updatedUser] = await sequelize.query(
    `UPDATE Usuarios SET habilitado=${habilitar} WHERE id=${id};`
  );

  return { success: !!updatedUser.changedRows }
};

export const updateUser = async (data: datosUsuario, userId: number, token: string) => {
  const entries: [key: string, value: string][] = Object.entries(data);
  
  if (!entries.length || entries.length > allPropertiesUsuario.length)
    throw { error: 406, message: 'Información errónea en el query.' }

  for (let [key] of entries)
    if (!allPropertiesUsuario.includes(key))
      throw { error: 406, message: 'Propiedades inexistentes.' }

  let clave: string = '';

  const querySentence = await Promise.all(entries.map(async entry => {
    if (entry[0] === 'clave') clave = entry[1];
    entry[1] = `'${entry[0] === 'clave' ? await hash(entry[1], 8) : entry[1]}'`;

    return entry.join('=')
  })).then(res => res.join(', '));

  await sequelize.query(
    `UPDATE Usuarios SET ${querySentence} WHERE id=${userId}`
  );

  const [[{
    id,
    email,
    username,
    foto,
    numero_celular,
    direccion,
    dni,
    TipoUsuarioId
  }]] = await sequelize.query(
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
    token
  };
}

export const getAllUsuariosState = async (): Promise<stateUsuario[]> => {
  const [user]: [user: stateUsuario[]] =
    await sequelize.query(
      `SELECT U.id, U.username, U.email, T.tipo, U.habilitado, U.createdAt FROM Usuarios AS U INNER JOIN Tipo_usuarios AS T ON T.id=U.TipoUsuarioId`
    );

  return user;
};

export const changeUserType = async (id: string, tipo: string): Promise<{success: boolean}> => {
  
  await sequelize.query(
    `UPDATE Usuarios SET TipoUsuarioId='${tipo}' WHERE id=${id};`
  );

  return {success: true}
};