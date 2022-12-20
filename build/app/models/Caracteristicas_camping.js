"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Caracteristicas_camping', {
        wifi: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        duchas: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        baños: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        mascotas: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        rodantes: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        proveduria: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        salon_sum: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        restaurant: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        vigilancia: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        pileta: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        estacionamiento: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        juegos_infantiles: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        maquinas_gimnasia: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
    });
};
