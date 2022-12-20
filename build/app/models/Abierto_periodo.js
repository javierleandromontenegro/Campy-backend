"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Abierto_periodo', {
        descripcion_periodo: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
    });
};
