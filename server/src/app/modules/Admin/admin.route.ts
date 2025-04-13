import express from 'express';
import { adminController } from './admin.controller';


const router = express.Router();

router.get("/", adminController.getAllAdminFromDB);

router.get("/:id", adminController.getByIdFromDB);

router.patch("/:id", adminController.updatedIntoDB);

router.delete("/:id", adminController.deleteIntoDB);

export const adminRoutes = router;