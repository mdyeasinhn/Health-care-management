import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { DoctorController } from './doctor.controller';



const router = express.Router();

router.get("/", DoctorController.getAllFromDB);
router.get("/:id", DoctorController.getByIdFromDB);



export const DoctorRoutes = router;
