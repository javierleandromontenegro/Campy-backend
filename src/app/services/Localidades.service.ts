import datosLugares from "../types/datosBase";
import createLocalidad from "../types/datosLocalidad";

const { sequelize } = require("../db");

export const getLocalidades = async (id: string): Promise<datosLugares[]> => {
  const [querySql]: [querySql: datosLugares[]] = await sequelize.query(
    `SELECT L.id AS id, L.nombre AS nombre, L.imagen AS imagen FROM Localidades AS L
    INNER JOIN Provincias AS P ON P.id=L.ProvinciaId WHERE P.id=${id}`
  );

  return querySql;
};

export const postLocalidades = async ({
  nombre, imagen, ProvinciaId
}: createLocalidad): Promise<createLocalidad[]> => {

  if (!nombre || !imagen || !ProvinciaId) throw {
    error: 406,
    message: 'Faltan parámetros'
  };

  const [querySql]: [querySql: createLocalidad[]] = await sequelize.query(
    `INSERT INTO Localidades(nombre, imagen, createdAt, updatedAt, ProvinciaId)
    VALUES ('${nombre}', '${imagen}', NOW(), NOW(), ${ProvinciaId})`
  );

  return querySql;
};