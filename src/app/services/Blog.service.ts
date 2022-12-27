import { datosComentario, datosPost } from "../types/datosBlog";

const { sequelize } = require("../db");

export const postBlogCreate = async ({titulo, texto, imagenes}: datosPost): Promise<number> => {
  
    if (!titulo || !texto || !imagenes) throw {
      error: 406,
      message: 'Faltan parámetros'
    };

    const [postBlogId]: [postBlogId: number] = await sequelize.query(
        `INSERT INTO Posts_usuarios (titulo, texto, fecha, createdAt, updatedAt, UsuarioId) VALUES ('${titulo.replace("'", "\\'")}', '${texto.replace("'", "\\'")}', NOW(), NOW(), NOW(), 42)`
    )

    console.log(postBlogId);
    

    await Promise.all(imagenes.map((imagenes) =>
      sequelize.query(
        `INSERT INTO Posts_imagenes(url,createdAt,updatedAt, PostsUsuarioId) 
        VALUES ('${imagenes}',NOW(),NOW(),${postBlogId})`
  
      )
    ));
  
    return postBlogId;
  }


  export const postBlogComentario = async ({comentario}: datosComentario): Promise<number> => {
  
    if (!comentario) throw {
      error: 406,
      message: 'Faltan parámetros'
    };

    const [postBlogComentario] = await sequelize.query(
        `INSERT INTO Posts_comentarios (comentario, createdAt, updatedAt, UsuarioId, PostUsuarioId) VALUES ('${comentario.replace("'", "\\'")}', NOW(), NOW(), 42)`
    )

    console.log(postBlogComentario);
  
    return postBlogComentario;
  }

  export const getPostImagenes = async (id: number): Promise<string[]> => {
    const [querySql]: [querySql: datosPost[]] = await sequelize.query(
      `SELECT PU.ID,PI.url FROM Posts_imagenes AS PI INNER JOIN Posts_usuarios as PU ON PU.id=PI.PostsUsuarioId WHERE PU.id=${id}`
    );
    
    return querySql.map((query: any): string => query.url);
  }
