import { reservas, reservasdetalle } from "../types/reservas";
const { sequelize } = require("../db");

// http://localhost:3001/api/reservas
export const getReservas = async (): Promise<reservas[]> => {
  const [querySql]: [querySql: reservas[]] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.descrip_estado, U.id, U.username, C.id, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C ON C.id=R.CampingId`
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