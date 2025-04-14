import express, { NextFunction, Request, Response } from 'express';
import { adminController } from './admin.controller';
import { AnyZodObject, z } from 'zod';

const updateAdminSchema = z.object({
    boyd: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional()
    })
})

const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body : req.body
        })
    } catch (err) {
        next(err)
    }
}


const router = express.Router();

router.get("/", adminController.getAllAdminFromDB);

router.get("/:id", adminController.getByIdFromDB);

router.patch("/:id", validateRequest(updateAdminSchema), adminController.updatedIntoDB);

router.delete("/:id", adminController.deleteIntoDB);
router.delete("/soft/:id", adminController.softDeleteIntoDB);

export const adminRoutes = router;