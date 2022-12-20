"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Detalle_reserva', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        subtotal: {
            type: sequelize_1.DataTypes.FLOAT,
        },
    });
};
