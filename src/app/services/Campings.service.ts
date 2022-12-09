import datosCamping from "../types/datosCamping";
const { sequelize } = require("../db");

export const getCampingsPorProvincia = async (id: string): Promise<datosCamping[]> => {
  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.id as id, C.nombre_camping as nombre, L.nombre as localidad, P.nombre as provincia, I.url AS imagen FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id INNER JOIN Camping_imagenes as I ON C.id=I.CampingId WHERE P.id=${id};`
  );

  return querySql;
}

export const getCampingsPorLocalidad = async (id: string): Promise<datosCamping[]> => {
  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.id as id, C.nombre_camping as nombre, L.nombre as localidad, P.nombre as provincia, I.url AS imagen FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id INNER JOIN Camping_imagenes as I ON C.id=I.CampingId WHERE L.id=${id};`
  );

  return querySql;
}
  