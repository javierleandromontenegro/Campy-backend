import { datosAllPost, datosComentario, datosPost } from "../types/datosBlog";
import { allPropertiesComentario, allPropertiesPost } from "../types/Properties";

const { sequelize } = require("../db");

export const postBlogCreate = async ({ titulo, texto, imagenes, usuarioId }: datosPost): Promise<number> => {

  if (!titulo || !texto || !imagenes) throw {
    error: 406,
    message: 'Faltan parámetros'
  };

  const [postBlogId]: [postBlogId: number] = await sequelize.query(
    `INSERT INTO Posts_usuarios (titulo, texto, fecha, createdAt, updatedAt, UsuarioId) 
        VALUES ('${titulo.replace("'", "\\'")}', '${texto.replace("'", "\\'")}', NOW(), NOW(), NOW(), ${usuarioId})`
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


export const postBlogComentario = async ({ comentario, usuarioId, postId }: datosComentario): Promise<number> => {

  if (!comentario) throw {
    error: 406,
    message: 'Faltan parámetros'
  };

  const [postBlogComentario] = await sequelize.query(
    `INSERT INTO Posts_comentarios (comentario, createdAt, updatedAt, UsuarioId, PostsUsuarioId) VALUES ('${comentario.replace("'", "\\'")}', NOW(), NOW(), ${usuarioId}, ${postId})`
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

export const getAllPost = async (): Promise<datosAllPost[]> => {
  const [querySql]: [querySql: datosAllPost[]] = await sequelize.query(
    `SELECT PU.id, PU.titulo, U.username, PU.fecha, PU.texto FROM Posts_usuarios as PU INNER JOIN Usuarios as U ON U.id=PU.UsuarioId`
  );

  return querySql;
}

export const getComentario = async (id: number): Promise<string[]> => {
  const [querySql]: [querySql: datosPost[]] = await sequelize.query(
    `SELECT U.username, PC.comentario, PC.createdAt
      FROM Posts_comentarios AS PC
      INNER JOIN Usuarios AS U ON U.id=PC.UsuarioId
      INNER JOIN Posts_usuarios AS PU ON PU.id=PC.PostsUsuarioId
      WHERE PU.id=${id}`
  );

  return querySql.map((query: any): string => query);
}

export const getPostPorId = async (id: number): Promise<datosPost> => {
  const [querySql]: [querySql: datosPost[]] = await sequelize.query(
    `SELECT PU.id, U.username, PU.fecha, PU.titulo, PU.texto
    FROM Posts_usuarios AS PU
    INNER JOIN Usuarios AS U ON U.id=PU.UsuarioId
    WHERE PU.id=${id}`
  );

  if (!querySql[0]) throw { error: 404, message: 'No se encontró un post con ese ID' };

  querySql[0].imagenes = await getPostImagenes(querySql[0].id);

  querySql[0].comentarios = await getComentario(querySql[0].id);

  return querySql[0];
}

export const updatePost = async (data: datosPost, postId: number) => {
  const entries: [key: string, value: string][] = Object.entries(data);

  if (!entries.length || entries.length > allPropertiesPost.length)
    throw { error: 406, message: 'Información errónea en el query.' }

  for (let [key] of entries)
    if (!allPropertiesPost.includes(key))
      throw { error: 406, message: 'Propiedades inexistentes.' }

  if (data.texto) {
    await sequelize.query(
      `UPDATE Posts_usuarios AS PU
      SET texto='${data.texto}' 
      WHERE PU.id=${postId}`
    )
  }

  if (data.imagenes) {

    await sequelize.query(
      `DELETE FROM Posts_imagenes WHERE PostsUsuarioId=${postId}`
    )

    await Promise.all(data.imagenes.map((imagenes) =>
      sequelize.query(
        `INSERT INTO Posts_imagenes(url,createdAt,updatedAt, PostsUsuarioId) 
      VALUES ('${imagenes}',NOW(),NOW(),${postId})`

      )
    ));
  }

  return await getPostPorId(postId)
}

export const updateComentario = async (data: datosComentario, comentarioId: number) => {
  const entries: [key: string, value: string][] = Object.entries(data);

  if (!entries.length || entries.length > allPropertiesComentario.length)
    throw { error: 406, message: 'Información errónea en el query.' }

  for (let [key] of entries)
    if (!allPropertiesComentario.includes(key))
      throw { error: 406, message: 'Propiedades inexistentes.' }

  if (data.comentario) {
    await sequelize.query(
      `UPDATE Posts_comentarios AS PC
      SET comentario='${data.comentario}' 
      WHERE PC.id=${comentarioId}`
    )
  }

  const [querySql]: [querySql: datosComentario[]] = await sequelize.query(
    `SELECT U.username, PC.comentario, PC.updatedAt
    FROM Posts_comentarios AS PC
    INNER JOIN Usuarios AS U ON U.id=PC.UsuarioId
    WHERE PC.id=${comentarioId}`
  ); 

  return querySql;
}