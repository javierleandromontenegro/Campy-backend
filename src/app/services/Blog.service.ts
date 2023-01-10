import { QueryTypes } from "sequelize";
import { datosAllPost, datosComentario, datosPost } from "../types/datosBlog";
import {
  allPropertiesComentario,
  allPropertiesPost,
} from "../types/Properties";

const { sequelize } = require("../db");

export const postBlogCreate = async ({
  titulo,
  texto,
  imagenes,
  usuarioId,
}: datosPost): Promise<number> => {
  console.log(titulo, texto, imagenes, usuarioId);
  if (!titulo || !texto)
    throw {
      error: 406,
      message: "Faltan parámetros",
    };

  const [postBlogId]: [postBlogId: number] = await sequelize.query(
    `INSERT INTO Posts_usuarios (titulo, texto, fecha, createdAt, updatedAt, UsuarioId) 
        VALUES (:titulo, :texto, NOW(), NOW(), NOW(), :usuarioId)`,
    {
      replacements: { titulo, texto, usuarioId },
      type: QueryTypes.INSERT,
    }
  );

  await Promise.all(
    imagenes.map((imagenes) =>
      sequelize.query(
        `INSERT INTO Posts_imagenes(url,createdAt,updatedAt, PostsUsuarioId) 
        VALUES (:imagenes,NOW(),NOW(),:postBlogId)`,
        {
          replacements: { postBlogId, imagenes },
          type: QueryTypes.INSERT,
        }
      )
    )
  );

  return postBlogId;
};

export const postBlogComentario = async ({
  comentario,
  usuarioId,
  postId,
}: datosComentario): Promise<number> => {
  if (!comentario)
    throw {
      error: 406,
      message: "Faltan parámetros",
    };

  const [postBlogComentario]: [postBlogComentario: number] =
    await sequelize.query(
      `INSERT INTO Posts_comentarios (comentario, createdAt, updatedAt, UsuarioId, PostsUsuarioId) VALUES (:comentario, NOW(), NOW(), :usuarioId, :postId)`,
      {
        replacements: { comentario, usuarioId, postId },
        type: QueryTypes.INSERT,
      }
    );

  const [SumaId]: [SumaId: { cant_comentarios: number }] =
    await sequelize.query(
      `SELECT COUNT(id) AS cant_comentarios FROM Posts_comentarios AS PC
     WHERE PostsUsuarioId=:postId
     GROUP BY PostsUsuarioId`,
      {
        replacements: { postId },
        type: QueryTypes.SELECT,
      }
    );

  await sequelize.query(
    `UPDATE Posts_usuarios SET cant_comentarios=:cant_comentarios WHERE id=:postId`,
    {
      replacements: { cant_comentarios: SumaId.cant_comentarios, postId },
      type: QueryTypes.UPDATE,
    }
  );

  return postBlogComentario;
};

