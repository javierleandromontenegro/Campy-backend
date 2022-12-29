import { reservas, reservasdetalle } from "../types/reservas";
import { stateBooking } from "../types/datosBase";//stateBookig es un objeto que tiene el id de los tipos de reserva
import { ResultSetHeader } from "mysql2";
const { sequelize } = require("../db");

//http://localhost:3001/api/campings/reservas
export const getReservas = async (): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, U.email, C.nombre_camping, C.id AS id_campings
      FROM Reservas AS R
      INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
      INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
      INNER JOIN Campings AS C ON C.id=R.CampingId 
      ORDER BY ER.prioridad`
  );
  return querySql;
}

//http://localhost:3001/api/reservas/1
export const getReservasByCampingId = async (id: string): Promise<reservas[]> => {
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
}

//Obtiene SOLO las reservas Pendientes de un camping
//Por ahora solo se usa como función auxiliar y no en una ruta
export const getReservasPendientesByCampingId = async (id: string): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, U.id as id_user, U.email, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C ON C.id=R.CampingId
    WHERE C.id=${id} AND ER.id='${stateBooking.PENDIENTE}'`
  );

  return querySql;
}


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

//Confirmar estado de una reserva pendiente
export const putEstadoReserva = async (reservaId: string, newEstado: string): Promise<{ reservaId: number, newEstado: string }> => {

  const [querySql]: [querySql: ResultSetHeader] = await sequelize.query(
    `UPDATE Reservas SET EstadoReservaId='${newEstado}' WHERE id=${reservaId} AND EstadoReservaId='${process.env.PENDIENTE}'`
  );

  if(!querySql.changedRows)
    throw { error: 400, message: 'El estado de la reserva ya es distinto a \'PENDIENTE\' o la reserva no existe.' }

  return { reservaId: +reservaId, newEstado }
};

// hacer el POST DE RESERVAS Y POST DE DETALLE DE RESERVA