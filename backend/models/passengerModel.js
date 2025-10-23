// backend/models/passengerModel.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Passenger = sequelize.define(
  'Passenger',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Foreign key for booking will be added in associations
    passenger_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
      allowNull: false,
    },
    seat_number: {
      type: DataTypes.STRING, // e.g., 'S10-45'
      allowNull: true, // Might be null if not yet assigned
    },
    seat_class: {
      type: DataTypes.ENUM('SLEEPER', 'AC'),
      allowNull: false,
    },
  },
  {
    tableName: 'passengers',
    timestamps: true,
  }
);

export default Passenger;