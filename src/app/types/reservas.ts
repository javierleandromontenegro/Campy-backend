export interface reservas {
  id: number;
  fecha_desde_reserva: string;
  fecha_hasta_reserva: string;
  cant_noches: number;
  total: number;
  id_estado: string;
  Usuario_id: number;
  username: string;
  camping_id: number;
  nombre_camping: string;
  email: string;
}

export interface reservasdetalle {
  descrip_tarifa: string;
  cantidad: number;
  subtotal: number;
  precio: number;
}

export interface reservaCreate {
  fecha_desde_reserva: string;
  fecha_hasta_reserva: string;
  cant_noches: number;
  total: number;
  UsuarioId: string;
  CampingId: string;
  cantMayores: number;
  cantMenores: number;
  extraRodante: number;
  precioMayores: number;
  precioMenores: number;
  precioextraRodante: number;
}

export interface reservaPago {
  ID_reserva: string;
  ID_transaccion: string;
  Estado_transaccion: string;
}
