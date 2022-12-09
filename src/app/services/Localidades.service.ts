import datosLugares from "../types/datosBase";

const { sequelize } = require("../db");

export const getLocalidades = async (id: string): Promise<datosLugares[]> => {
  const [querySql]: [querySql: datosLugares[]] = await sequelize.query(
    `SELECT L.id AS id, L.nombre AS nombre, L.imagen AS imagen FROM Localidades AS L
    INNER JOIN Provincias AS P ON P.id=L.ProvinciaId WHERE P.id=${id}`
  );

  return querySql;
}