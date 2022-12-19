export interface datosFiltros {
    id_provincia: number,
    id_localidad: number,   
    abierto_fecha_desde:Date,
    abierto_fecha_hasta: Date,  
    parcela_techada: boolean,
    parcela_agua_en_parcela: boolean,
    parcela_iluminacion_toma_corriente: boolean,
    mascotas: boolean,
    rodantes: boolean,
    proveduria: boolean,
    restaurant: boolean,
    pileta: boolean,
    vigilancia: boolean,
    maquinas_gimnasia: boolean,
    juegos_infantiles: boolean,
    salon_sum: boolean,
    wifi: boolean,
    estacionamiento: boolean,    
    precio:number[],
    id_categoria:Number[], 
    parcela_superficie:Number[]
}
/* 
        
    reviews:[],
     */