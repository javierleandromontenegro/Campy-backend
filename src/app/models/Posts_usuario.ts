import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Posts_usuario',
    {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }
  );
};