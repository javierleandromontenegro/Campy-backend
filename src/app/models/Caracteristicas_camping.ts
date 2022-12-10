import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Caracteristicas_camping',
    {
      wifi: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      duchas: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      baños: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      mascotas: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      rodantes: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      proveduria: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      salon_sum: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      restaurant: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      vigilancia: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      pileta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      estacionamiento: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      juegos_infantiles: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      maquinas_gimnasia: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
    }
  );
};