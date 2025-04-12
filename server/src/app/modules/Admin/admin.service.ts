import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fetches all admin users from the database with optional search and filtering.
 */
const getAllAdminFromDB = async (params: any) => {
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.AdminWhereInput[] = [];

    const adminSearchAbleFields = ['name', 'email'];

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
        where: whereConditions
    });
    return result;
};




export const adminService = {
    getAllAdminFromDB
}
