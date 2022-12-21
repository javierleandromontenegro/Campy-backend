import {datosBase} from "../types/datosBase";
import datosCamping from "../types/datosCamping";
import { createCamping, campingCategorias, campingTarifas, campingAbiertoPeriodo, campingPeriodoAguaCaliente, campingHabilitado} from "../types/datosCamping";
import { datosFiltros } from "../types/datosFiltros";
import datosPrecios from "../types/datosPrecios";
import { campingsCantReservas } from "../types/datosBase";

const { sequelize } = require("../db");

// IMAGENES DE UN DETERMINADO CAMPING
const getCampingsImagenes= async (id: number): Promise<string[]> => {
  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.ID,CI.url
    from Campings as C
    INNER JOIN Camping_imagenes AS CI ON CI.CampingId=C.id
    WHERE C.habilitado=1 AND C.id=${id}`
  );

  return querySql.map((query: any):string => query.url);
}

// ESTA ES LA LISTA DE PRECIOS DE UN DETERMINADO CAMPING
export const getPreciosCamping = async (id: number): Promise<datosPrecios[]> => {
  const [querySql]: [querySql: datosPrecios[]] = await sequelize.query(
    `SELECT T.id, RT.precio, T.descrip_tarifa 
    FROM Relacion_campo_tarifas AS RT 
    INNER JOIN Tarifas AS T ON T.id=RT.TarifaId
    INNER JOIN Campings AS C ON C.id=RT.CampingId
    WHERE C.id=${id}`
  );

  return querySql;
}

// MUESTRA TODAS LAS CATEGORIAS DE CAMPING QUE HAY 
export const getCampingsCategorias = async (): Promise<campingCategorias[]> => {
  const [querySql]: [querySql: campingCategorias[]] = await sequelize.query(
    `SELECT id,categoria,cantidad_estrellas,descripcion_categoria FROM Categoria_campings`
  ); 

  return querySql;
}

// MUESTRA TODOS LOS CAMPINGS INDICANDO EL ESTADO DE HABILITACION
export const getCampingsHabilitacion = async (): Promise<campingHabilitado[]> => {
  const [querySql]: [querySql: campingHabilitado[]] = await sequelize.query(
    `SELECT C.id, C.nombre_camping, C.habilitado, L.nombre AS localidad, P.nombre AS provincia FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id`
  ); 

  return querySql;
}

// HABILITA O DESHABILITA UN DETERMINADO CAMPING
export const disableCamping = async (id: string, habilitar: number): Promise<{success: boolean}> => {
  if(habilitar < 0 || habilitar > 1) throw {
    error: 406, message: 'tipo de habilitación inválida'
  }

  const [updatedCamping] = await sequelize.query(
    `UPDATE Campings SET habilitado=${habilitar} WHERE id=${id};`
  );

  return {success: !!updatedCamping.changedRows}
};

//http://localhost:3001/api/campings/reservas
export const getCampingsCantReservas= async (): Promise<campingsCantReservas[]> => {
  const [querySql]: [querySql: campingsCantReservas[]] = await sequelize.query(
    `SELECT C.nombre_camping, COUNT(R.id) AS cant_reservas FROM Reservas AS R 
    INNER JOIN Campings AS C ON R.CampingId=C.id
    GROUP BY C.nombre_camping ORDER BY cant_reservas DESC`
  ); 

  return querySql;
}

// MUESTRA LOS TIPOS DE TARIFAS
export const getCampingTarifas = async (): Promise<campingTarifas[]> => {
  const [querySql]: [querySql: campingTarifas[]] = await sequelize.query(
    `SELECT id, descrip_tarifa FROM Tarifas`
  ); 

  return querySql;
};

export const getCampingAbiertoPeriodo = async (): Promise<campingAbiertoPeriodo[]> => {
  const [querySql]: [querySql: campingAbiertoPeriodo[]] = await sequelize.query(
    `SELECT id, descripcion_periodo FROM Abierto_periodos`
  ); 

  return querySql;
};

export const getCampingPeriodoAguaCaliente = async (): Promise<campingPeriodoAguaCaliente[]> => {
  const [querySql]: [querySql: campingPeriodoAguaCaliente[]] = await sequelize.query(
    `SELECT id, descripcion_periodo_agua FROM Periodo_agua_calientes`
  ); 

  return querySql;
};


// MUESTRA TODOS LOS CAMPINGS POR PROVINCIA
export const getCampingsPorProvincia = async (id: string): Promise<datosCamping[]> => {
  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.id as id, C.nombre_camping as nombre, L.nombre as localidad, P.nombre as provincia FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id WHERE C.habilitado=1 AND P.id=${id} ORDER BY L.nombre, C.nombre_camping;`
  );

  const imagenesQuery = await Promise.all(querySql.map(query => getCampingsImagenes(query.id)));

  const results = querySql.map((query, i) => {
    query.imagenes = imagenesQuery[i];
    return query;
  });

  return results;
}


