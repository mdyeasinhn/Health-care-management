import { Admin, Doctor, Patient, Prisma, User, UserRole, UserStatus } from "@prisma/client"
import bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { IPagenationOptions } from "../../interfaces/pagenations";
import { pagenationHelpars } from "../../../helpers/pagenationHelpars";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

//-------------Create Admin ------------------
const createAdmin = async (req: Request): Promise<Admin> => {
    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url

    }
    const hashPassword: string = await bcrypt.hash(req.body.password, 12);


    const userData = {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN,
    }

    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
            data: userData,
        });

        const createdAdminData = await transctionClient.admin.create({
            data: req.body.admin
        });
        return createdAdminData
    })
    return result
}
//-------------Create Doctor ------------------
const createDoctor = async (req: Request): Promise<Doctor> => {
    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url

    }
    const hashPassword: string = await bcrypt.hash(req.body.password, 12);


    const userData = {
        email: req.body.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR,
    }

    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
            data: userData,
        });

        const createdDoctorData = await transctionClient.doctor.create({
            data: req.body.doctor
        });
        return createdDoctorData
    })
    return result
}
//-------------Create Patient ------------------
const createPatient = async (req: Request): Promise<Patient> => {
    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.patient.profilePhoto = uploadToCloudinary?.secure_url

    }
    const hashPassword: string = await bcrypt.hash(req.body.password, 12);


    const userData = {
        email: req.body.patient.email,
        password: hashPassword,
        role: UserRole.PATIENT,
    }

    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
            data: userData,
        });

        const createdPatientData = await transctionClient.patient.create({
            data: req.body.patient
        });
        return createdPatientData
    })
    return result
};
//-------------Get all User---------------------
const getAllUserFromDB = async (params: any, options: IPagenationOptions) => {

    const { page, limit, skip } = pagenationHelpars.calculatePagenation(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    // If there's a search term, create OR conditions to search by name or email
    if (params.searchTerm) {
        andConditions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive" // Case-insensitive search
                }
            }))
        })
    };
    // If there are filter parameters, create AND conditions for exact matches
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };



    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            doctor: true,
            patient: true
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    })
    return {
        meta: {
            page,
            limit,
        },
        data: result
    };
};
//-------------Change Profile status-------------
const changeProfileStatus = async (id: string, data: UserStatus) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data
    })
    return updateUserStatus
};

//-------------Get My Profile-------------
const getMyProfile = async (user: IAuthUser) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        }
    })
    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    } else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    } else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.findUnique({
            where: {
                email: userInfo.email
            }
        })
    } else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    return { ...userInfo, ...profileInfo }
}

const updateMyProfile = async (user: IAuthUser, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    } else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    } else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    } else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: 
            req.body
        })
    }
    return { ...userInfo, ...profileInfo }

}
export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile,
}