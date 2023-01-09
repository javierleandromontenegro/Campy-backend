import { reservas, reservasdetalle } from "../types/reservas";
import { reservaCreate, reservaPago } from "../types/reservas";
import { getUser } from "./Usuario.service";
import { datosUsuario } from "../types/datosUsuario";
import { sendEmail } from "../email/sendEmail";
import { QueryTypes } from "sequelize";
import templateReserve from "../email/templateReserve";
const { sequelize } = require("../db");

//http://localhost:3001/api/campings/reservas
export const getReservas = async (): Promise<reservas[]> => {
  const querySql: reservas[] = await sequelize.query(
    `SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.createdAt, R.cant_noches, R.total, ER.id AS id_estado, U.email, C.nombre_camping, C.id AS id_campings
      FROM Reservas AS R
      INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
      INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
      INNER JOIN Campings AS C ON C.id=R.CampingId 
      ORDER BY ER.prioridad`,
    {
      type: QueryTypes.SELECT,
    }
  );
  return querySql;
};

//OBTIENE UNA SOLA RESERVA POR ID, SOLO ES UTILIZADO DE MANERA AUXILIAR POR AHORA
export const getReservaById = async (id: number): Promise<reservas> => {
  const querySql: reservas = await sequelize.query(
    `
   SELECT R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, P.email, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C
    INNER JOIN Usuarios AS P ON C.UsuarioId=P.id 
    ON C.id=R.CampingId 
    WHERE R.id=:id
  `,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

//http://localhost:3001/api/reservas/1
export const getReservasByCampingId = async (
  id: number,
  filter: boolean = false
): Promise<reservas[]> => {
  let filterCondition = filter
    ? `AND R.EstadoReservaId!='${process.env.VENCIDA}' AND R.EstadoReservaId!='${process.env.RECHAZADA}'`
    : "";

  const querySql: reservas[] = await sequelize.query(
    `SELECT R.createdAt AS fecha, R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, ER.descrip_estado AS estado, R.Estado_transaccion, P.email, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C
    INNER JOIN Usuarios AS P ON C.UsuarioId=P.id 
    ON C.id=R.CampingId 
    WHERE C.id=:id ${filterCondition}
    ORDER BY R.createdAt DESC`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

//Obtiene SOLO las reservas Pendientes de un camping
//http://localhost:3001/api/reservas/campings/:campindId
export const getReservasPendientesByCampingId = async (
  campingId: number
): Promise<number> => {
  const querySql: reservas[] = await sequelize.query(
    `SELECT R.createdAt, R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, U.id as id_user, U.email, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C ON C.id=R.CampingId
    WHERE C.id=:campingId AND ER.id=:EstadoReservaId
    ORDER BY R.createdAt`,
    {
      replacements: {
        campingId,
        EstadoReservaId: process.env.PENDIENTE as string,
      },
      type: QueryTypes.SELECT,
    }
  );

  return querySql.length;
};

//http://localhost:3001/api/reservas/usuarios/:userId
export const getReservasByUserId = async (id: number): Promise<reservas[]> => {
  const querySql: reservas[] = await sequelize.query(
    `SELECT R.createdAt AS fecha, R.id,R.fecha_desde_reserva, R.fecha_hasta_reserva, R.cant_noches, R.total, ER.id AS id_estado, ER.descrip_estado AS estado, R.Estado_transaccion, P.email, C.nombre_camping, C.id AS id_campings
    FROM Reservas AS R
    INNER JOIN Estado_reservas AS ER ON ER.id=R.EstadoReservaId
    INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
    INNER JOIN Campings AS C
    INNER JOIN Usuarios AS P ON C.UsuarioId=P.id 
    ON C.id=R.CampingId 
    WHERE U.id=:id
    ORDER BY R.createdAt DESC`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

//http://localhost:3001/api/reservas/propietarios/:ownerId
export const getReservasByOwnerId = async (
  ownerId: number
): Promise<reservas[]> => {
  const querySql: reservas[] = await sequelize.query(
    `SELECT R.id, C.nombre_camping FROM Reservas AS R
    INNER JOIN Campings AS C
    ON C.id=R.CampingId
    WHERE C.UsuarioId=:ownerId AND R.EstadoReservaId=':EstadoReservaId'`,
    {
      replacements: { ownerId, EstadoReservaId: process.env.PENDIENTE },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

//http://localhost:3001/api/reservas/detalle/2
export const getReservaDetalle = async (
  id: number
): Promise<reservasdetalle[]> => {
  const querySql: reservasdetalle[] = await sequelize.query(
    `SELECT T.descrip_tarifa, D.cantidad, D.precio, D.subtotal
    FROM Detalle_reservas AS D 
    INNER JOIN Reservas AS R ON D.ReservaId=R.id
    INNER JOIN Tarifas AS T ON D.TarifaId=T.id WHERE D.ReservaId=:id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
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
    `INSERT INTO Reservas(fecha_desde_reserva, fecha_hasta_reserva, cant_noches, total, createdAt, updatedAt, EstadoReservaId, UsuarioId, CampingId) VALUES (DATE(:fecha_desde_reserva),DATE(:fecha_hasta_reserva),:cant_noches,:total,NOW(),NOW(),:EstadoReservaId,:UsuarioId,:CampingId)`,
    {
      replacements: {
        fecha_desde_reserva,
        fecha_hasta_reserva,
        cant_noches,
        total,
        EstadoReservaId: process.env.PENDIENTE as string,
        UsuarioId,
        CampingId,
      },
      type: QueryTypes.INSERT,
    }
  );

  //CARGA DETALLE DE CANT
  let detalle = [];
  detalle.push(cantMayores);
  detalle.push(cantMenores);
  detalle.push(extraRodante);
  console.log("MOSTRAR DETALLE ARRAY= ", detalle);

  detalle.forEach((cantidad: number, i: number) =>
    sequelize.query(
      `INSERT INTO Detalle_reservas(cantidad, subtotal, createdAt, updatedAt, ReservaId, TarifaId) VALUES (:cantidad,0,NOW(),NOW(),:ReservaId,${
        i + 1
      })`,
      {
        replacements: { cantidad, ReservaId },
        type: QueryTypes.INSERT,
      }
    )
  );

  // CARGA DETALLE DE PRECIOS AL MOMENTO DE LA RESERVA
  let SubtotalArray = [];
  SubtotalArray.push(precioMayores);
  SubtotalArray.push(precioMenores);
  SubtotalArray.push(precioextraRodante);
  console.log("MOSTRAR SUBTOTALES ARRAY= ", SubtotalArray);

  SubtotalArray.forEach((precio: number, i: number) =>
    sequelize.query(
      `UPDATE Detalle_reservas SET precio=:precio WHERE ReservaId=:ReservaId AND TarifaId=${
        i + 1
      }`,
      {
        replacements: { precio, ReservaId },
        type: QueryTypes.UPDATE,
      }
    )
  );
  // ACTUALIZA SUBTOTAL EN DETALLE DE RESERVA
  await sequelize.query(
    `UPDATE Detalle_reservas SET subtotal=(cantidad*precio) WHERE ReservaId=:ReservaId`,
    {
      replacements: { ReservaId },
      type: QueryTypes.UPDATE,
    }
  );

  const [user, reserve, detail]: [
    user: datosUsuario,
    reserve: reservas,
    detail: reservasdetalle[]
  ] = await Promise.all([
    getUser(+UsuarioId),
    getReservaById(ReservaId),
    getReservaDetalle(ReservaId),
  ]);

  const [mayores, menores, rodante] = detail;

  //ENVIA EL MAIL DE DETALLE DE RESERVA AL VIAJERO
  sendEmail({
    userEmail: user.email,
    subject: "Confirmación de reserva",
    html: templateReserve(
      user.username,
      reserve.nombre_camping,
      reserve.email,
      reserve.fecha_desde_reserva,
      reserve.fecha_hasta_reserva,
      reserve.cant_noches,
      mayores.cantidad,
      mayores.precio,
      menores.cantidad,
      menores.precio,
      rodante.cantidad,
      rodante.precio,
      reserve.total
    ),
  });

  return ReservaId;
};

//ACTUALIZA LA RESERVA CON DATOS DE MERCADO PAGO COMO SER ID_TRANSACCION Y EL ESTADO DE LA MISMA
export const postReservaPago = async ({
  ID_reserva,
  ID_transaccion,
  Estado_transaccion,
}: reservaPago): Promise<object> => {
  if (!ID_reserva || !ID_transaccion || !Estado_transaccion)
    throw {
      error: 406,
      message:
        "Faltan parámetros del id y estado de transacción de mercado pago",
    };

  console.log("EL Estado_transaccion", Estado_transaccion);

  let axuEstado: string = "";
  if (Estado_transaccion == "paid") {
    console.log("El estado es ABONADA");
    axuEstado = String(process.env.ABONADA); /* Abonada */
  }

  if (Estado_transaccion == "Rejected") {
    console.log("El estado es RECHAZADO EL PAGO");
    axuEstado = String(process.env.RECHAZADA); /* Rechazada */
  }

  if (Estado_transaccion == "Pending") {
    console.log("El estado sigue PENDIENTE");
    axuEstado = String(process.env.PENDIENTE); /* Pendiente */
  }

  const ReservaPago: object = await sequelize.query(
    `UPDATE Reservas SET EstadoReservaId=:axuEstado, ID_transaccion=:ID_transaccion,Estado_transaccion=:Estado_transaccion WHERE id=:ID_reserva`,
    {
      replacements: {
        axuEstado,
        ID_transaccion,
        Estado_transaccion,
        ID_reserva,
      },
      type: QueryTypes.UPDATE,
    }
  );

  return ReservaPago;
};
