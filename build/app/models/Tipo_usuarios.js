"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Tipo_usuarios', {
        tipo: {
            type: sequelize_1.DataTypes.STRING,
        }
    });
};