// MUESTRA TODOS LOS CAMPINGS POR LOCALIDAD
export const getCampingsPorLocalidad = async (id: string): Promise<datosCamping[]> => {
  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.id as id, C.nombre_camping as nombre, L.nombre as localidad, P.nombre as provincia FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id WHERE C.habilitado=1 AND L.id=${id}  ORDER BY L.nombre, C.nombre_camping;`
  );

  const imagenesQuery: string[][] = await Promise.all(querySql.map(query => getCampingsImagenes(query.id)))

  const results = querySql.map((query, i) => {
    query.imagenes = imagenesQuery[i];
    return query;
  });

  return results;
}




// QUERY SOLO 1 CAMPING POR ID CON DETALLE E IMAGENES *******************

export const getCampingsPorId = async (id: string): Promise<datosCamping> => {
  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.id,C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,C.UsuarioId AS prop_camping_Id,C.abierto_fecha_desde , C.abierto_fecha_hasta, L.nombre AS localidad,P.nombre AS provincia,
    CA.categoria,CA.cantidad_estrellas,CC.duchas,CC.baños,CC.mascotas,CC.rodantes,CC.proveduria,CC.salon_sum,CC.restaurant,CC.vigilancia,CC.pileta,CC.estacionamiento,CC.juegos_infantiles,CC.maquinas_gimnasia,CC.wifi,
    CP.techada AS parcela_techada,CP.agua_en_parcela AS parcela_agua_en_parcela,CP.iluminacion_toma_corriente AS parcela_iluminacion_toma_corriente,CP.superficie AS parcela_superficie,
    AP.descripcion_periodo,
    PAC.descripcion_periodo_agua   
from Campings as C
INNER JOIN Categoria_campings AS CA ON C.CategoriaCampingId=CA.id
INNER JOIN Caracteristicas_campings AS CC 
INNER JOIN Caracteristicas_parcelas AS CP ON CP.CaracteristicasCampingId=CC.id ON C.CaracteristicasCampingId=CC.id  
INNER JOIN Abierto_periodos AS AP ON CC.AbiertoPeriodoId=AP.id 
INNER JOIN Periodo_agua_calientes AS PAC ON CC.PeriodoAguaCalienteId=PAC.id
INNER JOIN Localidades AS L 
INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id
WHERE C.habilitado=1 AND C.id=${id};`
  );

    if(!querySql[0]) throw { error: 404, message: 'No se encontró un camping con ese ID' };

  querySql[0].imagenes = await getCampingsImagenes(querySql[0].id);

  querySql[0].precios = await getPreciosCamping(querySql[0].id);

  return querySql[0];
}


