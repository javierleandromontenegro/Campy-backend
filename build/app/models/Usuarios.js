"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Usuarios', {
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        clave: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        nombre_completo: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        numero_celular: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        direccion: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        dni: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        habilitado: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
};
