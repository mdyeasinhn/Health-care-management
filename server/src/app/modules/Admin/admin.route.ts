import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidation } from './admin.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';



const router = express.Router();

router.get("/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.getAllAdminFromDB
);

router.get("/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.getByIdFromDB
);

router.patch("/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(adminValidation.updateAdminSchema),
    adminController.updatedIntoDB
);

router.delete("/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.deleteIntoDB
);

router.delete("/soft/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.softDeleteIntoDB
);

export const adminRoutes = router;