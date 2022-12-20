export interface reservas {
    id: number,   
    fecha_desde_reserva:Date,
    fecha_hasta_reserva:Date,
    cant_noches:number,
    total:number, 
    descrip_estado:string,
     Usuario_id:number,
     username:string,
     Ccamping_id:number,
     nombre_camping:string    
  }

  export interface reservasdetalle {
    descrip_tarifa:string,
    cantidad:number,
    subtotal:number
  }