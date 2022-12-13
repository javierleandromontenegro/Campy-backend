"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Relacion_campo_tarifa', {
        precio: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        }
    });
};
