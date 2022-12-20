"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCampingsCreate = exports.getCampingsImagenes = exports.getCampingsTodos = exports.getCampingsPorId = exports.getCampingsPorLocalidad = exports.getCampingsPorProvincia = exports.getCampingPeriodoAguaCaliente = exports.getCampingAbiertoPeriodo = exports.getCampingTarifas = exports.getCampingsCategorias = void 0;
const axios_1 = __importDefault(require("axios"));
/*import { Projectable } from "sequelize";
const { Categoria_camping } = require("../db");*/
const { sequelize } = require("../db");
/* export const getCampingsCategorias  = async (): Promise<Projectable> => await Categoria_camping.findAll(
    {
      attributes: [ 'id','categoria', 'cantidad_estrellas','descripcion_categoria']
    }
);  */
const getCampingsCategorias = async () => {
    const [querySql] = await sequelize.query(`SELECT id,categoria,cantidad_estrellas,descripcion_categoria FROM Categoria_campings`);
    return querySql;
};
exports.getCampingsCategorias = getCampingsCategorias;
const getCampingTarifas = async () => {
    const [querySql] = await sequelize.query(`SELECT id, descrip_tarifa FROM Tarifas`);
    return querySql;
};
exports.getCampingTarifas = getCampingTarifas;
const getCampingAbiertoPeriodo = async () => {
    const [querySql] = await sequelize.query(`SELECT id, descripcion_periodo FROM Abierto_periodos`);
    return querySql;
};
exports.getCampingAbiertoPeriodo = getCampingAbiertoPeriodo;
const getCampingPeriodoAguaCaliente = async () => {
    const [querySql] = await sequelize.query(`SELECT id, descripcion_periodo_agua FROM Periodo_agua_calientes`);
    return querySql;
};
exports.getCampingPeriodoAguaCaliente = getCampingPeriodoAguaCaliente;
const getCampingsPorProvincia = async (id) => {
    const [querySql] = await sequelize.query(`SELECT C.id as id, C.nombre_camping as nombre, L.nombre as localidad, P.nombre as provincia FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id WHERE C.habilitado=1 AND P.id=${id};`);
    const imagenesQuery = await Promise.all(querySql.map(query => axios_1.default.get(`${process.env.HOST}/api/campings/imagenes/${query.id}`))).then(res => res.map(res => res.data));
    const results = querySql.map((query, i) => {
        query.imagenes = imagenesQuery[i];
        return query;
    });
    return results;
};
exports.getCampingsPorProvincia = getCampingsPorProvincia;
const getCampingsPorLocalidad = async (id) => {
    const [querySql] = await sequelize.query(`SELECT C.id as id, C.nombre_camping as nombre, L.nombre as localidad, P.nombre as provincia FROM Campings AS C INNER JOIN Localidades AS L INNER JOIN Provincias AS P ON L.ProvinciaId=P.id ON C.LocalidadeId=L.id WHERE C.habilitado=1 AND L.id=${id};`);
    const imagenesQuery = await Promise.all(querySql.map(query => axios_1.default.get(`${process.env.HOST}/api/campings/imagenes/${query.id}`))).then(res => res.map(res => res.data));
    const results = querySql.map((query, i) => {
        query.imagenes = imagenesQuery[i];
        return query;
    });
    return results;
};
exports.getCampingsPorLocalidad = getCampingsPorLocalidad;
// QUERY SOLO 1 CAMPING POR ID CON DETALLE E IMAGENES *******************
const getCampingsPorId = async (id) => {
    const [querySql] = await sequelize.query(`SELECT C.id,C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,C.UsuarioId AS prop_camping_Id,C.cerrado_fecha_desde , C.cerrado_fecha_hasta, L.nombre AS localidad,P.nombre AS provincia,
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
    WHERE C.habilitado=1 AND C.id=${id};`);
    if (!querySql[0])
        return "No hay camping con ese ID";
    const imagenesQuery = await axios_1.default.get(`${process.env.HOST}/api/campings/imagenes/${querySql[0].id}`);
    querySql[0].imagenes = imagenesQuery.data;
    return querySql[0];
};
exports.getCampingsPorId = getCampingsPorId;
// QUERY TODOS LOS CAMPINGS CON DETALLE E IMAGENES
const getCampingsTodos = async () => {
    const [querySql] = await sequelize.query(`SELECT C.id,C.nombre_camping,C.descripcion_camping,C.direccion,C.telefono,C.longitud,C.latitud,C.UsuarioId AS prop_camping_Id,C.cerrado_fecha_desde , C.cerrado_fecha_hasta, L.nombre AS localidad, L.id AS id_localidad, P.nombre AS provincia,P.id as id_provincia,
    CA.categoria,CA.id AS id_categoria,CA.cantidad_estrellas,CC.duchas,CC.baños,CC.mascotas,CC.rodantes,CC.proveduria,CC.salon_sum,CC.restaurant,CC.vigilancia,CC.pileta,CC.estacionamiento,CC.juegos_infantiles,CC.maquinas_gimnasia,CC.wifi,
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
    WHERE C.habilitado=1;`);
    const imagenesQuery = await Promise.all(querySql.map(query => axios_1.default.get(`${process.env.HOST}/api/campings/imagenes/${query.id}`))).then(res => res.map(res => res.data));
    const results = querySql.map((query, i) => {
        query.imagenes = imagenesQuery[i];
        return query;
    });
    return results;
};
exports.getCampingsTodos = getCampingsTodos;
const getCampingsImagenes = async (id) => {
    const [querySql] = await sequelize.query(`SELECT C.ID,CI.url
    from Campings as C
    INNER JOIN Camping_imagenes AS CI ON CI.CampingId=C.id
    WHERE C.habilitado=1 AND C.id=${id}`);
    return querySql.map((query) => query.url);
};
exports.getCampingsImagenes = getCampingsImagenes;
//ALTA DE CAMPING *********************
const postCampingsCreate = async ({ nombre_camping, descripcion_camping, direccion, telefono, contacto_nombre, contacto_tel, CategoriaCampingId, LocalidadeId, wifi, duchas, baños, mascotas, rodantes, proveduria, salon_sum, restaurant, vigilancia, pileta, estacionamiento, juegos_infantiles, maquinas_gimnasia, AbiertoPeriodoId, PeriodoAguaCalienteId, techada, agua_en_parcela, iluminacion_toma_corriente, superficie, imagenes }) => {
    if (!nombre_camping || !descripcion_camping || !direccion || !telefono || !contacto_nombre || !contacto_tel || !CategoriaCampingId || !LocalidadeId)
        throw {
            error: 406,
            message: 'Faltan parámetros'
        };
    const [CaractCampingId] = await sequelize.query(`INSERT INTO Caracteristicas_campings(wifi,duchas,baños,mascotas,rodantes,proveduria,salon_sum,restaurant,vigilancia,pileta, estacionamiento,juegos_infantiles,maquinas_gimnasia,createdAt, updatedAt,AbiertoPeriodoId,PeriodoAguaCalienteId) VALUES (${wifi},${duchas},${baños},
    ${mascotas},${rodantes},${proveduria},${salon_sum},
    ${restaurant},${vigilancia},${pileta},${estacionamiento},${juegos_infantiles},${maquinas_gimnasia},NOW(),NOW(),${AbiertoPeriodoId},${PeriodoAguaCalienteId})`);
    const [CampingId] = await sequelize.query(`INSERT INTO Campings(nombre_camping, descripcion_camping, direccion,telefono, longitud, latitud,cerrado_fecha_desde,cerrado_fecha_hasta, contacto_nombre, contacto_tel, createdAt, updatedAt, UsuarioId, CategoriaCampingId,CaracteristicasCampingId, LocalidadeId)
      VALUES ('${nombre_camping}','${descripcion_camping}', '${direccion}','${telefono}','1234','1234', NOW(), NOW(),'${contacto_nombre}', 
      '${contacto_tel}', NOW(), NOW(), 1, ${CategoriaCampingId},${CaractCampingId},${LocalidadeId})`);
    await sequelize.query(`INSERT INTO Caracteristicas_parcelas(techada,agua_en_parcela, iluminacion_toma_corriente,superficie,createdAt,updatedAt, CaracteristicasCampingId) VALUES (${techada},${agua_en_parcela},${iluminacion_toma_corriente},${superficie},NOW(),NOW(),
    ${CaractCampingId})`);
    await Promise.all(imagenes.map((imagen) => sequelize.query(`INSERT INTO Camping_imagenes(url,createdAt,updatedAt,CampingId) VALUES ('${imagen}',NOW(),NOW(),${CampingId})`)));
    return CampingId;
};
exports.postCampingsCreate = postCampingsCreate;
