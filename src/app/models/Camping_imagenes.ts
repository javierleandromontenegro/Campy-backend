import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Camping_imagenes',
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }
  );
};