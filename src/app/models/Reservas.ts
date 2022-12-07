import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Reservas',
    {
      fecha_desde_reserva: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fecha_hasta_reserva: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cant_noches: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.FLOAT,
      }
    }
  );
};