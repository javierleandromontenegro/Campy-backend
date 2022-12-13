"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    sequelize.define('Estado_reserva', {
        descrip_estado: {
            type: sequelize_1.DataTypes.TEXT,
        },
    });
};
