"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Reviews', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comentario: {
            type: sequelize_1.DataTypes.TEXT
        },
        fecha: {
            type: sequelize_1.DataTypes.DATE
        }
    });
};
