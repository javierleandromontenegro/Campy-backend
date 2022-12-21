import {datosBase, campingsCantidad} from "../types/datosBase"; 

const { sequelize } = require("../db");


//http://localhost:3001/api/provincias/idpais
export const getProvincias = async (id: string): Promise<datosBase[]> => {
  const [querySql]: [querySql: datosBase[]] = await sequelize.query(
    `SELECT PV.id AS id, PV.nombre AS nombre, PV.imagen AS imagen FROM Paises AS PS
    INNER JOIN Provincias as PV ON PS.id=PV.PaiseId WHERE PS.id=${id} ORDER BY nombre`
  );

  return querySql;
}

export const getProvinciasCantCampings = async (): Promise<campingsCantidad[]> => {
  const [querySql]: [querySql: campingsCantidad[]] = await sequelize.query(
    `SELECT P.nombre AS provincias, COUNT(C.nombre_camping) AS cant_campings
    FROM Campings AS C 
    INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id
    GROUP BY P.nombre ORDER BY cant_campings DESC`
  );

  return querySql;
}
