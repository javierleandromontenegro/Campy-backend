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


export const getCampingsPorId = async (id: string): Promise<datosCamping | string> => {
  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.id,C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,C.UsuarioId AS prop_camping_Id,C.cerrado_fecha_desde , C.cerrado_fecha_hasta, L.nombre AS localidad,P.nombre AS provincia,
    CA.categoria,CA.cantidad_estrellas,CC.duchas,CC.baños,CC.mascotas,CC.rodantes,CC.proveduria,CC.salon_sum,CC.restaurant,CC.vigilancia,CC.pileta,CC.estacionamiento,CC.juegos_infantiles,CC.maquinas_gimnasia,CC.wifi,
    CP.techada AS parcela_techada,CP.agua_en_parcela AS parcela_agua_en_parcela,CP.iluminacion_toma_corriente AS parcela_iluminacion_toma_corriente,CP.superficie AS parcela_superficie,
    AP.descripcion_periodo,
    PAC.descripcion_periodo_agua   
    from Campings as C 
    INNER JOIN Localidades AS L INNER JOIN Provincias as P ON P.Id=L.ProvinciaId ON C.LocalidadeId=L.id      
    INNER JOIN Categoria_campings AS CA ON C.CategoriaCampingId=CA.id
    INNER JOIN Caracteristicas_campings AS CC 
    INNER JOIN Caracteristicas_parcelas AS CP ON CC.id=CP.CaracteristicasCampingId 
     INNER JOIN Abierto_periodos AS AP ON CC.AbiertoPeriodoId=AP.id 
     INNER JOIN Periodo_agua_calientes AS PAC ON CC.PeriodoAguaCalienteId=PAC.id
     ON C.CategoriaCampingId =CC.id
    WHERE C.habilitado=1 AND C.id=${id};`
  );

    if(!querySql[0]) return "No hay camping con ese ID";

  //console.log(querySql);
  return querySql[0];
}