import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Relacion_campo_tarifa',
    {
      precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
      }
    }
  );
};