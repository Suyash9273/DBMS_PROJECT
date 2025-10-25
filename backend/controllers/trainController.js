import { Train } from "../models/index.js";

/**
 * @desc Add new Train
 * @route POST /api/trains
 * @access Private(Admin)
 */
const addTrain = async (req, res) => {
    const {train_name, train_number, total_seats_sleeper, total_seats_ac} = req.body;

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

export {addTrain}