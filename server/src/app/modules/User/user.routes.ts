import express from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';

const router = express.Router();


router.post("/",
    auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
    fileUploader.upload.single("file"),
    userController.createAdmin
);

export const userRoutes = router;