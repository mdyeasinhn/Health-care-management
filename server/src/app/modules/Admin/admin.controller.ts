import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFileds } from "./admin.constent";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from 'http-status-codes';
import catchAsync from "../../../shared/catchAsync";



// Get all admin data with filtering, pagination, and sorting
const getAllAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
    const filters = pick(req.query, adminFilterAbleFileds);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await adminService.getAllAdminFromDB(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Retrieving all admin data from the database",
        meta: result.meta,
        data: result,
    });
})

// Get a single admin by ID
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;


    const result = await adminService.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin data fetched by ID!",
        data: result,
    });
})

// Update admin data by ID
const updatedIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    const result = await adminService.updatedIntoDB(id, data);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin data updated!",
        data: result,
    });

})


// Permanently delete admin data by ID
const deleteIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin data deleted!",
        data: result,
    });
})

// Soft delete admin data by ID (mark as deleted without removing)
const softDeleteIntoDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;


    const result = await adminService.softDeleteFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin data soft-deleted!",
        data: result,
    });

})

// Export all admin controller methods
export const adminController = {
    getAllAdminFromDB,
    getByIdFromDB,
    updatedIntoDB,
    deleteIntoDB,
    softDeleteIntoDB,
};
