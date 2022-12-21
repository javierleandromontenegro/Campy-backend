export interface datosUsuario {
  id?: number,
  email: string,
  clave?: string,
  username: string,
  numero_celular: string,
  direccion: string,
  dni: string,
  foto: string,
  tipo?: string
}

export interface stateUsuario {
  id: string,
  email: string,
  tipo: string,
  habilitado: boolean
}