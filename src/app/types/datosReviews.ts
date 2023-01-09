export interface datosReviews {
  id: number;
  puntaje: number;
  username: string;
  comentario: string;
  fecha: string;
}

export interface createReview {
  usuario: number;
  camping: number;
  puntaje: number;
  comentario: string;
}
