
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
            meta: result.meta,
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



const getByIdFromDB = async (req: Request, res: Response) => {

    const { id } = req.params;
    try {
        const result = await adminService.getByIdFromDB(id)

        res.status(200).json({
            success: true,
            message: "Admin data fateched by id!",
            data: result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong!",
            error: err
        })
    }
};


const updatedIntoDB = async (req: Request, res: Response) => {

    const { id } = req.params;
    const data = req.body;  
    try {
        const result = await adminService.updatedIntoDB(id, data)

        res.status(200).json({
            success: true,
            message: "Admin data updated!",
            data: result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong!",
            error: err
        })
    }
};


const deleteIntoDB = async (req: Request, res: Response) => {

    const { id } = req.params;
    try {
        const result = await adminService.deleteFromDB(id)

        res.status(200).json({
            success: true,
            message: "Admin data deleted!",
            data: result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong!",
            error: err
        })
    }
}
const softDeleteIntoDB = async (req: Request, res: Response) => {

    const { id } = req.params;
    try {
        const result = await adminService.softDeleteFromDB(id)

        res.status(200).json({
            success: true,
            message: "Admin data deleted!",
            data: result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong!",
            error: err
        })
    }
}


export const adminController = {
    getAllAdminFromDB,
    getByIdFromDB,
    updatedIntoDB,
    deleteIntoDB,
    softDeleteIntoDB
}

