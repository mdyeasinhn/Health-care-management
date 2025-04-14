import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from 'http-status-codes';

const  loginUser= catchAsync(async(req: Request, res : Response)=>{
    const result = await AuthService.loginUser(req.body);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        success : true,
        message : "Logged in successfully!",
        data : result
    });
});

export const AuthController ={
    loginUser,
}