import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Detalle_reserva',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.FLOAT,
      },
    }
  );
};