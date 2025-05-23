import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constents";
import { DoctorServices } from "./doctor.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);

    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await DoctorServices.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctors retrieval successfully!',
        meta: result.meta,
        data: result.data,
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorServices.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor retrieval successfully!', 
        data: result,
    });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await DoctorServices.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor data updated!",
        data: result
    })
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorServices.softDelete(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor soft deleted successfully!',
        data: result,
    });
});

export const DoctorController ={
    getAllFromDB,
    getByIdFromDB,
    softDelete,
    updateIntoDB
}