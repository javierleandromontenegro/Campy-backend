"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Caracteristicas_parcela', {
        techada: {
            type: sequelize_1.DataTypes.BOOLEAN
        },
        agua_en_parcela: {
            type: sequelize_1.DataTypes.BOOLEAN
        },
        iluminacion_toma_corriente: {
            type: sequelize_1.DataTypes.BOOLEAN
        },
        superficie: {
            type: sequelize_1.DataTypes.FLOAT
        },
    });
};
