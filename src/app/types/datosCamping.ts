import { datosBase } from "./datosBase";
import datosPrecios from "./datosPrecios";

export default interface datosCamping extends datosBase {
  provincia: string;
  localidad: string;
  imagenes: string[];
  precios: datosPrecios[];
}

export interface createCamping extends createCaratCamping {
  nombre_camping: string;
  descripcion_camping: string;
  direccion: string;
  telefono: string;
  longitud: string;
  latitud: string;
  abierto_fecha_desde: Date;
  abierto_fecha_hasta: Date;
  contacto_nombre: string;
  contacto_tel: string;
  CategoriaCampingId: number;
  LocalidadeId: number;
  userType: string;
}
//UsuarioId:string
export interface createCaratCamping {
  wifi: boolean;
  duchas: number;
  baños: number;
  mascotas: boolean;
  rodantes: boolean;
  proveduria: boolean;
  salon_sum: boolean;
  restaurant: boolean;
  vigilancia: boolean;
  pileta: boolean;
  estacionamiento: boolean;
  juegos_infantiles: boolean;
  maquinas_gimnasia: boolean;
  AbiertoPeriodoId: number;
  PeriodoAguaCalienteId: number;
  parcela_techada: boolean;
  parcela_agua_en_parcela: boolean;
  parcela_iluminacion_toma_corriente: boolean;
  parcela_superficie: number;
  imagenes: [];
  mayores: number;
  menores: number;
  rodante: number;
  UsuarioId: number;
}

export interface campingHabilitado {
  id: number;
  nombre: string;
  habilitado: boolean;
}

export interface campingCategorias {
  id: number;
  categoria: string;
  cantidad_estrellas: number;
  descripcion_categoria: string;
}

export interface campingTarifas {
  id: number;
  descrip_tarifa: string;
}

export interface campingAbiertoPeriodo {
  id: number;
  descripcion_periodo: string;
}

export interface campingPeriodoAguaCaliente {
  id: number;
  descripcion_periodo_agua: string;
}
