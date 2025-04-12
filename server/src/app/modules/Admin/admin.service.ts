import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllAdminFromDB = async (params: any) => {

    const andConditions: Prisma.AdminWhereInput[] = [];

    const adminSearchAbleFields = ['name', 'email'];

    if (params.searchTerm) {
        andConditions.push({
            OR: adminSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    };
    console.dir(andConditions, { depth: 'inifinity' });
    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

    const result = await prisma.admin.findMany({
        where: whereConditions
    });
    return result
}

export const adminService = {
    getAllAdminFromDB
}