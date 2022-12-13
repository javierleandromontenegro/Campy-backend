import { Projectable } from "sequelize";

const { Paises } = require("../db");

export const getPaises = async (): Promise<Projectable> => await Paises.findAll(
    {
      attributes: ['id', 'nombre', 'imagen']
    }
);