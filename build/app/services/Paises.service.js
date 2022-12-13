"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaises = void 0;
const { Paises } = require("../db");
const getPaises = async () => await Paises.findAll({
    attributes: ['id', 'nombre', 'imagen']
});
exports.getPaises = getPaises;
