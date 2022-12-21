import { datosReviews } from "../types/datosReviews";

const { sequelize } = require("../db")

export const getCampingReviews = async (id: number): Promise<datosReviews[]> => {
    const [querySql]: [querySql: datosReviews[]] = await sequelize.query(
      `SELECT C.id, R.puntaje, U.username, R.fecha, R.comentario
      FROM Reviews AS R
      INNER JOIN Campings AS C ON C.id=R.CampingId
      INNER JOIN Usuarios AS U ON U.id=R.UsuarioId
      WHERE C.id=${id}`
    );
  
    return querySql;
  }