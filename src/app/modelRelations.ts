export default (models: any):void => {
  const {Usuarios, Tipo_usuarios, Posts_usuario, Posts_comentario} = models;

  //Relación de 1 - 1
  Usuarios.belongsTo(Tipo_usuarios); //Genera foreign key en Usuarios 
  Tipo_usuarios.hasOne(Usuarios);

  Posts_usuario.belongsTo(Usuarios);
  Usuarios.hasMany(Posts_usuario);

  Posts_comentario.belongsTo(Usuarios);
  Usuarios.hasMany(Posts_comentario);

  Posts_comentario.belongsTo(Posts_usuario);
  Posts_usuario.hasMany(Posts_comentario);
}