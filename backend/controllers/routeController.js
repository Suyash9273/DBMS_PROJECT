// here route controller means the url which will control the train routes that is schedules or stops
import { Route, Train, Station } from '../models/index.js';
/**
 * @desc Add a new route/stop to a train's schedule
 * @route POST /api/routes
 * @access Private(Admin)
 */
const addRoute = async (req, res) => {
    const {
        train_id,
        station_id,
        arrival_time,
        departure_time,
        stop_number,
    } = req.body;

    try {
        // check if train, station exists?
        const train = await Train.findByPk(train_id);
        const station = await Station.findByPk(station_id);

        if (!train) {
            res.status(404);
            throw new Error('Train not found');
        }
        if (!station) {
            res.status(404);
            throw new Error('Station not found');
        }

        const route = await Route.create({
            train_id,
            station_id,
            arrival_time,
            departure_time,
            stop_number
        });

        res.status(200).json(route);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export {addRoute}