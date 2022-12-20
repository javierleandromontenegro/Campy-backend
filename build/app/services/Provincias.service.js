"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvincias = void 0;
const { sequelize } = require("../db");
const getProvincias = async (id) => {
    const [querySql] = await sequelize.query(`SELECT PV.id AS id, PV.nombre AS nombre, PV.imagen AS imagen FROM Paises AS PS
    INNER JOIN Provincias as PV ON PS.id=PV.PaiseId WHERE PS.id=${id}`);
    return querySql;
};
exports.getProvincias = getProvincias;