export const getPostImagenes = async (id: number): Promise<string[]> => {
  const querySql: datosPost[] = await sequelize.query(
    `SELECT PU.ID,PI.url FROM Posts_imagenes AS PI INNER JOIN Posts_usuarios as PU ON PU.id=PI.PostsUsuarioId WHERE PU.id=:id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql.map((query: any): string => query.url);
};

export const getAllPost = async (): Promise<datosAllPost[]> => {
  const querySql: datosAllPost[] = await sequelize.query(
    `SELECT PU.id, PU.titulo, PU.cant_comentarios, PU.cant_visualizaciones, PU.comentarios_vistos, PU.UsuarioId, U.foto, U.username, TU.tipo, PU.fecha, PU.texto, PI.url
    FROM Posts_usuarios as PU 
    INNER JOIN Usuarios as U ON U.id=PU.UsuarioId
    INNER JOIN Tipo_usuarios as TU ON TU.id=U.TipoUsuarioId
    INNER JOIN Posts_imagenes as PI ON PU.id=PI.PostsUsuarioId
    ORDER BY PU.fecha DESC`,
    {
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

export const getComentario = async (id: number): Promise<string[]> => {
  const querySql: datosPost[] = await sequelize.query(
    `SELECT PC.id, U.foto, U.username, PC.comentario, PC.createdAt
      FROM Posts_comentarios AS PC
      INNER JOIN Usuarios AS U ON U.id=PC.UsuarioId
      INNER JOIN Posts_usuarios AS PU ON PU.id=PC.PostsUsuarioId
      WHERE PU.id=:id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql.map((query: any): string => query);
};

export const getPostPorId = async (id: number): Promise<datosPost> => {
  const querySql: datosPost[] = await sequelize.query(
    `SELECT PU.id, U.foto, U.username, PU.fecha, PU.titulo, PU.texto
    FROM Posts_usuarios AS PU
    INNER JOIN Usuarios AS U ON U.id=PU.UsuarioId
    WHERE PU.id=:id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  if (!querySql[0])
    throw { error: 404, message: "No se encontró un post con ese ID" };

  querySql[0].imagenes = await getPostImagenes(querySql[0].id);

  querySql[0].comentarios = await getComentario(querySql[0].id);

  return querySql[0];
};

export const updatePost = async (
  data: { texto: string; imagenes: string },
  postId: number
) => {
  const entries: [key: string, value: string][] = Object.entries(data);

  if (!entries.length || entries.length > allPropertiesPost.length)
    throw { error: 406, message: "Información errónea en el query." };

  for (let [key] of entries)
    if (!allPropertiesPost.includes(key))
      throw { error: 406, message: "Propiedades inexistentes." };

  if (data.texto) {
    await sequelize.query(
      `UPDATE Posts_usuarios AS PU
      SET texto=:texto 
      WHERE PU.id=:postId`,
      {
        replacements: { texto: data.texto, postId },
        type: QueryTypes.UPDATE,
      }
    );
  }

  if (data.imagenes) {
    await sequelize.query(
      `DELETE FROM Posts_imagenes WHERE PostsUsuarioId=:postId`,
      {
        replacements: { postId },
        type: QueryTypes.DELETE,
      }
    );

    await Promise.all(
      data.imagenes.split(",").map((imagenes: string) =>
        sequelize.query(
          `INSERT INTO Posts_imagenes(url,createdAt,updatedAt, PostsUsuarioId) 
      VALUES (:imagenes,NOW(),NOW(),:postId)`,
          {
            replacements: { imagenes, postId },
            type: QueryTypes.INSERT,
          }
        )
      )
    );
  }

  return await getPostPorId(postId);
};

export const updateVisitas = async (
  data: { visitas: number },
  postId: number
) => {
  await sequelize.query(
    `UPDATE Posts_usuarios AS PU
        SET cant_visualizaciones=:cant_visualizaciones  
        WHERE PU.id=:postId`,
    {
      replacements: { cant_visualizaciones: data.visitas, postId },
      type: QueryTypes.UPDATE,
    }
  );

  await sequelize.query(
    `UPDATE Posts_usuarios AS PU
        SET cant_visualizaciones='${data.visitas}'  
        WHERE PU.id=:postId`,
    {
      replacements: { postId },
      type: QueryTypes.UPDATE,
    }
  );

  return postId;
};

export const updateComentariosVistos = async (postId: number) => {
  await sequelize.query(
    `UPDATE Posts_usuarios AS PU
      SET comentarios_vistos = cant_comentarios 
      WHERE PU.id=:postId`,
    {
      replacements: { postId },
      type: QueryTypes.UPDATE,
    }
  );

  return postId;
};

export const updateComentario = async (
  data: datosComentario,
  comentarioId: number
) => {
  const entries: [key: string, value: string][] = Object.entries(data);
  console.log(entries);

  if (!entries.length || entries.length > allPropertiesComentario.length)
    throw { error: 406, message: "Información errónea en el query." };

  for (let [key] of entries)
    if (!allPropertiesComentario.includes(key))
      throw { error: 406, message: "Propiedades inexistentes." };

  if (data.comentario) {
    await sequelize.query(
      `UPDATE Posts_comentarios AS PC
      SET comentario=:comentario 
      WHERE PC.id=:comentarioId`,
      {
        replacements: { comentario: data.comentario, comentarioId },
        type: QueryTypes.UPDATE,
      }
    );
  }

  const querySql: datosComentario[] = await sequelize.query(
    `SELECT U.username, PC.comentario, PC.updatedAt
    FROM Posts_comentarios AS PC
    INNER JOIN Usuarios AS U ON U.id=PC.UsuarioId
    WHERE PC.id=:comentarioId`,
    {
      replacements: { comentarioId },
      type: QueryTypes.SELECT,
    }
  );

  return querySql;
};

export const deletePostPorId = async (id: number): Promise<datosPost> => {
  const [querySql]: [querySql: datosPost[]] = await sequelize.query(
    `DELETE FROM Posts_usuarios WHERE Posts_usuarios.id=:id`,
    {
      replacements: { id },
      type: QueryTypes.DELETE,
    }
  );

  return querySql[0];
};

export const deleteComentarioPorId = async (
  id: number
): Promise<datosComentario> => {
  const [querySql]: [querySql: datosComentario[]] = await sequelize.query(
    `DELETE FROM Posts_comentarios WHERE id=:id`,
    {
      replacements: { id },
      type: QueryTypes.DELETE,
    }
  );

  return querySql[0];
};

export const cantidadComentariosPorIdDePost = async (
  id: number
): Promise<datosComentario> => {
  const querySql: datosComentario[] = await sequelize.query(
    `SELECT COUNT(PC.id) AS cant_comentarios
    FROM Posts_comentarios AS PC
    INNER JOIN Posts_usuarios AS PU ON PU.id=PC.PostsUsuarioId
    WHERE PU.id=:id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  return querySql[0];
};
