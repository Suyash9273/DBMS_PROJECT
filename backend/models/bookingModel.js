// backend/models/bookingModel.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Foreign key for user will be added in associations
    pnr_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    travel_date: {
      type: DataTypes.DATEONLY, // Stores only the date, e.g., '2025-12-25'
      allowNull: false,
    },
    booking_status: {
      type: DataTypes.ENUM('CONFIRMED', 'CANCELLED', 'PENDING'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    total_fare: {
      type: DataTypes.DECIMAL(10, 2), // e.g., 1250.50
      allowNull: false,
    },
  },
  {
    tableName: 'bookings',
    timestamps: true,
  }
);

export default Booking;