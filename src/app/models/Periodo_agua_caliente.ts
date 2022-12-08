import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Periodo_agua_caliente',
    {
      descripcion_periodo_agua: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }
  );
};