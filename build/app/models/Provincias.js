"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Provincias', {
        nombre: {
            type: sequelize_1.DataTypes.STRING
        },
        imagen: {
            type: sequelize_1.DataTypes.STRING
        }
    });
};
