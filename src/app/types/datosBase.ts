export interface datosBase {
  id: number,
  nombre: string,
  imagen: string
}

export interface campingsCantidad {
  nombre: string,
  cant_campings: number
}

export interface campingsCantReservas {
  nombre: string,
  cant_reservas: number
}

export const stateBooking = {
    PENDIENTE: process.env.PENDIENTE,
    RECHAZADA: process.env.RECHAZADA,
    REALIZADA: process.env.REALIZADA,
    FINALIZADA: process.env.FINALIZADA,
}
