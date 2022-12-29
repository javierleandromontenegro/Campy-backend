export interface reservas {
    id: number,   
    fecha_desde_reserva:Date,
    fecha_hasta_reserva:Date,
    cant_noches:number,
    total:number, 
    id_estado:string,
    Usuario_id:number,
    username:string,
    camping_id:number,
    nombre_camping:string    
  }

  export interface reservasdetalle {
    descrip_tarifa:string,
    cantidad:number,
    subtotal:number
  }

  export interface reservaCreate {
    fecha_desde_reserva:Date,
    fecha_hasta_reserva:Date,
    cant_noches:number,
    total:number,    
    UsuarioId:string,
    CampingId:string
  }
