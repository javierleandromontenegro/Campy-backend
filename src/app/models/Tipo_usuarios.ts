import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Tipo_usuarios',
    {
      tipo: {
        type: DataTypes.STRING,
      }
    }
  );
};