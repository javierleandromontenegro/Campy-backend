import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Campings',
    {
      nombre_camping: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion_camping: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longitud: {
        type: DataTypes.STRING,
      },
      latitud: {
        type: DataTypes.STRING,
      },
      abierto_fecha_desde: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      abierto_fecha_hasta: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      contacto_nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contacto_tel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      habilitado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      puntuacion_promedio: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    }
  );
};