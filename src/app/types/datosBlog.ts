export interface datosPost {
  id: number,
  titulo: string,
  texto: string,
  imagenes: string[],
  usuarioId: number,
  comentarios: string[]
}

export interface datosComentario {
  id: number,
  comentario: string,
  postId: number,
  usuarioId: number
}

export interface datosAllPost {
  titulo: string,
  username: string,
}