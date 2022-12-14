import { Sequelize, DataTypes } from "sequelize";

export default (sequelize: Sequelize) => {
  sequelize.define("Reservas", {
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
    },
    ID_transaccion: {
      type: DataTypes.STRING,
    },
    Estado_transaccion: {
      type: DataTypes.STRING,
    },
    Form_enviado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
