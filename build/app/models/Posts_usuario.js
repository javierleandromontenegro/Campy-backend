"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Posts_usuario', {
        titulo: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        fecha: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
};
