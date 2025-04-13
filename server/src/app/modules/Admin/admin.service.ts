import { Admin, Prisma } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constent";
import { pagenationHelpars } from "../../../helpars/pagenationHelpars";
import prisma from "../../../shared/prisma";


// Fetches all admin users from the database with optional search and filtering.

const getAllAdminFromDB = async (params: any, options: any) => {

    const { page, limit, skip } = pagenationHelpars.calculatePagenation(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.AdminWhereInput[] = [];

    // If there's a search term, create OR conditions to search by name or email
    if (params.searchTerm) {
        andConditions.push({
            OR: adminSearchAbleFields.map(field => ({
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
                    equals: filterData[key]
                }
            }))
        })
    };

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.admin.count({
        where: whereConditions
    })
    return {
        meta: {
            page,
            limit,
        },
        result
    };
};


const getByIdFromDB = async (id: string) => {

    const result = await prisma.admin.findUnique({
        where: {
            id
        }
    })

    return result;
}
const updatedIntoDB = async (id: string, data: Partial<Admin>) => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.admin.update({
        where: {
            id
        },
        data
    })

    return result;
}

const deleteFromDB = async (id: string) => {
    const result = await prisma.$transaction(async (transationClient) => {
        const adminDeletedData = await transationClient.admin.delete({
            where: {
                id
            }
        });
        const userDeletedData = await transationClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        });

        return adminDeletedData
    });

    return result
}


export const adminService = {
    getAllAdminFromDB,
    getByIdFromDB,
    updatedIntoDB,
    deleteFromDB,
}
