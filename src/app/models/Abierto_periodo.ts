import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Abierto_periodo',
    {
      descripcion_periodo: {
        type: DataTypes.TEXT,
        allowNull: false
      },
    }
  );
};