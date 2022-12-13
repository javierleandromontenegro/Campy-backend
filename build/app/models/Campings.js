"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Campings', {
        nombre_camping: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        descripcion_camping: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        direccion: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        longitud: {
            type: sequelize_1.DataTypes.STRING,
        },
        latitud: {
            type: sequelize_1.DataTypes.STRING,
        },
        cerrado_fecha_desde: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        cerrado_fecha_hasta: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        contacto_nombre: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        contacto_tel: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        habilitado: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
};
