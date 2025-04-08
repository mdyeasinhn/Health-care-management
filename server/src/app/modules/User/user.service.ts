import { PrismaClient, UserRole } from "@prisma/client"

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
    const userData = {
        email: data.admin.email,
        password: data.password,
        role: UserRole.ADMIN,
    }

    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
            data: userData,
        });

        const createdAdminData = await transctionClient.admin.create({
            data: data.admin
        });
        return createdAdminData
    })
    return result
}

export const userService = {
    createAdmin
}