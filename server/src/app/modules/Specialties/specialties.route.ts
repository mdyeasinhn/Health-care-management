import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesController } from './specialties.controller';
import { fileUploader } from '../../../helpers/fileUploader';
import { SpecialtiesValidtaion } from './specialties.valitation';

const router = express.Router();

router.get(
    '/',
    SpecialtiesController.getAllFromDB
);

router.post('/', 

    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data))
        return SpecialtiesController.insertIntoDB(req, res, next)
    }
);


export const SpecialtiesRoutes = router;