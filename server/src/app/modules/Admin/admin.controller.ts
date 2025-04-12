
import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFileds } from "./admin.constent";



const getAllAdminFromDB = async (req: Request, res: Response) => {


    const filters = pick(req.query, adminFilterAbleFileds)
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    console.log('options', options)
    try {
        const result = await adminService.getAllAdminFromDB(filters, options);

        res.status(200).json({
            success: true,
            message: "Retrieving All Admin Data from the Database",
            meta : result.meta, 
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong!",
            error: err
        })
    }
};


export const adminController = {
    getAllAdminFromDB,
}

