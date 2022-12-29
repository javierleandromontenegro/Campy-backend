import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Estado_reserva',
    {
      descrip_estado: {
        type: DataTypes.TEXT,
      },
      prioridad: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }
  );
};