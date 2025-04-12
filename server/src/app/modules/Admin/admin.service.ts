import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constent";
const prisma = new PrismaClient();


const calculatePagenation = (options: {
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string
}) => {
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip: number = (Number(page) - 1) * limit;

    const sortBy: string = options.sortBy || 'createAt'
    const sortOrder: string = options.sortOrder || 'desc'

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder

    }
}

// Fetches all admin users from the database with optional search and filtering.

const getAllAdminFromDB = async (params: any, options: any) => {

    const { page, limit, skip } = calculatePagenation(options);
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
    return result;
};




export const adminService = {
    getAllAdminFromDB
}
