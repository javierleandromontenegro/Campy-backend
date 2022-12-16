import datosUsuario from "../types/datosUsuario";
import { allPropertiesUsuario } from "../types/Properties";

const { sequelize } = require('../db');


export const getUser = async (id: string): Promise<datosUsuario> => {
  const [user]: [user: datosUsuario[]] = 
    await sequelize.query(
      `SELECT U.id, U.email, U.username, U.numero_celular, U.habilitado, U.dni, T.id AS TipoUsuarioId  FROM Usuarios AS U INNER JOIN Tipo_usuarios AS T ON T.id=U.TipoUsuarioId WHERE U.id=${id};`
    );

  if(!user[0]) throw {
    error: 404, message: `No se encontró un usuario con el ID: ${id}`
  }

  return user[0];
};


export const disableUser = async (id: string, habilitar: number): Promise<{success: boolean}> => {
  if(habilitar < 0 || habilitar > 1) throw {
    error: 406, message: 'tipo de habilitación inválida'
  }

  const [updatedUser] = await sequelize.query(
    `UPDATE Usuarios SET habilitado=${habilitar} WHERE id=${id};`
  );

  return {success: !!updatedUser.changedRows}
};

export const updateUser = async (data: datosUsuario, id: number) => {
  const entries: [key: string, value: string][] = Object.entries(data);

  if(!entries.length || entries.length > allPropertiesUsuario.length) 
    throw { error: 406, message: 'Información errónea en el query.' }

  for(let [key] of entries) 
    if(!allPropertiesUsuario.includes(key)) 
      throw { error: 406, message: 'Propiedades inexistentes.' }


  const querySentence = entries.map(entry => {
    entry[1] = `'${entry[1]}'`;
    return entry.join('=')
  }).join(', ');

  await sequelize.query(
        `UPDATE Usuarios SET ${querySentence} WHERE id=${id}`
      );

  return { success: true }
}