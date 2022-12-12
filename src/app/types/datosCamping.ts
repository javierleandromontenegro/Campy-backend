import datosBase from "./datosBase"

export default interface datosCamping extends datosBase {
    provincia: string,
    localidad: string,
    imagenes: string[]
}

export interface createCamping {
    nombre_camping: string,
    descripcion_camping: string,
    direccion: string,
    telefono: string,
    longitud: string,
    latitud: string,
    cerrado_fecha_desde: string,
    cerrado_fecha_hasta: string,
    contacto_nombre: string,
    contacto_tel: string,
    UsuarioId: number,
    CategoriaCampingId: number,
    LocalidadeId: number
}