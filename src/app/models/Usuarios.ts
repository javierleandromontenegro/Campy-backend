import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Usuarios',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clave: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: true
      },
      numero_celular: {
        type: DataTypes.STRING,
        allowNull: true
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: true
      },
      habilitado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }
  );
};