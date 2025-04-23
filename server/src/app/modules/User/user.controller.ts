import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createAdmin(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin Created successfull!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createDoctor(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor Created successfull!",
        data: result
    })
});

const createPatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createPatient(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Patient Created successfull!",
        data: result
    })
});

export const userController = {
    createAdmin,
    createDoctor,
    createPatient
}

