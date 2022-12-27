export interface datosReviews {
    id: number,
    puntaje: number,
    username: string,
    comentario: string,
    fecha: string
}



export interface createReview {    
    usuario: string,
    camping: string ,
    puntaje: number,
    comentario: string      
}