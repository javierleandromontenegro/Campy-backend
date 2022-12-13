"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLocalidades = exports.getLocalidades = void 0;
const { sequelize } = require("../db");
const getLocalidades = async (id) => {
    const [querySql] = await sequelize.query(`SELECT L.id AS id, L.nombre AS nombre, L.imagen AS imagen FROM Localidades AS L
    INNER JOIN Provincias AS P ON P.id=L.ProvinciaId WHERE P.id=${id}`);
    return querySql;
};
exports.getLocalidades = getLocalidades;
const postLocalidades = async ({ nombre, imagen, ProvinciaId }) => {
    if (!nombre || !imagen || !ProvinciaId)
        throw {
            error: 406,
            message: 'Faltan parámetros'
        };
    const [querySql] = await sequelize.query(`INSERT INTO Localidades(nombre, imagen, createdAt, updatedAt, ProvinciaId)
    VALUES ('${nombre}', '${imagen}', NOW(), NOW(), ${ProvinciaId})`);
    return querySql;
};
exports.postLocalidades = postLocalidades;
