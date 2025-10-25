import {Station} from '../models/index.js';

/**
 * @desc Add new Station
 * @route POST /api/stations
 * @private Only Admin can access 
 */
const addStation = async (req, res) => {
    const {station_name, station_code} = req.body;

    try {
        // Check if station code already exists
        const stationExists = await Station.findOne({where: {station_code}});
        if(stationExists) {
            res.status(400);
            throw new Error('Station code already exists');
        }

        const station = await Station.create({
            station_name,
            station_code
        })

        res.status(201).json(station);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export {addStation}