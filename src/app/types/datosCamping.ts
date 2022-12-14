import datosBase from "./datosBase"

export default interface datosCamping extends datosBase {
    provincia: string,
    localidad: string,
    imagenes: string[]       
}

export interface createCamping extends createCaratCamping{
    nombre_camping: string,
    descripcion_camping: string,
    direccion: string,
    telefono: string,    
    contacto_nombre: string,
    contacto_tel: string,  
    CategoriaCampingId: number,
    LocalidadeId: number   
}

export interface createCaratCamping {
    wifi:boolean,
    duchas:number,
    baños:number,
    mascotas:boolean,
    rodantes:boolean,
    proveduria:boolean,
    salon_sum:boolean,
    restaurant:boolean,
    vigilancia:boolean,
    pileta:boolean,
    estacionamiento:boolean,
    juegos_infantiles:boolean,
    maquinas_gimnasia:boolean,
    AbiertoPeriodoId:number,
    PeriodoAguaCalienteId:number,
    techada:boolean,
    agua_en_parcela:boolean,
    iluminacion_toma_corriente:boolean,
    superficie:number,
    imagenes:[],
    precios:[]  
}

    
export interface campingCategorias {
id:number,
categoria:string,
cantidad_estrellas:number,
descripcion_categoria:string
}

export interface campingTarifas {
    id: number,
    descrip_tarifa: string
}

export interface campingAbiertoPeriodo {
    id: number,
    descripcion_periodo: string
}

export interface campingPeriodoAguaCaliente {
    id: number,
    descripcion_periodo_agua: string
}
