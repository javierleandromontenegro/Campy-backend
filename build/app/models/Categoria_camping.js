"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Categoria_camping', {
        categoria: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        cantidad_estrellas: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        descripcion_categoria: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        }
    });
};
