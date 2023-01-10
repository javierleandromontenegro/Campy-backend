export interface datosPost {
  id: number;
  titulo: string;
  texto: string;
  imagenes: string[];
  usuarioId: number;
  comentarios: string[];
}

export interface datosComentario {
  id: number;
  comentario: string;
  postId: number;
  usuarioId: number;
}

export interface datosAllPost {
  id: number;
  titulo: string;
  username: string;
  cant_comentarios: number;
  cant_visualizaciones: number;
  fecha: string;
  foto: string;
  texto: string;
  tipo: string;
  imagenes: string[];
}
