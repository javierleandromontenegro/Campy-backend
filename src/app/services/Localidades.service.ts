import { QueryTypes } from "sequelize";
import { datosBase } from "../types/datosBase";
import createLocalidad from "../types/datosLocalidades";

const { sequelize } = require("../db");

// ESTA RUTA SOLO TRAE LAS LOCALIDADES QUE TIENEN CAMPINGS CARGADOS
//http://localhost:3001/api/localidades/ConCampings/21
export const getLocalidadesConCampings = async (
  id: number
): Promise<datosBase[]> => {
  const querySql: datosBase[] = await sequelize.query(
    `SELECT L.id AS id, L.nombre AS nombre, L.imagen AS imagen, L.descrip_historia, L.latitud, L.longitud, L.ProvinciaId AS idProv 
    FROM Campings AS C 
    LEFT JOIN Localidades AS L ON C.LocalidadeId=L.id
    WHERE L.ProvinciaId=:id
    GROUP BY L.nombre
    ORDER BY nombre`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

// TRAE TODAS LAS LOCALIDADES
//http://localhost:3001/api/localidades/idprovincia
export const getLocalidades = async (id: number): Promise<datosBase[]> => {
  const querySql: datosBase[] = await sequelize.query(
    `SELECT L.id AS id, L.nombre AS nombre, L.imagen AS imagen, L.descrip_historia, L.latitud, L.longitud, L.ProvinciaId AS idProv
    FROM Localidades AS L
    INNER JOIN Provincias AS P ON P.id=L.ProvinciaId
    WHERE P.id=:id ORDER BY nombre`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

// PENDIENTE DE cambiar para agregar L.descrip_historia, L.latitud, L.longitud
export const postLocalidades = async ({
  nombre,
  imagen,
  ProvinciaId,
}: createLocalidad): Promise<number> => {
  if (!nombre || !imagen || !ProvinciaId)
    throw {
      error: 406,
      message: "Faltan parámetros",
    };

  const querySql: number = await sequelize.query(
    `INSERT INTO Localidades(nombre, imagen, createdAt, updatedAt, ProvinciaId)
    VALUES (:nombre, :imagen, NOW(), NOW(), :ProvinciaId)`,
    {
      replacements: { nombre, imagen, ProvinciaId },
      type: QueryTypes.INSERT,
    }
  );

  return querySql;
};
