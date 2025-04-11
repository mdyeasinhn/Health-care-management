
import { Request, Response } from "express";
import { adminService } from "./admin.service";



const getAllAdminFromDB = async (req: Request, res: Response) => {
   // console.log(req.query)
    try {
        const result = await adminService.getAllAdminFromDB(req.query);

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

