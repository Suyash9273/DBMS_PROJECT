import { Booking, Passenger, Train, sequelize, User, Station, Route } from "../models/index.js";
import generatePNR from "../utils/generatePNR.js";
import { Op } from "sequelize";
/**
 * @desc Check seat availability for train
 * @route GET /api/bookings/availability?trainId=1&date=2025-12-30
 * @access Public
 */
const checkAvailability = async (req, res) => {
    const { trainId, date } = req.query;

    if (!trainId || !date) {
        return res.status(404).json({
            message: "Missing train Id or date"
        })
    }

    try {
        // 1. Get the train's total capacity
        const train = await Train.findByPk(trainId);
        if (!train) {
            return res.status(404).json({
                message: "Train Not Found"
            })
        }

        const { total_seats_sleeper, total_seats_ac } = train;

        //2. Find all confirmed bookings for this train on this date
        const bookings = await Booking.findAll({
            where: {
                train_id: trainId,
                travel_date: date,
                booking_status: 'CONFIRMED', //Only counting confirmed bookings
            }
        })

        //3. Get all passengers for these confirmed bookings
        const bookingIds = bookings.map((b) => b.id);
        const passengers = await Passenger.findAll({
            where: {
                booking_id: {
                    [Op.in]: bookingIds,
                },
            },
        });

        //4. Count booked seats by class
        let bookedSleeper = 0;
        let bookedAC = 0;

        passengers.forEach((p) => {
            if (p.seat_class === 'SLEEPER') bookedSleeper++;
            else bookedAC++;
        })

        //5. Calculate and return available seats
        res.status(200).json({
            trainId: train.id,
            trainName: train.train_name,
            travelDate: date,
            availableSleeper: total_seats_sleeper - bookedSleeper,
            availableAC: total_seats_ac - bookedAC,
        });

    } catch (error) {
        console.log("Error inside booking Controller, checkAvailability");
        return res.status(500).json({
            message: error.message
        });
    }
}

/**
 * @desc Create a new booking (Status: Pending)
 * @route POST /api/bookings
 * @access Private
 */
const createBooking = async (req, res) => {
    // We will need: trainId, travelDate, passengers(array), totalFare
    const { train_id, travel_date, passengers, total_fare } = req.body;
    const user_id = req.user.id; // From our 'protect' middleware

    if (!train_id || !travel_date || !passengers || !passengers.length) {
        return res.status(400).json({
            message: "Missing required booking data"
        })
    }

    // A transaction ensures that all queries succeed or fail together.
    //If creating a passenger fails, the booking will be rolled back.
    const t = await sequelize.transaction();

    try {
        // 1. Create the main booking record
        const newBooking = await Booking.create({
            user_id,
            train_id,
            pnr_number: generatePNR(),
            travel_date,
            booking_status: 'PENDING',
            total_fare
        }, { transaction: t });

        // 2. Create passenger records for this booking

        const passengerData = passengers.map((p) => ({
            ...p,
            age: parseInt(p.age, 10), // <-- This ensures age is an integer
            booking_id: newBooking.id,
        }));

        await Passenger.bulkCreate(passengerData, { transaction: t });

        //3. If everything is successful, commit the transaction

        await t.commit();
        res.status(201).json(newBooking);

    } catch (error) {
        // 4. If anything fails, then rollback the transaction
        await t.rollback();
        res.status(500).json({
            message: 'Booking Failed',
            error: error.message
        });
    }
}

/**
 * @desc Get all bookings for the logged in users
 * @route Get /api/bookings/mybookings
 * @access Private
 */

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: Passenger, // Include passenger for each booking(join)
                },
                {
                    model: Train, // Include(Join) train details
                }
            ],
            order: [['travel_date', 'DESC']] // show most recent ones first
        })

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/**
 * @desc Get booking details by PNR number
 * @route Get /api/bookings/pnr/:pnr
 * @access Public
 */

const getBookingByPNR = async (req, res) => {
    const { pnr } = req.params;

    try {
        const booking = await Booking.findOne({
            where: { pnr_number: pnr },
            include: [
                {
                    model: Passenger,
                },
                {
                    model: Train,
                    include: [
                        {
                            model: Route,
                            include: [Station]
                        }
                    ],
                },
                {
                    model: User, // Include user details but hide password
                    attributes: ['name', 'email']
                }
            ],
            order: [[Train, Route, 'stop_number', 'ASC']],
        });

        if (booking) {
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found for this PNR' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/cancel/:id
 * @access  Private
 */
const cancelBooking = async (req, res) => {
    const { id: bookingId } = req.params;
    const userId = req.user.id;

    try {
        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        // Check if the booking belongs to the logged in user
        if (booking.user_id !== userId) {
            return res.status(401).json({ message: 'Not Authorized' })
        }

        //Check if booking is already cancelled or is still pending
        if (booking.booking_status === 'CANCELLED') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.booking_status = 'CANCELLED';

        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfuly",
            booking
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { checkAvailability, createBooking, getMyBookings, getBookingByPNR, cancelBooking };