import express from 'express';
import { adminController } from './admin.controller';


const router = express.Router();

router.get("/", adminController.getAllAdminFromDB);
router.get("/:id", adminController.getByIdFromDB);

export const adminRoutes = router;