export default interface datosUsuario {
  id?: number,
  email: string,
  clave?: string,
  nombre_completo: string,
  numero_celular: string,
  direccion: string,
  dni: string,
  tipo?: number
}