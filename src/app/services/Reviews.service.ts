import { datosReviews, createReview } from "../types/datosReviews";

const { sequelize } = require("../db")


//GET -> http://localhost:3001/api/reviews/8
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

// POST-> http://localhost:3001/api/reviews
  export const postReviewsCreate = async ({ usuario,camping,puntaje,comentario}: createReview): Promise<number> => {
    
    const [ReviewId]: [ReviewId: number] = await sequelize.query(
      `INSERT INTO Reviews(comentario, fecha, puntaje,createdAt, updatedAt, CampingId, UsuarioId) VALUES ('${comentario}',NOW(),'${puntaje}',NOW(),NOW(),'${camping}','${usuario}')`
    );

    const [[PromedioId]]: [[PromedioId: {promedio:number}]] = await sequelize.query(
      `SELECT AVG(puntaje) AS promedio from Reviews AS R 
      WHERE CampingId=${camping}
      GROUP BY CampingId`
    ); 

    //console.log("PROMEDIO ES = ",PromedioId);
    await sequelize.query(
      `UPDATE Campings SET puntuacion_promedio='${PromedioId.promedio}' WHERE id=${camping}`
    );

    return ReviewId;
  }    