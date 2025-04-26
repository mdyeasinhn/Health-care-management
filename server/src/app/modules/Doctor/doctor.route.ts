import express from 'express';
 
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { DoctorController } from './doctor.controller';



const router = express.Router();

router.get("/", DoctorController.getAllFromDB);
router.get("/:id", DoctorController.getByIdFromDB);

router.delete(
    '/soft/:id',
    auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDelete);

export const DoctorRoutes = router;
