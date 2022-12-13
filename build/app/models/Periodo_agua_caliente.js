"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Periodo_agua_caliente', {
        descripcion_periodo_agua: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        }
    });
};
