import { NextFunction, Request, Response } from 'express';
import { jwtHelpars } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!")
            }

            const verifiedUser = jwtHelpars.verifyToken(token, config.jwt.jwt_secret as Secret);

            req.user = verifiedUser

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!")
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}

export default auth;