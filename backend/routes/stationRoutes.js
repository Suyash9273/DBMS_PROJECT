import express from 'express';
import { addStation } from '../controllers/stationController.js';
import {protect, admin} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, addStation);

export default router;