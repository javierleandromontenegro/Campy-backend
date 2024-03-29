import { datosBase } from "../types/datosBase";
import datosCamping from "../types/datosCamping";
import {
  createCamping,
  campingCategorias,
  campingTarifas,
  campingAbiertoPeriodo,
  campingPeriodoAguaCaliente,
  campingHabilitado,
} from "../types/datosCamping";
import { datosFiltros } from "../types/datosFiltros";
import datosPrecios from "../types/datosPrecios";
import { campingsCantReservas } from "../types/datosBase";
import { getReservasPendientesByCampingId } from "./Reservas.service";
import { QueryTypes } from "sequelize";

const { sequelize } = require("../db");

// IMAGENES DE UN DETERMINADO CAMPING
export const getCampingsImagenes = async (id: number): Promise<string[]> => {
  const querySql: datosCamping[] = await sequelize.query(
    `SELECT C.ID,CI.url from Campings as C INNER JOIN Camping_imagenes AS CI ON CI.CampingId=C.id WHERE C.habilitado=1 AND C.id=:id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql.map((query: any): string => query.url);
};

// ESTA ES LA LISTA DE PRECIOS DE UN DETERMINADO CAMPING
export const getPreciosCamping = async (
  id: number
): Promise<datosPrecios[]> => {
  const querySql: datosPrecios[] = await sequelize.query(
    `SELECT T.id, RT.precio, T.descrip_tarifa 
    FROM Relacion_campo_tarifas AS RT 
    INNER JOIN Tarifas AS T ON T.id=RT.TarifaId
    INNER JOIN Campings AS C ON C.id=RT.CampingId
    WHERE C.id=:id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

// MUESTRA TODAS LAS CATEGORIAS DE CAMPING QUE HAY
export const getCampingsCategorias = async (): Promise<campingCategorias[]> => {
  const querySql: campingCategorias[] = await sequelize.query(
    `SELECT id,categoria,cantidad_estrellas,descripcion_categoria FROM Categoria_campings`,
    { type: QueryTypes.SELECT }
  );

  return querySql;
};

// MUESTRA TODOS LOS CAMPINGS INDICANDO EL ESTADO DE HABILITACION
export const getCampingsHabilitacion = async (): Promise<
  campingHabilitado[]
> => {
  const querySql: campingHabilitado[] = await sequelize.query(
    `SELECT C.id, C.nombre_camping, C.habilitado, C.contacto_tel, L.nombre AS localidad, P.nombre AS provincia FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id
    ORDER BY C.createdAt DESC`,
    { type: QueryTypes.SELECT }
  );

  return querySql;
};

// HABILITA O DESHABILITA UN DETERMINADO CAMPING
export const disableCamping = async (
  id: number,
  habilitar: number
): Promise<{ success: boolean }> => {
  if (habilitar < 0 || habilitar > 1)
    throw {
      error: 406,
      message: "tipo de habilitación inválida",
    };

  const updatedCamping = await sequelize.query(
    `UPDATE Campings SET habilitado=:habilitar WHERE id=:id;`,
    {
      replacements: { id, habilitar },
      type: QueryTypes.UPDATE,
    }
  );

  return { success: !!updatedCamping.changedRows };
};

//http://localhost:3001/api/campings/reservas
export const getCampingsCantReservas = async (): Promise<
  campingsCantReservas[]
> => {
  const querySql: campingsCantReservas[] = await sequelize.query(
    `SELECT C.nombre_camping, C.id, L.nombre as localidad, P.nombre as provincia, I.url as images, COUNT(R.id) AS cant_reservas FROM Reservas AS R 

    INNER JOIN Campings AS C ON R.CampingId=C.id
    INNER JOIN Localidades AS L ON C.LocalidadeId=L.id
    INNER JOIN Provincias AS P ON L.ProvinciaId=P.id 
    INNER JOIN Camping_imagenes as I ON I.CampingId=C.id
    GROUP BY C.nombre_camping ORDER BY cant_reservas DESC`,
    { type: QueryTypes.SELECT }
  );

  return querySql;
};

// MUESTRA LOS TIPOS DE TARIFAS
export const getCampingTarifas = async (): Promise<campingTarifas[]> => {
  const querySql: campingTarifas[] = await sequelize.query(
    `SELECT id, descrip_tarifa FROM Tarifas`,
    { type: QueryTypes.SELECT }
  );

  return querySql;
};

export const getCampingAbiertoPeriodo = async (): Promise<
  campingAbiertoPeriodo[]
> => {
  const querySql: campingAbiertoPeriodo[] = await sequelize.query(
    `SELECT id, descripcion_periodo FROM Abierto_periodos`,
    { type: QueryTypes.SELECT }
  );

  return querySql;
};

export const getCampingPeriodoAguaCaliente = async (): Promise<
  campingPeriodoAguaCaliente[]
> => {
  const querySql: campingPeriodoAguaCaliente[] = await sequelize.query(
    `SELECT id, descripcion_periodo_agua FROM Periodo_agua_calientes`,
    { type: QueryTypes.SELECT }
  );

  return querySql;
};

// MUESTRA TODOS LOS CAMPINGS POR PROVINCIA
export const getCampingsPorProvincia = async (
  id: number
): Promise<datosCamping[]> => {
  const querySql: datosCamping[] = await sequelize.query(
    `SELECT C.id as id, C.nombre_camping as nombre, L.nombre as localidad, P.nombre as provincia FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id WHERE C.habilitado=1 AND P.id=:id ORDER BY L.nombre, C.nombre_camping;`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  const imagenesQuery = await Promise.all(
    querySql.map((query) => getCampingsImagenes(query.id))
  );

  const results = querySql.map((query, i) => {
    query.imagenes = imagenesQuery[i];
    return query;
  });

  return results;
};

// MUESTRA TODOS LOS CAMPINGS POR LOCALIDAD
export const getCampingsPorLocalidad = async (
  id: number
): Promise<datosCamping[]> => {
  const querySql: datosCamping[] = await sequelize.query(
    `SELECT C.id as id, C.nombre_camping as nombre, L.nombre as localidad, P.nombre as provincia FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id WHERE C.habilitado=1 AND L.id=:id  ORDER BY L.nombre, C.nombre_camping;`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  const imagenesQuery: string[][] = await Promise.all(
    querySql.map((query) => getCampingsImagenes(query.id))
  );

  const results = querySql.map((query, i) => {
    query.imagenes = imagenesQuery[i];
    return query;
  });

  return results;
};

// MUESTRA UN DETERMINADO CAMPING CON DETALLE E IMAGENES *******************
export const getCampingsPorId = async (id: number): Promise<datosCamping> => {
  const querySql: datosCamping[] = await sequelize.query(
    `SELECT C.id,C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,C.UsuarioId AS prop_camping_Id,C.abierto_fecha_desde , C.abierto_fecha_hasta, C.CategoriaCampingId, C.LocalidadeId, C.contacto_nombre, C.contacto_tel, L.nombre AS localidad,P.nombre AS provincia, P.id AS ProvinciaId, P.descrip_historia,    
    CA.categoria,CA.cantidad_estrellas,CC.duchas,CC.baños,CC.mascotas,CC.rodantes,CC.proveduria,CC.salon_sum,CC.restaurant,CC.vigilancia,CC.pileta,CC.estacionamiento,CC.juegos_infantiles,CC.maquinas_gimnasia,CC.wifi, CC.AbiertoPeriodoId, CC.PeriodoAguaCalienteId,
    CP.techada AS parcela_techada,CP.agua_en_parcela AS parcela_agua_en_parcela,CP.iluminacion_toma_corriente AS parcela_iluminacion_toma_corriente,CP.superficie AS parcela_superficie,
    AP.descripcion_periodo,
    PAC.descripcion_periodo_agua,C.puntuacion_promedio   
from Campings as C
INNER JOIN Categoria_campings AS CA ON C.CategoriaCampingId=CA.id
INNER JOIN Caracteristicas_campings AS CC 
INNER JOIN Caracteristicas_parcelas AS CP ON CP.CaracteristicasCampingId=CC.id ON C.CaracteristicasCampingId=CC.id  
INNER JOIN Abierto_periodos AS AP ON CC.AbiertoPeriodoId=AP.id 
INNER JOIN Periodo_agua_calientes AS PAC ON CC.PeriodoAguaCalienteId=PAC.id
INNER JOIN Localidades AS L 
INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id
WHERE C.habilitado=1 AND C.id=:id;`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  if (!querySql[0])
    throw { error: 404, message: "No se encontró un camping con ese ID" };

  querySql[0].imagenes = await getCampingsImagenes(querySql[0].id);

  querySql[0].precios = await getPreciosCamping(querySql[0].id);

  return querySql[0];
};

//MUESTRA TODOS LOS CAMPING CON DETALLES E IMAGENES

export const getCampingsPorUserId = async (
  userId: number
): Promise<datosCamping[]> => {
  const querySql: datosCamping[] = await sequelize.query(
    `SELECT id, nombre_camping, habilitado FROM Campings WHERE UsuarioId=:userId`,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

// GET -> http://localhost:3001/api/campings
export const getCampingsTodosDatos = async (): Promise<datosCamping[]> => {
  const querySql: datosCamping[] = await sequelize.query(
    `SELECT C.id,C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,C.UsuarioId AS prop_camping_Id,C.abierto_fecha_desde , C.abierto_fecha_hasta, L.nombre AS localidad, L.id AS id_localidad, P.nombre AS provincia,P.id as id_provincia,CA.categoria,CA.id AS id_categoria,
    CC.duchas,CC.baños,CC.mascotas,CC.rodantes,CC.proveduria,CC.salon_sum,CC.restaurant,CC.vigilancia,CC.pileta,CC.estacionamiento,CC.juegos_infantiles,CC.maquinas_gimnasia,CC.wifi,
    CP.techada AS parcela_techada,CP.agua_en_parcela AS parcela_agua_en_parcela,CP.iluminacion_toma_corriente AS parcela_iluminacion_toma_corriente,CP.superficie AS parcela_superficie, AP.descripcion_periodo,
    PAC.descripcion_periodo_agua,
     RT.precio,C.puntuacion_promedio
    FROM Campings AS C
    INNER JOIN Relacion_campo_tarifas AS RT ON RT.CampingId=C.id AND RT.TarifaId=1
    INNER JOIN Localidades AS L INNER JOIN Provincias as P ON P.Id=L.ProvinciaId ON C.LocalidadeId=L.id  
    INNER JOIN Categoria_campings AS CA ON C.CategoriaCampingId=CA.id
    INNER JOIN Caracteristicas_campings AS CC INNER JOIN Caracteristicas_parcelas AS CP ON CP.CaracteristicasCampingId=CC.id ON C.CaracteristicasCampingId=CC.id
    INNER JOIN Abierto_periodos AS AP ON CC.AbiertoPeriodoId=AP.id
    INNER JOIN Periodo_agua_calientes AS PAC ON CC.PeriodoAguaCalienteId=PAC.id
    WHERE C.habilitado=1;`,
    { type: QueryTypes.SELECT }
  );
  const imagenesQuery: string[][] = await Promise.all(
    querySql.map((query) => getCampingsImagenes(query.id))
  );

  const resultsWithImagenes: datosCamping[] = querySql.map((query, i) => {
    query.imagenes = imagenesQuery[i];
    return query;
  });

  return resultsWithImagenes;
};

// FILTROS
// POST -> http://localhost:3001/api/campings
// QUERY TODOS LOS CAMPINGS CON DETALLE E IMAGENES
export const getCampingsTodos = async ({
  id_provincia,
  id_localidad,
  parcela_techada,
  parcela_agua_en_parcela,
  abierto_fecha_desde,
  abierto_fecha_hasta,
  parcela_iluminacion_toma_corriente,
  precio,
  reviews,
  id_categoria,
  parcela_superficie,
  mascotas,
  rodantes,
  proveduria,
  restaurant,
  pileta,
  vigilancia,
  maquinas_gimnasia,
  juegos_infantiles,
  salon_sum,
  wifi,

  estacionamiento,
}: datosFiltros): Promise<datosCamping[]> => {
  let filtros = " ";
  if (id_provincia) {
    // SI TIENE DATO
    filtros = filtros + `AND P.id=${id_provincia}`;
  }
  if (id_localidad) {
    // SI TIENE DATO
    filtros = filtros + ` AND L.id=${id_localidad}`;
  }

  if (abierto_fecha_desde) {
    // SI TIENE DATO
    filtros =
      filtros + ` AND C.abierto_fecha_desde <= DATE('${abierto_fecha_desde}')`;
  }
  if (abierto_fecha_hasta) {
    // SI TIENE DATO
    filtros =
      filtros + ` AND C.abierto_fecha_hasta >= DATE('${abierto_fecha_hasta}')`;
  }
  /*  console.log("LONGITUD ARRAY PRECIOS ES= ",precio.length); */
  if (precio.length > 0) {
    /* console.log(" el precio desde es = ",precio[0]); */
    filtros =
      filtros + ` AND (RT.precio>=${precio[0]} AND RT.precio<=${precio[1]})`;
  }

  //puntuacion_promedio
  //console.log("LONGITUD ARRAY Review ES= ", reviews.length);
  if (reviews.length <= 1) {
    //console.log("TIENE UN SOLO VALOR");
    reviews.forEach((element) => {
      filtros = filtros + ` AND C.puntuacion_promedio=('${element}')`;
    });
  }

  if (reviews.length > 1) {
    //console.log("TIENE MAS DE 1 VALOR")
    let filtrosPuntRevie = "";

    let ban: number = 0;
    reviews.forEach((element) => {
      /* console.log("BANDA ES = ",ban); */
      if (ban == 1) filtrosPuntRevie = filtrosPuntRevie + ` OR `;
      filtrosPuntRevie =
        filtrosPuntRevie + ` C.puntuacion_promedio=('${element}')`;
      ban = 1;
    });

    filtrosPuntRevie = ` ( ` + filtrosPuntRevie + ` ) `;
    filtros = filtros + ` AND `;
    filtros = filtros + filtrosPuntRevie;
  }

  //console.log("LONGITUD ARRAY categorias ES= ", id_categoria.length);
  if (id_categoria.length == 1) {
    /*  console.log("TIENE UN SOLO VALOR") */
    id_categoria.forEach((element) => {
      filtros = filtros + ` AND CA.id=('${element}')`;
    });
  }

  if (id_categoria.length > 1) {
    /*  console.log("TIENE MAS DE 1 VALOR") */
    let filtrosCateg = "";

    let ban: number = 0;
    id_categoria.forEach((element) => {
      /* console.log("BANDA ES = ",ban); */
      if (ban == 1) filtrosCateg = filtrosCateg + ` OR `;
      filtrosCateg = filtrosCateg + ` CA.id=('${element}')`;
      ban = 1;
    });

    filtrosCateg = ` ( ` + filtrosCateg + ` ) `;
    filtros = filtros + ` AND `;
    filtros = filtros + filtrosCateg;
  }

  if (parcela_superficie.length > 0) {
    //console.log("PARCELA SUPERFICIE = ", parcela_superficie.length)
    filtros =
      filtros +
      ` AND (CP.superficie>=${parcela_superficie[0]} AND CP.superficie<=${parcela_superficie[1]})`;
  }
  if (parcela_techada === true) {
    /* parcela_techada=('1') */
    filtros = filtros + ` AND CP.techada=('1')`;
  }

  if (parcela_agua_en_parcela === true) {
    filtros = filtros + ` AND CP.agua_en_parcela=('1')`;
  }
  if (parcela_iluminacion_toma_corriente === true) {
    filtros = filtros + ` AND CP.iluminacion_toma_corriente=('1')`;
  }
  if (mascotas === true) {
    // mascotas=true or =1 solo los que aceptan
    filtros = filtros + ` AND  CC.mascotas=('1')`;
    /*filtros = filtros + ` AND  CC.mascotas=('${mascotas}')`;*/
  }
  if (rodantes === true) {
    filtros = filtros + ` AND  CC.rodantes=('1')`;
    /*filtros = filtros + ` AND  CC.rodantes=('${rodantes}')`;*/
  }
  if (proveduria === true) {
    filtros = filtros + ` AND  CC.proveduria=('1')`;
    /*filtros = filtros + ` AND  CC.proveduria=('${proveduria}')`;*/
  }
  if (restaurant === true) {
    filtros = filtros + ` AND  CC.restaurant=('1')`;
    /*filtros = filtros + ` AND  CC.restaurant=('${restaurant}')`;*/
  }
  if (pileta === true) {
    filtros = filtros + ` AND  CC.pileta=('1')`;
    /*filtros = filtros + ` AND  CC.pileta=('${pileta}')`;*/
  }
  if (vigilancia === true) {
    filtros = filtros + ` AND  CC.vigilancia=('1')`;
    /*filtros = filtros + ` AND  CC.vigilancia=('${vigilancia}')`;*/
  }
  if (maquinas_gimnasia === true) {
    filtros = filtros + ` AND  CC.maquinas_gimnasia=('1')`;
    /*filtros = filtros + ` AND  CC.maquinas_gimnasia=('${maquinas_gimnasia}')`;*/
  }
  if (juegos_infantiles === true) {
    filtros = filtros + ` AND  CC.juegos_infantiles=('1')`;
    /*filtros = filtros + ` AND  CC.juegos_infantiles=('${juegos_infantiles}')`;*/
  }
  if (salon_sum === true) {
    filtros = filtros + ` AND  CC.salon_sum=('1')`;
    /* filtros = filtros + ` AND  CC.salon_sum=('${salon_sum}')`;*/
  }
  if (wifi === true) {
    filtros = filtros + ` AND  CC.wifi=('1')`;
    /*filtros = filtros + ` AND  CC.wifi=('${wifi}')`;*/
  }
  if (estacionamiento === true) {
    filtros = filtros + ` AND  CC.estacionamiento=('1')`;
    /*filtros = filtros + ` AND  CC.estacionamiento=('${estacionamiento}')`;*/
  }

  const querySql: datosCamping[] = await sequelize.query(
    `SELECT C.id,C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,C.UsuarioId AS prop_camping_Id,C.abierto_fecha_desde , C.abierto_fecha_hasta,L.nombre AS localidad, L.id AS id_localidad, P.nombre AS provincia,P.id as id_provincia,CA.categoria,CA.id AS id_categoria,
    CC.duchas,CC.baños,CC.mascotas,CC.rodantes,CC.proveduria,CC.salon_sum,CC.restaurant,CC.vigilancia,CC.pileta,CC.estacionamiento,CC.juegos_infantiles,CC.maquinas_gimnasia,CC.wifi,
    CP.techada AS parcela_techada,CP.agua_en_parcela AS parcela_agua_en_parcela,CP.iluminacion_toma_corriente AS parcela_iluminacion_toma_corriente,CP.superficie AS parcela_superficie, AP.descripcion_periodo,
    PAC.descripcion_periodo_agua,
     RT.precio, C.puntuacion_promedio
    FROM Campings AS C
    INNER JOIN Relacion_campo_tarifas AS RT ON RT.CampingId=C.id AND RT.TarifaId=1
    INNER JOIN Localidades AS L INNER JOIN Provincias as P ON P.Id=L.ProvinciaId ON C.LocalidadeId=L.id  
    INNER JOIN Categoria_campings AS CA ON C.CategoriaCampingId=CA.id
    INNER JOIN Caracteristicas_campings AS CC INNER JOIN Caracteristicas_parcelas AS CP ON CP.CaracteristicasCampingId=CC.id ON C.CaracteristicasCampingId=CC.id
    INNER JOIN Abierto_periodos AS AP ON CC.AbiertoPeriodoId=AP.id
    INNER JOIN Periodo_agua_calientes AS PAC ON CC.PeriodoAguaCalienteId=PAC.id
    WHERE C.habilitado=1 ${filtros};`,
    {
      type: QueryTypes.SELECT,
    }
  );

  const imagenesQuery: string[][] = await Promise.all(
    querySql.map((query) => getCampingsImagenes(query.id))
  );

  const resultsWithImagenes: datosCamping[] = querySql.map((query, i) => {
    query.imagenes = imagenesQuery[i];
    return query;
  });

  return resultsWithImagenes;
};

//ALTA DE CAMPING *********************
export const postCampingsCreate = async ({
  nombre_camping,
  descripcion_camping,
  direccion,
  telefono,
  longitud,
  latitud,
  abierto_fecha_desde,
  abierto_fecha_hasta,
  contacto_nombre,
  contacto_tel,
  CategoriaCampingId,
  LocalidadeId,
  wifi,
  duchas,
  baños,
  mascotas,
  rodantes,
  proveduria,
  salon_sum,
  restaurant,
  vigilancia,
  pileta,
  estacionamiento,
  juegos_infantiles,
  maquinas_gimnasia,
  AbiertoPeriodoId,
  PeriodoAguaCalienteId,
  parcela_techada,
  parcela_agua_en_parcela,
  parcela_iluminacion_toma_corriente,
  parcela_superficie,
  imagenes,
  mayores,
  menores,
  rodante,
  UsuarioId,
  userType,
}: createCamping): Promise<number> => {
  if (
    !nombre_camping ||
    !descripcion_camping ||
    !direccion ||
    !telefono ||
    !contacto_nombre ||
    !contacto_tel ||
    !CategoriaCampingId ||
    !LocalidadeId
  )
    throw {
      error: 406,
      message: "Faltan parámetros",
    };

  const [CaractCampingId]: [CaractCampingId: number] = await sequelize.query(
    `INSERT INTO Caracteristicas_campings(wifi,duchas,baños,mascotas,rodantes,proveduria,salon_sum,restaurant,vigilancia,pileta, estacionamiento,juegos_infantiles,maquinas_gimnasia,createdAt, updatedAt,AbiertoPeriodoId,PeriodoAguaCalienteId) VALUES (:wifi,:duchas,:banos,
    :mascotas,:rodantes,:proveduria,:salon_sum,
    :restaurant,:vigilancia,:pileta,:estacionamiento,:juegos_infantiles,:maquinas_gimnasia,NOW(),NOW(),:AbiertoPeriodoId,:PeriodoAguaCalienteId)`,
    {
      replacements: {
        wifi,
        duchas,
        banos: baños,
        mascotas,
        rodantes,
        proveduria,
        salon_sum,
        restaurant,
        vigilancia,
        pileta,
        estacionamiento,
        juegos_infantiles,
        maquinas_gimnasia,
        AbiertoPeriodoId,
        PeriodoAguaCalienteId,
      },
      type: QueryTypes.INSERT,
    }
  );

  const [CampingId]: [CampingId: number] = await sequelize.query(
    `INSERT INTO Campings(nombre_camping, descripcion_camping, direccion,telefono, longitud, latitud,abierto_fecha_desde,abierto_fecha_hasta, contacto_nombre, contacto_tel, createdAt, updatedAt, UsuarioId, CategoriaCampingId,CaracteristicasCampingId, LocalidadeId)
      VALUES (:nombre_camping,:descripcion_camping,:direccion,:telefono,:longitud,:latitud,:abierto_fecha_desde,:abierto_fecha_hasta,:contacto_nombre, 
      :contacto_tel,NOW(),NOW(),:UsuarioId,:CategoriaCampingId,:CaractCampingId,:LocalidadeId)`,
    {
      replacements: {
        nombre_camping,
        descripcion_camping,
        direccion,
        telefono,
        longitud,
        latitud,
        abierto_fecha_desde,
        abierto_fecha_hasta,
        contacto_nombre,
        contacto_tel,
        UsuarioId,
        CategoriaCampingId,
        CaractCampingId,
        LocalidadeId,
      },
      type: QueryTypes.INSERT,
    }
  );

  await sequelize.query(
    `INSERT INTO Caracteristicas_parcelas(techada,agua_en_parcela, iluminacion_toma_corriente,superficie,createdAt,updatedAt, CaracteristicasCampingId) VALUES (:parcela_techada,:parcela_agua_en_parcela,:parcela_iluminacion_toma_corriente,:parcela_superficie,NOW(),NOW(),
    :CaractCampingId)`,
    {
      replacements: {
        parcela_techada,
        parcela_agua_en_parcela,
        parcela_iluminacion_toma_corriente,
        parcela_superficie,
        CaractCampingId,
      },
      type: QueryTypes.INSERT,
    }
  );

  await Promise.all(
    imagenes.map((imagen) =>
      sequelize.query(
        `INSERT INTO Camping_imagenes(url,createdAt,updatedAt,CampingId) VALUES (:imagen,NOW(),NOW(),:CampingId)`,
        {
          replacements: { imagen, CampingId },
          type: QueryTypes.INSERT,
        }
      )
    )
  );

  let precios = [];
  precios.push(mayores);
  precios.push(menores);
  precios.push(rodante);

  precios.forEach((precio: number, i: number) =>
    sequelize.query(
      `INSERT INTO Relacion_campo_tarifas(precio, createdAt,updatedAt, TarifaId, CampingId) VALUES (${precio},NOW(),NOW(),
    ${i + 1},:CampingId)`,
      {
        replacements: { CampingId },
        type: QueryTypes.INSERT,
      }
    )
  );

  if (userType === process.env.TIPO_USUARIO)
    await sequelize.query(`UPDATE Usuarios SET TipoUsuarioId=:propietario`, {
      replacements: { proietario: process.env.TIPO_PROPIETARIO as string },
      type: QueryTypes.UPDATE,
    });

  return CampingId;
};

//Obtiene los favoritos de un usuario
export const getUserFavoritesCampings = async (
  userId: number
): Promise<datosBase[]> => {
  const querySql: datosBase[] = await sequelize.query(
    `SELECT C.id, C.nombre_camping AS nombre FROM Favoritos AS F INNER JOIN Campings AS C ON C.id=F.CampingId INNER JOIN Usuarios AS U ON U.id=F.UsuarioId WHERE U.id=:userId;`,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    }
  );

  const imagenesQuery: string[][] = await Promise.all(
    querySql.map((query) => getCampingsImagenes(query.id))
  );

  const resultsWithImagenes: datosBase[] = querySql.map((query, i) => {
    query.imagen = imagenesQuery[i][0];
    return query;
  });

  return resultsWithImagenes;
};

//Añade un camping a favoritos del usuario
export const addFavoriteCamping = async (
  campingId: number,
  userId: number
): Promise<datosBase[]> => {
  await sequelize.query(
    `INSERT INTO Favoritos (CampingId, UsuarioId, createdAt, updatedAt) VALUES (:campingId, :userId, NOW(), NOW())`,
    {
      replacements: { campingId, userId },
      type: QueryTypes.INSERT,
    }
  );

  return await getUserFavoritesCampings(userId);
};

//Elimina un camping de favoritos de un usuario
export const removeFavoriteCamping = async (
  campingId: number,
  userId: number
): Promise<number> => {
  await sequelize.query(
    `DELETE FROM Favoritos WHERE UsuarioId=:userId AND CampingId=:campingId`,
    {
      replacements: { userId, campingId },
      type: QueryTypes.DELETE,
    }
  );

  return +campingId;
};

//Dar de baja un camping
export const inhabilitarCamping = async (campingId: number) => {
  const reservasCamping = await getReservasPendientesByCampingId(+campingId);

  if (reservasCamping)
    throw {
      error: 400,
      message: "No se puede dar de baja un camping con reservas pendientes.",
    };

  await sequelize.query(
    `UPDATE Campings SET habilitado=0 WHERE id=:campingId`,
    {
      replacements: { campingId },
      type: QueryTypes.UPDATE,
    }
  );

  return +campingId;
};

//Actualiza un camping
// /api/camping/:campingId
export const putCamping = async (
  campingId: number,
  {
    nombre_camping,
    descripcion_camping,
    direccion,
    telefono,
    longitud,
    latitud,
    abierto_fecha_desde,
    abierto_fecha_hasta,
    contacto_nombre,
    contacto_tel,
    CategoriaCampingId,
    LocalidadeId,
    wifi,
    duchas,
    baños,
    mascotas,
    rodantes,
    proveduria,
    salon_sum,
    restaurant,
    vigilancia,
    pileta,
    estacionamiento,
    juegos_infantiles,
    maquinas_gimnasia,
    AbiertoPeriodoId,
    PeriodoAguaCalienteId,
    parcela_techada,
    parcela_agua_en_parcela,
    parcela_iluminacion_toma_corriente,
    parcela_superficie,
    imagenes,
    mayores,
    menores,
    rodante,
  }: createCamping
) => {
  console.log("holaaaaaa");
  const format_abierto_fecha_desde: string = new Date(abierto_fecha_desde)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const format_abierto_fecha_hasta: string = new Date(abierto_fecha_hasta)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  await sequelize.query(
    `UPDATE Campings SET nombre_camping=:nombre_camping, descripcion_camping=:descripcion_camping, direccion=:direccion, telefono=:telefono, longitud=:longitud, latitud=:latitud, abierto_fecha_desde=DATE(:format_abierto_fecha_desde), abierto_fecha_hasta=DATE(:format_abierto_fecha_hasta), contacto_nombre=:contacto_nombre, contacto_tel=:contacto_tel, updatedAt=NOW(), CategoriaCampingId=:CategoriaCampingId, LocalidadeId=:LocalidadeId WHERE id=:campingId`,
    {
      replacements: {
        nombre_camping,
        descripcion_camping,
        direccion,
        telefono,
        longitud,
        latitud,
        format_abierto_fecha_desde,
        format_abierto_fecha_hasta,
        contacto_nombre,
        contacto_tel,
        CategoriaCampingId,
        LocalidadeId,
        campingId,
      },
      type: QueryTypes.UPDATE,
    }
  );

  const [{ CaracteristicasCampingId }] = await sequelize.query(
    `SELECT CaracteristicasCampingId FROM Campings WHERE id=:campingId`,
    {
      replacements: { campingId },
      type: QueryTypes.SELECT,
    }
  );

  await sequelize.query(
    `
    UPDATE Caracteristicas_campings SET wifi=:wifi, duchas=:duchas, baños=:banos, mascotas=:mascotas, rodantes=:rodantes, proveduria=:proveduria, salon_sum=:salon_sum, restaurant=:restaurant, vigilancia=:vigilancia, pileta=:pileta, estacionamiento=:estacionamiento, juegos_infantiles=:juegos_infantiles, maquinas_gimnasia=:maquinas_gimnasia, AbiertoPeriodoId=:AbiertoPeriodoId, PeriodoAguaCalienteId=:PeriodoAguaCalienteId, updatedAt=NOW() WHERE id=:CaracteristicasCampingId
  `,
    {
      replacements: {
        wifi,
        duchas,
        banos: baños,
        mascotas,
        rodantes,
        proveduria,
        salon_sum,
        restaurant,
        vigilancia,
        pileta,
        estacionamiento,
        juegos_infantiles,
        maquinas_gimnasia,
        AbiertoPeriodoId,
        PeriodoAguaCalienteId,
        CaracteristicasCampingId,
      },
      type: QueryTypes.UPDATE,
    }
  );

  await sequelize.query(
    `
  UPDATE Caracteristicas_parcelas SET techada=:parcela_techada, agua_en_parcela=:parcela_agua_en_parcela, iluminacion_toma_corriente=:parcela_iluminacion_toma_corriente, superficie=:parcela_superficie,updatedAt=NOW() WHERE CaracteristicasCampingId=:CaracteristicasCampingId`,
    {
      replacements: {
        parcela_techada,
        parcela_agua_en_parcela,
        parcela_iluminacion_toma_corriente,
        parcela_superficie,
        CaracteristicasCampingId,
      },
      type: QueryTypes.UPDATE,
    }
  );

  await sequelize.query(
    `
  DELETE FROM Camping_imagenes WHERE CampingId=:campingId
  `,
    {
      replacements: { campingId },
      type: QueryTypes.DELETE,
    }
  );

  await Promise.all(
    imagenes.map((imagen: string) =>
      sequelize.query(
        `INSERT INTO Camping_imagenes(url,createdAt,updatedAt,CampingId) VALUES (:imagen,NOW(),NOW(),:campingId)`,
        {
          replacements: { imagen, campingId },
          type: QueryTypes.INSERT,
        }
      )
    )
  );

  await Promise.all(
    [mayores, menores, rodante].map((precio: number, i: number) =>
      sequelize.query(
        `UPDATE Relacion_campo_tarifas SET precio=:precio,updatedAt=NOW() WHERE CampingId=:campingId AND TarifaId=${
          i + 1
        }`,
        {
          replacements: { precio, campingId },
          type: QueryTypes.UPDATE,
        }
      )
    )
  );

  return { success: true };
};
