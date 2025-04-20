import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { jwtHelpars } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import auth from '../../middlewares/auth';

const router = express.Router();



router.post("/", auth("ADMIN"), userController.createAdmin);

export const userRoutes = router;