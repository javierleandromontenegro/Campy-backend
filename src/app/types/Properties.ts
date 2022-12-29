export const allPropertiesUsuario = [
  'username',
  'numero_celular',
  'direccion',
  'dni',
  'clave'
];

export const prioridadEstadoReserva = {
  [process.env.PENDIENTE as string]: 1,
  [process.env.REALIZADA as string]: 2,
  [process.env.RECHAZADA as string]: 3,
  [process.env.FINALIZADA as string]: 4,
}