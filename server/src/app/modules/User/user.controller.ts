import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { userFilterAbleFiled } from "./user.constant";
//-------------Create Admin ------------------
const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createAdmin(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin Created successfull!",
        data: result
    })
});
//-------------Create Doctor ------------------
const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createDoctor(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor Created successfull!",
        data: result
    })
});
//-------------Create Patient ------------------
const createPatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createPatient(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Patient Created successfull!",
        data: result
    })
});
//-------------Get all User---------------------
const getAllUserFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterAbleFiled);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await userService.getAllUserFromDB(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Retrieving all user data from the database",
        meta: result.meta,
        data: result?.data,
    });
});
//-------------Change Profile status-------------
const changeProfileStatus =catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const {id} = req.params;
    const result = await userService.changeProfileStatus(id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User profile status changed!",
        data: result,
    });
});
//-------------Change Profile status-------------
const getMyProfile =catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const user = req.user;

    const result = await userService.getMyProfile(user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Retrieving My Profile Data!",
        data: result,
    });
});

export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    changeProfileStatus,
    getMyProfile
}

