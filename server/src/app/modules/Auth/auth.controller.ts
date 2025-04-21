import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from 'http-status-codes';

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);

    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    })
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange,
        }
    });
});


const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refresToken(refreshToken);


    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Logged in successfully!",
        data: result
        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange: result.needPasswordChange,
        // }
    });
});

const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {

    const user = req.user
    const result = await AuthService.changePassword(user, req.body);


    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Password changed successfully!",
        data: result
    });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthService.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "",
        data: result
    });
})

export const AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
}