// QUERY TODOS LOS CAMPINGS CON DETALLE E IMAGENES
export const getCampingsTodos = async ({ id_provincia,
  id_localidad,parcela_techada,parcela_agua_en_parcela,abierto_fecha_desde,
  abierto_fecha_hasta,parcela_iluminacion_toma_corriente,precio,id_categoria,parcela_superficie,
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
  estacionamiento }:datosFiltros): Promise<datosCamping[] > => {

    
    let filtros =" ";
    if(id_provincia){
      // SI TIENE DATO
      filtros = filtros + `AND P.id=${id_provincia}`;
    }
    if(id_localidad){
      // SI TIENE DATO
      filtros = filtros + ` AND L.id=${id_localidad}`;
    }
    
      if(abierto_fecha_desde){
      // SI TIENE DATO
      filtros = filtros + ` AND C.abierto_fecha_desde <= DATE('${abierto_fecha_desde}')`;
    }
    if(abierto_fecha_hasta){
      // SI TIENE DATO
      filtros = filtros + ` AND C.abierto_fecha_hasta >= DATE('${abierto_fecha_hasta}')`; 
    }
   /*  console.log("LONGITUD ARRAY PRECIOS ES= ",precio.length); */
     if (precio.length>0){
      /* console.log(" el precio desde es = ",precio[0]); */
      filtros = filtros + ` AND (RT.precio>=${precio[0]} AND RT.precio<=${precio[1]})`;
    }


      console.log("LONGITUD ARRAY categorias ES= ",id_categoria.length);  
    
      if (id_categoria.length==1){
       /*  console.log("TIENE UN SOLO VALOR") */
        id_categoria.forEach(element => {
                filtros = filtros + ` AND CA.id=('${element}')`;                     
        })
      }

      if(id_categoria.length>1){
       /*  console.log("TIENE MAS DE 1 VALOR") */
          filtros = filtros + ` AND `;
          let ban:number=0;
          id_categoria.forEach(element => {
            /* console.log("BANDA ES = ",ban); */
            if (ban==1) filtros = filtros + ` OR `;
            filtros = filtros + ` CA.id=('${element}')`; 
            ban=1;                             
          })
        }

    if (parcela_superficie.length>0){     
      console.log("PARCELA SUPERFICIE = ",parcela_superficie.length)
      filtros = filtros + ` AND (CP.superficie>=${parcela_superficie[0]} AND CP.superficie<=${parcela_superficie[1]})`;
    }
     if (parcela_techada===true){
      /* parcela_techada=('1') */
      filtros = filtros + ` AND CP.techada=('1')`;
    }

    if (parcela_agua_en_parcela===true){
      filtros = filtros + ` AND CP.agua_en_parcela=('1')`;
    }
    if (parcela_iluminacion_toma_corriente=== true){
      filtros = filtros + ` AND CP.iluminacion_toma_corriente=('1')`;
    }
    if (mascotas===true){
      // mascotas=true or =1 solo los que aceptan
      filtros = filtros + ` AND  CC.mascotas=('1')`;
      /*filtros = filtros + ` AND  CC.mascotas=('${mascotas}')`;*/
    }
    if (rodantes===true){
      filtros = filtros + ` AND  CC.rodantes=('1')`;
      /*filtros = filtros + ` AND  CC.rodantes=('${rodantes}')`;*/
    }
    if (proveduria===true){
      filtros = filtros + ` AND  CC.proveduria=('1')`;
     /*filtros = filtros + ` AND  CC.proveduria=('${proveduria}')`;*/
    }
    if (restaurant===true){
      filtros = filtros + ` AND  CC.restaurant=('1')`;
      /*filtros = filtros + ` AND  CC.restaurant=('${restaurant}')`;*/
    }
    if (pileta===true){
      filtros = filtros + ` AND  CC.pileta=('1')`;
      /*filtros = filtros + ` AND  CC.pileta=('${pileta}')`;*/
    }
    if (vigilancia===true){
      filtros = filtros + ` AND  CC.vigilancia=('1')`;
      /*filtros = filtros + ` AND  CC.vigilancia=('${vigilancia}')`;*/
    }
    if (maquinas_gimnasia===true){
      filtros = filtros + ` AND  CC.maquinas_gimnasia=('1')`;
      /*filtros = filtros + ` AND  CC.maquinas_gimnasia=('${maquinas_gimnasia}')`;*/
    }
    if (juegos_infantiles===true){
      filtros = filtros + ` AND  CC.juegos_infantiles=('1')`;
      /*filtros = filtros + ` AND  CC.juegos_infantiles=('${juegos_infantiles}')`;*/
    }
    if (salon_sum===true){
      filtros = filtros + ` AND  CC.salon_sum=('1')`;
     /* filtros = filtros + ` AND  CC.salon_sum=('${salon_sum}')`;*/
    }
    if (wifi===true){
      filtros = filtros + ` AND  CC.wifi=('1')`;
      /*filtros = filtros + ` AND  CC.wifi=('${wifi}')`;*/
    }
    if (estacionamiento===true){
      filtros = filtros + ` AND  CC.estacionamiento=('1')`;
      /*filtros = filtros + ` AND  CC.estacionamiento=('${estacionamiento}')`;*/
    } 
   /*  if reviews){
      filtros = filtros + ` AND  parcela_techada=('${reviews}')`;
    }
      */
   console.log("FILTROS ES = ",filtros);
    

  const [querySql]: [querySql: datosCamping[]] = await sequelize.query(
    `SELECT C.id,C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,C.UsuarioId AS prop_camping_Id,C.abierto_fecha_desde , C.abierto_fecha_hasta,L.nombre AS localidad, L.id AS id_localidad, P.nombre AS provincia,P.id as id_provincia,CA.categoria,CA.id AS id_categoria,
    CC.duchas,CC.baños,CC.mascotas,CC.rodantes,CC.proveduria,CC.salon_sum,CC.restaurant,CC.vigilancia,CC.pileta,CC.estacionamiento,CC.juegos_infantiles,CC.maquinas_gimnasia,CC.wifi,
    CP.techada AS parcela_techada,CP.agua_en_parcela AS parcela_agua_en_parcela,CP.iluminacion_toma_corriente AS parcela_iluminacion_toma_corriente,CP.superficie AS parcela_superficie, AP.descripcion_periodo,
    PAC.descripcion_periodo_agua,
     RT.precio
    FROM Campings AS C
    INNER JOIN Relacion_campo_tarifas AS RT ON RT.CampingId=C.id AND RT.TarifaId=1
    INNER JOIN Localidades AS L INNER JOIN Provincias as P ON P.Id=L.ProvinciaId ON C.LocalidadeId=L.id  
    INNER JOIN Categoria_campings AS CA ON C.CategoriaCampingId=CA.id
    INNER JOIN Caracteristicas_campings AS CC INNER JOIN Caracteristicas_parcelas AS CP ON CP.CaracteristicasCampingId=CC.id ON C.CaracteristicasCampingId=CC.id
    INNER JOIN Abierto_periodos AS AP ON CC.AbiertoPeriodoId=AP.id
    INNER JOIN Periodo_agua_calientes AS PAC ON CC.PeriodoAguaCalienteId=PAC.id
    WHERE C.habilitado=1 ${filtros};`
  );

  const imagenesQuery: string[][] = await Promise.all(querySql.map(query => getCampingsImagenes(query.id)));

  const resultsWithImagenes: datosCamping[] = querySql.map((query, i) => {
    query.imagenes = imagenesQuery[i];
    return query;
  });


  return resultsWithImagenes;
}

