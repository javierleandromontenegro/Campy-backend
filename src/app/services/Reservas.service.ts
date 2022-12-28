import { reservas, reservasdetalle , reservaCreate} from "../types/reservas";
const { sequelize } = require("../db");

// http://localhost:3001/api/reservas
export const getReservas = async (): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(

    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, R.createdAt, ER.descrip_estado, U.id, U.username, C.id, C.nombre_camping, C.id AS id_campings
      FROM Reservas AS R
      INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
      INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
      INNER JOIN Campings AS C ON C.id=R.CampingId ORDER BY R.createdAt`
  );
  return querySql;
}

//http://localhost:3001/api/reservas/1
export const getReservasByCampingId = async (id: string): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.descrip_estado, U.id, U.username, C.id, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C ON C.id=R.CampingId
    WHERE C.id=${id}`
  );
  return querySql;
}


//http://localhost:3001/api/reservas/usuarios/:userId
export const getReservasByUserId = async (id: string): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.descrip_estado, P.email AS correo_prop, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C
    INNER JOIN Usuarios AS P ON C.UsuarioId=P.id 
    ON C.id=R.CampingId 
    WHERE U.id=${id}`
  );

  return querySql;
}

//http://localhost:3001/api/reservas/detalle/2
export const getReservaDetalle = async (id: string): Promise<reservasdetalle[]> => {
  const [querySql]: [querySql: reservasdetalle[]] = await sequelize.query(
    `SELECT T.descrip_tarifa, D.cantidad, D.subtotal
    FROM Detalle_reservas AS D 
    INNER JOIN Reservas AS R ON D.ReservaId=R.id
    INNER JOIN Tarifas AS T ON D.TarifaId=T.id WHERE D.ReservaId=${id}`
  );

  return querySql;
}

// hacer el POST DE RESERVAS Y POST DE DETALLE DE RESERVA

//http://localhost:3001/api/reservas/create
export const postReservaCreate = async ({fecha_desde_reserva, fecha_hasta_reserva, cant_noches, total, UsuarioId, CampingId
  }: reservaCreate): Promise<number> => {

  /* if (!nombre_camping || !descripcion_camping || !direccion || !telefono || !contacto_nombre || !contacto_tel || !CategoriaCampingId || !LocalidadeId) throw {
    error: 406,
    message: 'Faltan parámetros'
  };
 */


  const [ReservaId]: [ReservaId: number] = await sequelize.query(
    `INSERT INTO Reservas(fecha_desde_reserva, fecha_hasta_reserva, cant_noches, total, createdAt, updatedAt, EstadoReservaId, UsuarioId, CampingId) VALUES ('${fecha_desde_reserva}','${fecha_hasta_reserva}',${cant_noches},${total},NOW(),NOW(),1,${UsuarioId},${CampingId})`
  );

  /* await sequelize.query(
    `INSERT INTO Caracteristicas_parcelas(techada,agua_en_parcela, iluminacion_toma_corriente,superficie,createdAt,updatedAt, CaracteristicasCampingId) VALUES (${techada},${agua_en_parcela},${iluminacion_toma_corriente},${superficie},NOW(),NOW(),
    ${CaractCampingId})`
  ); */

  /* await Promise.all(imagenes.map((imagen) =>
    sequelize.query(
      `INSERT INTO Camping_imagenes(url,createdAt,updatedAt,CampingId) VALUES ('${imagen}',NOW(),NOW(),${CampingId})`

    )
  )); */

  /* let precios=[];
  precios.push(mayores);
  precios.push(menores);
  precios.push(rodante);
  console.log("PRECIOS",precios);
 
   precios.forEach((e: any, i: number) =>
    sequelize.query(
      `INSERT INTO Relacion_campo_tarifas(precio, createdAt,updatedAt, TarifaId, CampingId) VALUES (${e},NOW(),NOW(),
    '${i + 1}',${CampingId})`
    )
  )  */

  return ReservaId;
}