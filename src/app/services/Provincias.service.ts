import datosLugares from "../types/datosBase"; 

const { sequelize } = require("../db");

export const getProvincias = async (id: string): Promise<datosLugares[]> => {
  const [querySql]: [querySql: datosLugares[]] = await sequelize.query(
    `SELECT PV.id AS id, PV.nombre AS nombre, PV.imagen AS imagen FROM Paises AS PS
    INNER JOIN Provincias as PV ON PS.id=PV.PaiseId WHERE PS.id=${id}`
  );

  return querySql;
}