//ALTA DE CAMPING *********************
export const postCampingsCreate = async ({
  nombre_camping, descripcion_camping, direccion, telefono, contacto_nombre, contacto_tel, CategoriaCampingId, LocalidadeId,wifi,duchas,baños,mascotas,rodantes,proveduria,salon_sum,restaurant,vigilancia,pileta,estacionamiento,juegos_infantiles,maquinas_gimnasia,AbiertoPeriodoId,PeriodoAguaCalienteId,techada,agua_en_parcela, iluminacion_toma_corriente,superficie,imagenes,precios
}: createCamping): Promise<number> => {

  if(!nombre_camping || !descripcion_camping || !direccion || !telefono ||  !contacto_nombre || !contacto_tel || !CategoriaCampingId || !LocalidadeId) throw {
    error: 406,
    message: 'Faltan parámetros'
  };


  const [CaractCampingId]: [CaractCampingId:number[]] = await sequelize.query(  
    `INSERT INTO Caracteristicas_campings(wifi,duchas,baños,mascotas,rodantes,proveduria,salon_sum,restaurant,vigilancia,pileta, estacionamiento,juegos_infantiles,maquinas_gimnasia,createdAt, updatedAt,AbiertoPeriodoId,PeriodoAguaCalienteId) VALUES (${wifi},${duchas},${baños},
    ${mascotas},${rodantes},${proveduria},${salon_sum},
    ${restaurant},${vigilancia},${pileta},${estacionamiento},${juegos_infantiles},${maquinas_gimnasia},NOW(),NOW(),${AbiertoPeriodoId},${PeriodoAguaCalienteId})`
);

  const [CampingId]: [CampingId:number] = await sequelize.query(  
      `INSERT INTO Campings(nombre_camping, descripcion_camping, direccion,telefono, longitud, latitud,abierto_fecha_desde,abierto_fecha_hasta, contacto_nombre, contacto_tel, createdAt, updatedAt, UsuarioId, CategoriaCampingId,CaracteristicasCampingId, LocalidadeId)
      VALUES ('${nombre_camping}','${descripcion_camping}', '${direccion}','${telefono}','1234','1234', NOW(), NOW(),'${contacto_nombre}', 
      '${contacto_tel}', NOW(), NOW(), 1, ${CategoriaCampingId},${CaractCampingId},${LocalidadeId})`
  );

 await sequelize.query(  
    `INSERT INTO Caracteristicas_parcelas(techada,agua_en_parcela, iluminacion_toma_corriente,superficie,createdAt,updatedAt, CaracteristicasCampingId) VALUES (${techada},${agua_en_parcela},${iluminacion_toma_corriente},${superficie},NOW(),NOW(),
    ${CaractCampingId})`
);

await Promise.all(imagenes.map((imagen) => 
 sequelize.query(   
  `INSERT INTO Camping_imagenes(url,createdAt,updatedAt,CampingId) VALUES ('${imagen}',NOW(),NOW(),${CampingId})`

)
));


precios.forEach((e: any,i:number) => 
  sequelize.query(
          `INSERT INTO Relacion_campo_tarifas(precio, createdAt,updatedAt, TarifaId, CampingId) VALUES (${e},NOW(),NOW(),
    '${i+1}',${CampingId})`
  ) 
  )

  return CampingId;
}


