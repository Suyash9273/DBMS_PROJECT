// backend/models/paymentModel.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Foreign key for booking will be added in associations
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM('SUCCESS', 'FAILED', 'PENDING'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
  }
);

export default Payment;