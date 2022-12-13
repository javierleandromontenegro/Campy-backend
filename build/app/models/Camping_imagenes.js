"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Camping_imagenes', {
        url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    });
};
