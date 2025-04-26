import { Doctor, Prisma, UserStaus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IDoctorFilterRequest } from "./doctor.interface";
import { IPagenationOptions } from "../../interfaces/pagenations";
import { pagenationHelpars } from "../../../helpers/pagenationHelpars";
import { doctorSearchableFields } from "./doctor.constents";

const getAllFromDB = async (
    filters: IDoctorFilterRequest,
    options: IPagenationOptions,
) => {
    const { limit, page, skip } = pagenationHelpars.calculatePagenation(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    };

    // doctor > doctorSpecialties > specialties -> title

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialites: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        })
    };


    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        isDeleteAt: false,
    });

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctorSpecialties: {
                include: {
                    specialites: true
                }
            }
        },
    });

    const total = await prisma.doctor.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};


const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleteAt: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialites: true
                }
            },

        }
    });
    return result;
};

const updateIntoDB = async (id: string, payload: any) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updatedDoctorIntoDB = await prisma.doctor.update({
        where: {
            id
        },
        data: payload,
        include :{
            doctorSpecialties: true
        }
    })
    return updatedDoctorIntoDB
}


const softDelete = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async transactionClient => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleteAt: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: UserStaus.DELETED,
            },
        });

        return deleteDoctor;
    });
};


export const DoctorServices = {
    getAllFromDB,
    getByIdFromDB,
    softDelete,
    updateIntoDB
}  