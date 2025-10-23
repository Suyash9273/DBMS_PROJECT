import sequelize from '../config/db.js';
import User from './userModel.js';
import Train from './trainModel.js';
import Station from './stationModel.js';
import Route from './routeModel.js';
import Booking from './bookingModel.js';
import Passenger from './passengerModel.js';
import Payment from './paymentModel.js';

// Defining Relationships :-> 
//1. User <-> Booking (One to Many) One User can have many bookings and each booking belongs to only one User
User.hasMany(Booking, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});
//One Booking Belongs to One user
Booking.belongsTo(User, {
    foreignKey: 'user_id',
})

// 2. Booking <-> Passenger (One to Many) One Booking can have many passengers
Booking.hasMany(Passenger, {
    foreignKey: 'booking_id',
    onDelete: 'CASCADE', //if a booking is deleted, delete all it's passengers
})
// One passenger belongs to one booking
Passenger.belongsTo(Booking, {
    foreignKey: 'booking_id',
});

//3. Booking <-> Payment (One-to-One)
//One Booking has one Payment
Booking.hasOne(Payment, {
    foreignKey: 'booking_id',
    onDelete: 'CASCADE', // If a Booking is deleted, delete it's payment
});
//One Payment belongs to one booking
Payment.belongsTo(Booking, {
    foreignKey: 'booking_id'
});

//4. Train <-> Route (One to Many)
// One train can have many route entries(stops)
Train.hasMany(Route, {
    foreignKey: 'train_id',
    onDelete: 'CASCADE' // If a train is deleted remove it's routes, here route refers to schedule not physical paths, meaning ex: Row 1: train_id: 1 (Rajdhani), station_id: 5 (Delhi), stop_number: 1, departure_time: 17:00 is a particular entry in the routes table, so deleting train_id should remove all the entries corresponding to that train_id
})
// One route entry belongs to one Train:->
Route.belongsTo(Train, {
    foreignKey: 'train_id',
})

//5. Station <-> Route (One to Many)
// One Station can be part of many routes: 
Station.hasMany(Route, {
    foreignKey: 'station_id',
    onDelete: 'CASCADE', // If a station is deleted then remove it from all routes, hence all routes will be deleted corresponding to that station
});
// One Route entry belongs to one Station
Route.belongsTo(Station, {
    foreignKey: 'station_id'
});

// Export All Models : -> 
// We export all models and then sequelize instance from this one file

export{
    sequelize, 
    User,
    Train,
    Station,
    Route,
    Booking,
    Passenger,
    Payment,
};

