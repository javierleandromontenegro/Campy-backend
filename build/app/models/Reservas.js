"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Reservas', {
        fecha_desde_reserva: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        fecha_hasta_reserva: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        cant_noches: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        total: {
            type: sequelize_1.DataTypes.FLOAT,
        }
    });
};
