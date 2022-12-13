"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableUser = exports.getUser = void 0;
const { sequelize } = require('../db');
const getUser = async (id) => {
    const [user] = await sequelize.query(`SELECT U.id, U.email, U.nombre_completo, U.numero_celular, U.habilitado, U.dni, T.id AS TipoUsuarioId  FROM Usuarios AS U INNER JOIN Tipo_usuarios AS T ON T.id=U.TipoUsuarioId WHERE U.id=${id};`);
    if (!user[0])
        throw {
            error: 404, message: `No se encontró un usuario con el ID: ${id}`
        };
    return user[0];
};
exports.getUser = getUser;
const disableUser = async (id, habilitar) => {
    if (habilitar < 0 || habilitar > 1)
        throw {
            error: 406, message: 'tipo de habilitación inválida'
        };
    const [updatedUser] = await sequelize.query(`UPDATE Usuarios SET habilitado=${habilitar} WHERE id=${id};`);
    return { success: !!updatedUser.changedRows };
};
exports.disableUser = disableUser;
