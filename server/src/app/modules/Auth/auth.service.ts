
import { UserStaus } from "@prisma/client";
import { jwtHelpars } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from "../../../config";



const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStaus.ACTIVE
        }
    })
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
            status: UserStaus.ACTIVE
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
            email: user.email
        }
    });
}

export const AuthService = {
    loginUser,
    refresToken,
    changePassword
}