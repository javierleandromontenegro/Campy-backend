import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Caracteristicas_parcela',
    {
      techada: {
        type: DataTypes.BOOLEAN
      },
      agua_en_parcela: {
        type: DataTypes.BOOLEAN
      },
      iluminacion_toma_corriente: {
        type: DataTypes.BOOLEAN
      },
      superficie: {
        type: DataTypes.FLOAT
      },
    }
  );
};