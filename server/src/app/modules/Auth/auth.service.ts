
import { UserStatus } from "@prisma/client";
import { jwtHelpars } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from "../../../config";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";



const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    };

    const accessToken = jwtHelpars.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpars.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
};

const refresToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpars.verifyToken(token, config.jwt.refresh_token_secret as Secret);

        console.log(decodedData)
    } catch (error) {
        throw new Error("You are not authorizeed!")
    }

    const isUserExist = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email
        }
    });


    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE
        }
    })
    const accessToken = jwtHelpars.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    )
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    }
};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });
    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    };
    const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: user.email
        },
        data: {
            password: hashPassword,
            needPasswordChange: false
        }
    });
    return {
        message: "Password changed successfully!"
    }
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = jwtHelpars.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    )

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )

};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {

    const userData = await prisma.user.findUnique({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });
    if(!userData){
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found!")
    }

    const isValidToken = jwtHelpars.verifyToken(token, config.jwt.reset_pass_secret as Secret);

    if(!isValidToken){
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden")
    }
    // hash password 
    const password: string = await bcrypt.hash(payload.password, 12);

    //update password
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
}

export const AuthService = {
    loginUser,
    refresToken,
    changePassword,
    forgotPassword,
    resetPassword
}