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
      nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numero_celular: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      habilitado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }
  );
};