import { reservas, reservasdetalle } from "../types/reservas";
import { stateBooking } from "../types/datosBase"; //stateBookig es un objeto que tiene el id de los tipos de reserva
import { ResultSetHeader } from "mysql2";
import { reservaCreate, reservaPago } from "../types/reservas";
const { sequelize } = require("../db");

//http://localhost:3001/api/campings/reservas
export const getReservas = async (): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.createdAt, R.cant_noches, R.total, ER.id AS id_estado, U.email, C.nombre_camping, C.id AS id_campings
      FROM Reservas AS R
      INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
      INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
      INNER JOIN Campings AS C ON C.id=R.CampingId 
      ORDER BY ER.prioridad`
  );
  return querySql;
};

//http://localhost:3001/api/reservas/1
export const getReservasByCampingId = async (
  id: string
): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, U.email, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C ON C.id=R.CampingId
    WHERE C.id=${id} 
    ORDER BY ER.prioridad`
  );

  return querySql;
};

//Obtiene SOLO las reservas Pendientes de un camping
//Por ahora solo se usa como función auxiliar y no en una ruta
export const getReservasPendientesByCampingId = async (
  id: string
): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, U.id as id_user, U.email, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C ON C.id=R.CampingId
    WHERE C.id=${id} AND ER.id='${stateBooking.PENDIENTE}'`
  );

  return querySql;
};

//http://localhost:3001/api/reservas/usuarios/:userId
export const getReservasByUserId = async (id: string): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, P.email, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C
    INNER JOIN Usuarios AS P ON C.UsuarioId=P.id 
    ON C.id=R.CampingId 
    WHERE U.id=${id} 
    ORDER BY ER.prioridad`
  );

  return querySql;
};

//http://localhost:3001/api/reservas/propietarios/:ownerId
export const getReservasByOwnerId = async (
  ownerId: string
): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id, C.nombre_camping FROM Reservas AS R
    INNER JOIN Campings AS C
    ON C.id=R.CampingId
    WHERE C.UsuarioId=${ownerId} AND R.EstadoReservaId='${process.env.PENDIENTE}'`
  );

  return querySql;
};

//http://localhost:3001/api/reservas/detalle/2
export const getReservaDetalle = async (
  id: string
): Promise<reservasdetalle[]> => {
  const [querySql]: [querySql: reservasdetalle[]] = await sequelize.query(
    `SELECT T.descrip_tarifa, D.cantidad, D.precio, D.subtotal
    FROM Detalle_reservas AS D 
    INNER JOIN Reservas AS R ON D.ReservaId=R.id
    INNER JOIN Tarifas AS T ON D.TarifaId=T.id WHERE D.ReservaId=${id}`
  );

  return querySql;
};

// hacer el POST DE RESERVAS Y POST DE DETALLE DE RESERVA

//http://localhost:3001/api/reservas/create
export const postReservaCreate = async ({
  fecha_desde_reserva,
  fecha_hasta_reserva,
  cant_noches,
  total,
  UsuarioId,
  CampingId,
  cantMayores,
  cantMenores,
  extraRodante,
  precioMayores,
  precioMenores,
  precioextraRodante,
}: reservaCreate): Promise<number> => {
  /* if (!nombre_camping || !descripcion_camping || !direccion || !telefono || !contacto_nombre || !contacto_tel || !CategoriaCampingId || !LocalidadeId) throw {
    error: 406,
    message: 'Faltan parámetros'
  };
 */
  const [ReservaId]: [ReservaId: number] = await sequelize.query(
    `INSERT INTO Reservas(fecha_desde_reserva, fecha_hasta_reserva, cant_noches, total, createdAt, updatedAt, EstadoReservaId, UsuarioId, CampingId) VALUES ('${fecha_desde_reserva}','${fecha_hasta_reserva}',${cant_noches},${total},NOW(),NOW(),'${process.env.PENDIENTE}',${UsuarioId},${CampingId})`
  );

  //CARGA DETALLE DE CANT
  let detalle = [];
  detalle.push(cantMayores);
  detalle.push(cantMenores);
  detalle.push(extraRodante);
  console.log("MOSTRAR DETALLE ARRAY= ", detalle);

  detalle.forEach((e: any, i: number) =>
    sequelize.query(
      `INSERT INTO Detalle_reservas(cantidad, subtotal, createdAt, updatedAt, ReservaId, TarifaId) VALUES (${e},0,NOW(),NOW(),${ReservaId},${
        i + 1
      })`
    )
  );

  // CARGA DETALLE DE PRECIOS AL MOMENTO DE LA RESERVA
  let SubtotalArray = [];
  SubtotalArray.push(precioMayores);
  SubtotalArray.push(precioMenores);
  SubtotalArray.push(precioextraRodante);
  console.log("MOSTRAR SUBTOTALES ARRAY= ", SubtotalArray);

  SubtotalArray.forEach((e: any, i: number) =>
    sequelize.query(
      `UPDATE Detalle_reservas SET precio=${e} WHERE ReservaId=${ReservaId} AND TarifaId=${
        i + 1
      }`
    )
  );
  // ACTUALIZA SUBTOTAL EN DETALLE DE RESERVA
  await sequelize.query(
    `UPDATE Detalle_reservas SET subtotal=(cantidad*precio) WHERE ReservaId=${ReservaId}`
  );

  return ReservaId;
};

//Confirmar estado de una reserva pendiente
export const putEstadoReserva = async (
  reservaId: string,
  newEstado: string
): Promise<{ reservaId: number; newEstado: string }> => {
  const [querySql]: [querySql: ResultSetHeader] = await sequelize.query(
    `UPDATE Reservas SET EstadoReservaId='${newEstado}' WHERE id=${reservaId} AND EstadoReservaId='${process.env.PENDIENTE}'`
  );

  if (!querySql.changedRows)
    throw {
      error: 400,
      message:
        "El estado de la reserva ya es distinto a 'PENDIENTE' o la reserva no existe.",
    };

  return { reservaId: +reservaId, newEstado };
};

//ACTUALIZA LA RESERVA CON DATOS DE MERCADO PAGO COMO SER ID_TRANSACCION Y EL ESTADO DE LA MISMA
export const postReservaPago = async ({
  ID_reserva,
  ID_transaccion,
  Estado_transaccion,
}: reservaPago): Promise<number> => {

if (!ID_reserva || !ID_transaccion || !Estado_transaccion) throw {
    error: 406,
    message: 'Faltan parámetros del id y estado de transacción de mercado pago'
  };

  console.log("EL Estado_transaccion",Estado_transaccion);

  let axuEstado='';
  if(Estado_transaccion=='Aproved'){
    console.log("El estado es ABONADA");
    axuEstado="02bdc29e-f809-4bf2-9e3a-4a88fa1c174a"; /* Abonada */
  }

  if(Estado_transaccion=='Rejected'){
    console.log("El estado es RECHAZADO EL PAGO");
    axuEstado="982a67e4-7dbb-49de-8464-a15f1193f40d"; /* Rechazada */
  }

  if(Estado_transaccion=='Pending'){
    console.log("El estado sigue PENDIENTE");
    axuEstado="bbd82337-7bea-4d9c-b948-41140c060a2f"; /* Pendiente */
  }

  const [ReservaPago]: [ReservaId: number] = await sequelize.query(
    `UPDATE Reservas SET EstadoReservaId=${axuEstado}, ID_transaccion='${ID_transaccion}',Estado_transaccion='${Estado_transaccion}' WHERE id=${ID_reserva}`
  );

  return ReservaPago;
};