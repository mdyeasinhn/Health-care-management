
import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";



const getAllAdminFromDB = async (req: Request, res: Response) => {


    const filters = pick(req.query, ['name', 'email', 'searchTerm', 'conatctNumber'])
    try {
        const result = await adminService.getAllAdminFromDB(filters);

        res.status(200).json({
            success: true,
            message: "Retrieving All Admin Data from the Database",
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

