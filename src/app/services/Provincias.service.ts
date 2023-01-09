import { QueryTypes } from "sequelize";
import { datosBase, campingsCantidad } from "../types/datosBase";

const { sequelize } = require("../db");

//http://localhost:3001/api/provincias/:idpais
export const getProvincias = async (id: number): Promise<datosBase[]> => {
  const querySql: datosBase[] = await sequelize.query(
    `SELECT P.id AS id,P.nombre AS nombre, P.descrip_historia, P.latitud, P.longitud, P.imagen AS imagen FROM Provincias AS P 
    INNER JOIN Paises ON P.PaiseId=Paises.id
    WHERE P.PaiseId=:id
    ORDER BY P.nombre`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

export const getProvinciasCantCampings = async (): Promise<
  campingsCantidad[]
> => {
  const querySql: campingsCantidad[] = await sequelize.query(
    `SELECT P.nombre AS provincias, COUNT(C.nombre_camping) AS cant_campings
    FROM Campings AS C 
    INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id
    GROUP BY P.nombre ORDER BY cant_campings DESC`,
    {
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};
