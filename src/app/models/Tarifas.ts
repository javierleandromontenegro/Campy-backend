import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Tarifas',
    {
      descrip_tarifa: {
        type: DataTypes.STRING
      }
    }
  );
};