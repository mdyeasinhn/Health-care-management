import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const insertIntoDB = catchAsync(async (req: Request, res: Response,) => {
    const result = await SpecialtiesService.insertIntoDB(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    })
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.getAllFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Specialties data fetched successfully!',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});
export const SpecialtiesController = {
    insertIntoDB,
    getAllFromDB,
    deleteFromDB
}