export const getUserFavoritesCampings = async (userId: string): Promise<datosBase[]> => {
  const [querySql]: [querySql: datosBase[]] = await sequelize.query(
    `SELECT C.id, C.nombre_camping AS nombre FROM Favoritos AS F INNER JOIN Campings AS C ON C.id=F.CampingId INNER JOIN Usuarios AS U ON U.id=F.UsuarioId WHERE U.id=${userId};`
  );
    
  const imagenesQuery: string[][] = await Promise.all(querySql.map(query => getCampingsImagenes(query.id)));
   
  const resultsWithImagenes: datosBase[] = querySql.map((query, i) => {
    query.imagen = imagenesQuery[i][0];
    return query;
  });

  return resultsWithImagenes;
}

export const addFavoriteCamping = async (campingId: string, userId: string): Promise<datosBase[]> => {
  await sequelize.query(
    `INSERT INTO Favoritos (CampingId, UsuarioId, createdAt, updatedAt) VALUES (${campingId}, ${userId}, NOW(), NOW());`
  );

  return await getUserFavoritesCampings(userId);
}

export const removeFavoriteCamping = async (campingId: string, userId: string): Promise<number> => {
  await sequelize.query(
    `DELETE FROM Favoritos WHERE UsuarioId=${userId} AND CampingId=${campingId}; `
  );

  return +campingId;
}