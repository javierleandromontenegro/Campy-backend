export default (models: any):void => {
  const {
    Usuarios, 
    Tipo_usuarios, 
    Posts_usuario, 
    Posts_comentario, 
    Reservas, 
    Detalle_reserva,
    Tarifas,
    Estado_reserva,
    Campings,
    Camping_imagenes,
    Categoria_camping,
    Caracteristicas_camping,
    Reviews,
    Relacion_campo_tarifa,
    Localidades,
    Provincias,
    Paises,
    Caracteristicas_parcela,
    Abierto_periodo,
    Periodo_agua_caliente,
    Favoritos,
    Posts_imagenes
} = models;


  //Relación de 1 - 1
  //Usuarios

  Usuarios.belongsTo(Tipo_usuarios); //Genera foreign key en Usuarios 
  Tipo_usuarios.hasOne(Usuarios);

  Posts_usuario.belongsTo(Usuarios);
  Usuarios.hasMany(Posts_usuario);

  Posts_comentario.belongsTo(Usuarios);
  Usuarios.hasMany(Posts_comentario);

  Posts_comentario.belongsTo(Posts_usuario);
  Posts_usuario.hasMany(Posts_comentario);

  Posts_imagenes.belongsTo(Posts_usuario);
  Posts_usuario.hasMany(Posts_imagenes);
  
  //Reservas

  Reservas.belongsTo(Estado_reserva);
  Estado_reserva.hasMany(Reservas);

  Reservas.belongsTo(Usuarios);
  Usuarios.hasMany(Reservas);

  Relacion_campo_tarifa.belongsTo(Tarifas);
  Tarifas.hasMany(Relacion_campo_tarifa);
  
  //Capings relaciones

  Campings.belongsTo(Usuarios);
  Usuarios.hasOne(Campings);

  Campings.belongsTo(Categoria_camping);
  Categoria_camping.hasMany(Campings);

  Reservas.belongsTo(Campings);
  Campings.hasMany(Reservas);

  Relacion_campo_tarifa.belongsTo(Campings);
  Campings.hasOne(Relacion_campo_tarifa);

  Campings.belongsTo(Caracteristicas_camping);
  Caracteristicas_camping.hasOne(Campings);

  Camping_imagenes.belongsTo(Campings);
  Campings.hasMany(Camping_imagenes);

  Campings.belongsTo(Localidades);
  Localidades.hasMany(Campings);

  Localidades.belongsTo(Provincias);
  Provincias.hasMany(Localidades);

  Provincias.belongsTo(Paises);
  Paises.hasMany(Provincias);

  //cambié 09/12 17:12
  Caracteristicas_parcela.belongsTo(Caracteristicas_camping);
  Caracteristicas_camping.hasOne(Caracteristicas_parcela);

  Caracteristicas_camping.belongsTo(Abierto_periodo);
  Abierto_periodo.hasMany(Caracteristicas_camping);

  Caracteristicas_camping.belongsTo(Periodo_agua_caliente);
  Periodo_agua_caliente.hasMany(Caracteristicas_camping);

  //Tabla Intermedia

  Reservas.belongsToMany(Tarifas, { through: Detalle_reserva });
  Tarifas.belongsToMany(Reservas, { through: Detalle_reserva });

  Campings.belongsToMany(Usuarios, { through: Reviews });
  Usuarios.belongsToMany(Campings, { through: Reviews });

  Campings.belongsToMany(Usuarios, { through: Favoritos });
  Usuarios.belongsToMany(Campings, { through: Favoritos });
}