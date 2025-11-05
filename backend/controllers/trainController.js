import { Train, Station, Route } from "../models/index.js";
import { Op } from "sequelize";
/**
 * @desc Add new Train
 * @route POST /api/trains
 * @access Private(Admin)
 */
const addTrain = async (req, res) => {
    const {train_name, train_number, total_seats_sleeper, total_seats_ac, fare_sleeper, fare_ac} = req.body;

    try {
        const trainExists = await Train.findOne({where: {train_number}});
        if(trainExists) {
            res.status(400);
            throw new Error('Train number already exists')
        }

        const train = await Train.create({
            train_name,
            train_number,
            total_seats_sleeper,
            total_seats_ac
        });

        res.status(201).json(train);
    } catch (error) {
        res.status(200).json({message: error.message});
    }
}

const searchTrains = async (req, res) => {
    const {from: fromStationCode , to: toStationCode} = req.query;
    // We're not using the 'date' yet. That will be for availability (Day 7).

    if(!fromStationCode || !toStationCode) {
        return res.status(400).json({
            message: "Either Missing fromStationCode or toStationCode or both"
        })
    }
    
    try {
        //1. find stations from their ids in query
        const fromStation = await Station.findOne({
            where: {station_code: fromStationCode}
        });

        const toStation = await Station.findOne({
            where: {station_code: toStationCode}
        });

        if(!fromStation || !toStation) {
            return res.status(404).json({
                message: "One or Both Stations not found"
            })
        }

        // 2. Find all route(schedule) entries for the fromStation id
        const fromRoutes = await Route.findAll({
            where: {station_id: fromStation.id}
        });

        // 3. Find all route entries for the toStation id
        const toRoutes = await Route.findAll({
            where: {station_id: toStation.id}
        });

        // 4. Map them with train_id for easy lookup
        const fromRouteMap = new Map(fromRoutes.map((r) => [r.train_id, r]));
        const toRouteMap = new Map(toRoutes.map((r) => [r.train_id, r]));

        //5. Finding common train Ids: 
        const commonTrainIds = [...fromRouteMap.keys()].filter((id) => {
            return toRouteMap.has(id);
        });

        //6. Filter by stop_number ('from' must come before 'to')
        const validTrainIds = commonTrainIds.filter((id) => {
            const fromRoute = fromRouteMap.get(id);
            const toRoute = toRouteMap.get(id);

            return fromRoute.stop_number < toRoute.stop_number;
        })

        if(validTrainIds.length === 0) {
            return res.status(404).json({
                message: "No trains found for this route"
            });
        }

        //7. Get full details for all valid trains
        const trains = await Train.findAll({
            where: {
                id: {
                    [Op.in]: validTrainIds,
                },
            },
            include: [
                {
                    model: Route, //include route detail for each train
                    include: [Station],//include station detail for the routes
                }
            ],
            order: [['Routes', 'stop_number', 'ASC']]
        });

        return res.status(200).json(trains);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/**
 * @desc    Get a single train by its ID
 * @route   GET /api/trains/:id
 * @access  Public
 */
const getTrainById = async (req, res) => {
  try {
    const train = await Train.findByPk(req.params.id, {
      include: [
        {
          model: Route,
          include: [Station],
        },
      ],
      order: [[Route, 'stop_number', 'ASC']],
    });

    if (train) {
      res.status(200).json(train);
    } else {
      res.status(404).json({ message: 'Train not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {addTrain, searchTrains, getTrainById};