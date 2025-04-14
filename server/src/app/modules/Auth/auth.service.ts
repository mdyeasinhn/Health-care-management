
import { jwtHelpars } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
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
        "abcdefahijk",
        "5m"
    )

    const refreshToken = jwtHelpars.generateToken({
        email: userData.email,
        role: userData.role
    },
        "fdsaljfjljfd",
        "30d"
    )
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
};

const refresToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwt.verify(token, "fdsaljfjljfd");

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
            email: decodedData?.email
        }
    })
    const accessToken = jwtHelpars.generateToken({
        email: userData.email,
        role: userData.role
    },
        "abcdefahijk",
        "5m"
    )
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    }
}

export const AuthService = {
    loginUser,
    refresToken
}