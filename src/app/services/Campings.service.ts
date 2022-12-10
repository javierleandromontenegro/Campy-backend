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


export const getCampingsPorId = async (id: string): Promise<datosCamping[]> => {
  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,
    CA.categoria,CA.cantidad_estrellas,
    CC.duchas,CC.baños,CC.mascotas,CC.rodantes,CC.proveduria,CC.salon_sum,CC.restaurant,CC.vigilancia,CC.pileta,CC.estacionamiento,CC.juegos_infantiles,CC.maquinas_gimnasia,CC.wifi
    from Campings as C 
    INNER JOIN Localidades AS L ON C.LocalidadeId=L.id 
    INNER JOIN Categoria_campings AS CA ON C.CategoriaCampingId=CA.id
    INNER JOIN Caracteristicas_campings AS CC ON C.CategoriaCampingId =CC.id
    WHERE C.habilitado=1 AND C.id=${id};`
  );

  return querySql;
}